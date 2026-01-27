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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
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
  Calendar,
  Star,
  UserX,
  UserPlus,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Briefcase,
  MapPin,
  AlertTriangle,
  UserCheck,
  Copy,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import type { KanbanCardData } from "@/hooks/useFunnelData";
import type { FunnelStep, Job, Area, Tag } from "@/types/ats";
import StageEvaluationBlock, {
  type StageEvaluation,
  type StageStatus,
} from "./StageEvaluationBlock";
import FormResponsesBlock from "./FormResponsesBlock";
import TagsBlock from "./TagsBlock";
import ProcessTimelineBlock from "./ProcessTimelineBlock";
import ResumeBlock from "./ResumeBlock";

interface CandidateDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: KanbanCardData | null;
  steps: FunnelStep[];
  job: Job | null;
  area: Area | undefined;
  availableTags?: Tag[];
  onMarkAsLost: () => void;
  onAdvanceStage: () => void;
  onRate: () => void;
  onHire?: () => void;
  onAddToTalentPool?: () => void;
  onAddTag?: (cardId: string, tagId: string) => void;
  onRemoveTag?: (cardId: string, tagId: string) => void;
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
  availableTags = [],
  onMarkAsLost,
  onAdvanceStage,
  onHire,
  onAddToTalentPool,
  onAddTag,
  onRemoveTag,
  onSaveStageEvaluation,
}: CandidateDetailSheetProps) {
  const [localEvaluations, setLocalEvaluations] = useState<
    Record<string, StageEvaluation>
  >({});
  const [showAdvanceBlockedDialog, setShowAdvanceBlockedDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["stages", "profile", "resume", "form", "tags", "timeline"])
  );

  // All hooks must be called before any early returns
  const currentStep = card ? steps.find((s) => s.id === card.stepId) : undefined;
  const currentStepIndex = card ? steps.findIndex((s) => s.id === card.stepId) : -1;
  const sortedSteps = useMemo(() => [...steps].sort((a, b) => a.order - b.order), [steps]);
  const isLastStage = currentStepIndex === sortedSteps.length - 1;
  const canAdvance = currentStepIndex >= 0 && currentStepIndex < sortedSteps.length - 1;

  // Build evaluations map from existing ratings + local changes
  const evaluationsMap = useMemo(() => {
    const map: Record<string, StageEvaluation> = {};

    if (!card) return map;

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
  }, [card, localEvaluations]);

  // Get status for each stage
  const getStageStatus = useCallback(
    (stepIndex: number): StageStatus => {
      if (stepIndex < currentStepIndex) {
        return "completed";
      } else if (stepIndex === currentStepIndex) {
        return "in_progress";
      }
      return "not_started";
    },
    [currentStepIndex]
  );

  // Check if current stage has required evaluation
  const currentStageEvaluation = card ? evaluationsMap[card.stepId] : undefined;
  const hasCurrentStageNotes = currentStageEvaluation?.notes?.trim();

  // Calculate average rating
  const averageRating = useMemo(() => {
    const ratings = Object.values(evaluationsMap)
      .filter((e) => e.rating)
      .map((e) => e.rating!);
    if (ratings.length === 0) return null;
    return (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1);
  }, [evaluationsMap]);

  const formatDate = useCallback((date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  }, []);

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

  const handleAdvanceClick = useCallback(() => {
    if (!hasCurrentStageNotes) {
      setShowAdvanceBlockedDialog(true);
      return;
    }
    onAdvanceStage();
  }, [hasCurrentStageNotes, onAdvanceStage]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const getStatusBadge = () => {
    if (!card) return null;
    switch (card.status) {
      case "contratada":
        return <Badge className="bg-green-500">Contratado</Badge>;
      case "incompativel":
        return <Badge variant="destructive">Incompatível</Badge>;
      case "desistente":
        return <Badge variant="secondary">Desistente</Badge>;
      default:
        return <Badge variant="secondary">Ativo</Badge>;
    }
  };

  // Early return AFTER all hooks
  if (!card) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 flex flex-col">
          {/* ========== HEADER (FIXED) ========== */}
          <SheetHeader className="px-6 py-4 border-b bg-muted/30 shrink-0">
            <div className="flex-1 min-w-0">
              {/* Candidate Name */}
              <SheetTitle className="text-xl font-bold truncate">
                {card.candidate.name}
              </SheetTitle>

              {/* Job Title */}
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                <span className="truncate">{job?.title || "Vaga"}</span>
                {area && (
                  <>
                    <span>•</span>
                    <span>{area.name}</span>
                  </>
                )}
              </div>

              {/* Badges Row */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {/* Current Stage */}
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

                {/* Status */}
                {getStatusBadge()}

                {/* Average Rating */}
                {averageRating && (
                  <div className="flex items-center gap-1 text-sm bg-muted px-2 py-0.5 rounded">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{averageRating}/5</span>
                  </div>
                )}

                {/* Tags Preview */}
                {card.tags && card.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    {card.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        style={{
                          backgroundColor: `${tag.color}15`,
                          color: tag.color,
                          borderColor: `${tag.color}50`,
                        }}
                        className="text-[10px] px-1.5"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                    {card.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{card.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </SheetHeader>

          {/* ========== QUICK ACTIONS BAR ========== */}
          <div className="px-6 py-3 border-b bg-background flex items-center gap-2 flex-wrap shrink-0">
            {/* Advance Stage */}
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

            {/* Hire Button - Only on last stage */}
            {isLastStage && onHire && (
              <Button
                size="sm"
                className="gap-1.5 bg-green-600 hover:bg-green-700"
                onClick={onHire}
              >
                <UserCheck className="h-4 w-4" />
                Contratar
              </Button>
            )}

            {/* Talent Pool */}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={onAddToTalentPool}
            >
              <UserPlus className="h-4 w-4" />
              Banco de Talentos
            </Button>

            {/* Mark as Lost */}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-destructive hover:text-destructive"
              onClick={onMarkAsLost}
            >
              <UserX className="h-4 w-4" />
              Incompatível
            </Button>

            {/* Quick Links */}
            <div className="flex items-center gap-1 ml-auto">
              {card.candidate.linkedinUrl && (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                  <a
                    href={card.candidate.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* ========== SCROLLABLE CONTENT ========== */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
              {/* ========== BLOCK 1: CANDIDATE DATA ========== */}
              <Collapsible
                open={expandedSections.has("profile")}
                onOpenChange={() => toggleSection("profile")}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded -mx-2 px-2">
                  <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                    Dados do Candidato
                  </h3>
                  {expandedSections.has("profile") ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 space-y-3">
                  {/* Email */}
                  <div className="flex items-center gap-3 text-sm group">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a
                      href={`mailto:${card.candidate.email}`}
                      className="text-primary hover:underline truncate"
                    >
                      {card.candidate.email}
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      onClick={() => copyToClipboard(card.candidate.email, "E-mail")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Phone */}
                  {card.candidate.phone && (
                    <div className="flex items-center gap-3 text-sm group">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <a
                        href={`tel:${card.candidate.phone}`}
                        className="hover:underline"
                      >
                        {card.candidate.phone}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        onClick={() => copyToClipboard(card.candidate.phone!, "Telefone")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  {/* LinkedIn */}
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
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* ========== BLOCK 2: APPLICATION SOURCE ========== */}
              <Collapsible
                open={expandedSections.has("source")}
                onOpenChange={() => toggleSection("source")}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded -mx-2 px-2">
                  <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                    Origem da Candidatura
                  </h3>
                  {expandedSections.has("source") ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {/* Application Date */}
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-muted-foreground text-xs">Data de Inscrição</p>
                        <p className="font-medium">{formatDate(card.appliedAt)}</p>
                      </div>
                    </div>

                    {/* Source */}
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

                  {/* UTM Details */}
                  {card.trackingData && (
                    <div className="mt-3 p-3 rounded-lg bg-muted/30 space-y-2 text-sm">
                      {card.trackingData.utm_campaign && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Campanha</span>
                          <span className="font-medium">{card.trackingData.utm_campaign}</span>
                        </div>
                      )}
                      {card.trackingData.utm_medium && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mídia</span>
                          <span className="font-medium">{card.trackingData.utm_medium}</span>
                        </div>
                      )}
                      {card.trackingData.referrer && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Referrer</span>
                          <span className="font-medium truncate max-w-[180px]">
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
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* ========== BLOCK 3: RESUME ========== */}
              <Collapsible
                open={expandedSections.has("resume")}
                onOpenChange={() => toggleSection("resume")}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded -mx-2 px-2">
                  <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                    Currículo
                  </h3>
                  {expandedSections.has("resume") ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <ResumeBlock
                    resumeUrl={card.candidate.resumeUrl}
                    candidateName={card.candidate.name}
                  />
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* ========== BLOCK 4: FORM RESPONSES ========== */}
              <Collapsible
                open={expandedSections.has("form")}
                onOpenChange={() => toggleSection("form")}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded -mx-2 px-2">
                  <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                    Respostas do Formulário
                    {card.formResponses && card.formResponses.length > 0 && (
                      <Badge variant="secondary" className="ml-2 text-[10px]">
                        {card.formResponses.length}
                      </Badge>
                    )}
                  </h3>
                  {expandedSections.has("form") ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <FormResponsesBlock responses={card.formResponses || []} />
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* ========== BLOCK 5: TAGS ========== */}
              <Collapsible
                open={expandedSections.has("tags")}
                onOpenChange={() => toggleSection("tags")}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded -mx-2 px-2">
                  <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                    Etiquetas
                  </h3>
                  {expandedSections.has("tags") ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <TagsBlock
                    cardTags={card.tags || []}
                    availableTags={availableTags}
                    onAddTag={onAddTag ? (tagId) => onAddTag(card.id, tagId) : undefined}
                    onRemoveTag={onRemoveTag ? (tagId) => onRemoveTag(card.id, tagId) : undefined}
                    readOnly={!onAddTag && !onRemoveTag}
                  />
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* ========== BLOCK 6: FUNNEL STAGES (CORE) ========== */}
              <Collapsible
                open={expandedSections.has("stages")}
                onOpenChange={() => toggleSection("stages")}
                defaultOpen
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded -mx-2 px-2">
                  <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                    Avaliação por Etapa do Funil
                  </h3>
                  {expandedSections.has("stages") ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <p className="text-xs text-muted-foreground mb-4">
                    O parecer de cada etapa é obrigatório para avançar o candidato.
                    Avalie cada etapa para garantir rastreabilidade do processo.
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
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* ========== TIMELINE ========== */}
              <Collapsible
                open={expandedSections.has("timeline")}
                onOpenChange={() => toggleSection("timeline")}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded -mx-2 px-2">
                  <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                    Timeline do Processo
                  </h3>
                  {expandedSections.has("timeline") ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <ProcessTimelineBlock
                    steps={sortedSteps}
                    currentStepId={card.stepId}
                    stageHistory={card.stageHistory}
                    appliedAt={card.appliedAt}
                  />
                </CollapsibleContent>
              </Collapsible>
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
