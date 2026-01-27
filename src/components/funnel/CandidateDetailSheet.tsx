import { useState, useMemo, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Mail,
  Phone,
  Linkedin,
  FileText,
  Calendar,
  Star,
  MessageSquare,
  UserX,
  UserPlus,
  ChevronRight,
  Download,
  ExternalLink,
  Send,
  Briefcase,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import type { KanbanCardData } from "@/hooks/useFunnelData";
import type { FunnelStep, Job, Area } from "@/types/ats";
import { RichTextarea } from "@/components/ui/rich-textarea";
import StageEvaluationBlock, {
  type StageEvaluation,
  type StageStatus,
} from "./StageEvaluationBlock";

interface CandidateDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: KanbanCardData | null;
  steps: FunnelStep[];
  job: Job | null;
  area: Area | undefined;
  onMarkAsLost: () => void;
  onAdvanceStage: () => void;
  onRate: () => void;
  onSaveStageEvaluation?: (
    cardId: string,
    stepId: string,
    rating: number | null,
    notes: string
  ) => Promise<boolean>;
}

export default function CandidateDetailSheet({
  open,
  onOpenChange,
  card,
  steps,
  job,
  area,
  onMarkAsLost,
  onAdvanceStage,
  onSaveStageEvaluation,
}: CandidateDetailSheetProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<
    { id: string; author: string; text: string; createdAt: Date }[]
  >([]);
  const [localEvaluations, setLocalEvaluations] = useState<
    Record<string, StageEvaluation>
  >({});
  const [showAdvanceBlockedDialog, setShowAdvanceBlockedDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!card) return null;

  const currentStep = steps.find((s) => s.id === card.stepId);
  const currentStepIndex = steps.findIndex((s) => s.id === card.stepId);
  const canAdvance = currentStepIndex < steps.length - 1;
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

  // Build evaluations map from existing ratings + local changes
  const evaluationsMap = useMemo(() => {
    const map: Record<string, StageEvaluation> = {};

    // First, populate from existing stage ratings
    if (card.stageRatings) {
      for (const rating of card.stageRatings) {
        map[rating.stepId] = {
          stepId: rating.stepId,
          rating: rating.rating,
          notes: rating.notes || "",
          evaluatedBy: rating.evaluatedBy,
          evaluatedAt: rating.evaluatedAt,
        };
      }
    }

    // Override with local changes
    for (const [stepId, evaluation] of Object.entries(localEvaluations)) {
      map[stepId] = evaluation;
    }

    return map;
  }, [card.stageRatings, localEvaluations]);

  // Get status for each stage
  const getStageStatus = (stepIndex: number): StageStatus => {
    if (stepIndex < currentStepIndex) {
      return "completed";
    } else if (stepIndex === currentStepIndex) {
      return "in_progress";
    }
    return "not_started";
  };

  // Check if current stage has required evaluation
  const currentStageEvaluation = evaluationsMap[card.stepId];
  const hasCurrentStageNotes = currentStageEvaluation?.notes?.trim();

  // Calculate average rating
  const averageRating = useMemo(() => {
    const ratings = Object.values(evaluationsMap)
      .filter((e) => e.rating)
      .map((e) => e.rating!);
    if (ratings.length === 0) return null;
    return Math.round(ratings.reduce((sum, r) => sum + r, 0) / ratings.length);
  }, [evaluationsMap]);

  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatDateTime = (date: Date) => {
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: `comment-${Date.now()}`,
        author: "Você",
        text: newComment,
        createdAt: new Date(),
      },
    ]);
    setNewComment("");
  };

  const handleSaveEvaluation = useCallback(
    async (stepId: string, rating: number | null, notes: string) => {
      // Update local state immediately
      setLocalEvaluations((prev) => ({
        ...prev,
        [stepId]: {
          stepId,
          rating,
          notes,
          evaluatedBy: "Você",
          evaluatedAt: new Date(),
        },
      }));

      // Persist to database if handler provided
      if (onSaveStageEvaluation && card) {
        setIsSaving(true);
        const success = await onSaveStageEvaluation(card.id, stepId, rating, notes);
        setIsSaving(false);
        if (success) {
          toast.success("Avaliação salva com sucesso");
        } else {
          toast.error("Erro ao salvar avaliação");
        }
      }
    },
    [card, onSaveStageEvaluation]
  );

  const handleAdvanceClick = () => {
    if (!hasCurrentStageNotes) {
      setShowAdvanceBlockedDialog(true);
      return;
    }
    onAdvanceStage();
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col">
          {/* Header - Without Avatar */}
          <SheetHeader className="px-6 py-4 border-b bg-muted/30">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl font-bold truncate">
                {card.candidate.name}
              </SheetTitle>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                <span className="truncate">{job?.title || "Vaga"}</span>
              </div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge
                  style={{
                    backgroundColor: `${currentStep?.color}20`,
                    color: currentStep?.color,
                    borderColor: currentStep?.color,
                  }}
                  variant="outline"
                >
                  {currentStep?.name || "Etapa"}
                </Badge>
                <Badge variant="secondary">Ativo</Badge>
                {averageRating && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span>{averageRating}/5</span>
                  </div>
                )}
              </div>
            </div>
          </SheetHeader>

          {/* Quick Actions */}
          <div className="px-6 py-3 border-b bg-background flex items-center gap-2 flex-wrap">
            {canAdvance && (
              <Button
                variant={hasCurrentStageNotes ? "default" : "outline"}
                size="sm"
                className="gap-1.5"
                onClick={handleAdvanceClick}
                disabled={isSaving}
              >
                <ChevronRight className="h-4 w-4" />
                Avançar Etapa
                {!hasCurrentStageNotes && (
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                )}
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-1.5">
              <UserPlus className="h-4 w-4" />
              Banco de Talentos
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-destructive hover:text-destructive"
              onClick={onMarkAsLost}
            >
              <UserX className="h-4 w-4" />
              Incompatível
            </Button>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Funnel Stages Section - Mirror of job funnel */}
              <section>
                <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3">
                  Avaliação por Etapa do Funil
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Preencha o parecer de cada etapa para garantir rastreabilidade.
                  O comentário é obrigatório para avançar o candidato.
                </p>
                <div className="space-y-2">
                  {sortedSteps.map((step, index) => (
                    <StageEvaluationBlock
                      key={step.id}
                      step={step}
                      status={getStageStatus(index)}
                      isCurrentStage={step.id === card.stepId}
                      evaluation={evaluationsMap[step.id]}
                      onSaveEvaluation={handleSaveEvaluation}
                      disabled={getStageStatus(index) === "not_started"}
                    />
                  ))}
                </div>
              </section>

              <Separator />

              {/* Profile Section */}
              <section>
                <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3">
                  Perfil do Candidato
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a
                      href={`mailto:${card.candidate.email}`}
                      className="text-primary hover:underline truncate"
                    >
                      {card.candidate.email}
                    </a>
                  </div>

                  {card.candidate.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <a
                        href={`tel:${card.candidate.phone}`}
                        className="hover:underline"
                      >
                        {card.candidate.phone}
                      </a>
                    </div>
                  )}

                  {card.candidate.linkedinUrl && (
                    <div className="flex items-center gap-3 text-sm">
                      <Linkedin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <a
                        href={card.candidate.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Ver perfil no LinkedIn
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {card.candidate.resumeUrl && (
                    <div className="flex items-center gap-3 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <a
                        href={card.candidate.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Visualizar currículo
                        <Download className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  <Separator className="my-3" />

                  {/* Origin/Tracking Section */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                      Origem da Candidatura
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-xs">Data</p>
                          <p className="font-medium">{formatDate(card.enteredAt)}</p>
                        </div>
                      </div>
                      {card.sourceName && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-muted-foreground text-xs">Fonte</p>
                            <p className="font-medium">{card.sourceName}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Detailed UTM tracking */}
                    {card.trackingData && (
                      <div className="mt-2 p-3 rounded-lg bg-muted/30 space-y-2 text-sm">
                        {card.trackingData.utm_medium && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Mídia</span>
                            <span className="font-medium">
                              {card.trackingData.utm_medium}
                            </span>
                          </div>
                        )}
                        {card.trackingData.utm_campaign && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Campanha</span>
                            <span className="font-medium">
                              {card.trackingData.utm_campaign}
                            </span>
                          </div>
                        )}
                        {card.trackingData.referrer && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Referrer</span>
                            <span
                              className="font-medium truncate max-w-[180px]"
                              title={card.trackingData.referrer}
                            >
                              {(() => {
                                try {
                                  return new URL(card.trackingData.referrer).hostname;
                                } catch {
                                  return card.trackingData.referrer.slice(0, 30);
                                }
                              })()}
                            </span>
                          </div>
                        )}
                        {card.trackingData.landing_page && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Página</span>
                            <span
                              className="font-medium truncate max-w-[180px]"
                              title={card.trackingData.landing_page}
                            >
                              {card.trackingData.landing_page.split("?")[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <Separator />

              {/* Comments Section */}
              <section>
                <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comentários Gerais
                </h3>

                {comments.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {comment.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">
                    Nenhum comentário geral ainda.
                  </p>
                )}

                <div className="space-y-2">
                  <RichTextarea
                    value={newComment}
                    onChange={setNewComment}
                    placeholder="Adicione um comentário geral..."
                    className="min-h-[80px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      className="gap-1.5"
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      <Send className="h-4 w-4" />
                      Enviar
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Blocked Advance Dialog */}
      <AlertDialog
        open={showAdvanceBlockedDialog}
        onOpenChange={setShowAdvanceBlockedDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Parecer Obrigatório
            </AlertDialogTitle>
            <AlertDialogDescription>
              Para avançar o candidato para a próxima etapa, é necessário preencher
              o parecer/comentário da etapa atual ({currentStep?.name}).
              <br />
              <br />
              Isso garante a rastreabilidade e qualidade das decisões no processo
              seletivo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar e Preencher</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
