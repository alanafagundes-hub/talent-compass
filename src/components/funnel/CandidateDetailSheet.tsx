import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mail,
  Phone,
  Linkedin,
  FileText,
  Calendar,
  Clock,
  Star,
  MessageSquare,
  UserX,
  UserPlus,
  ChevronRight,
  Download,
  ExternalLink,
  Send,
  User,
  Briefcase,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { KanbanCardData } from "@/hooks/useFunnelData";
import type { FunnelStep, Job, Area } from "@/types/ats";
import { RichTextarea } from "@/components/ui/rich-textarea";

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
  onRate,
}: CandidateDetailSheetProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<
    { id: string; author: string; text: string; createdAt: Date }[]
  >([]);

  if (!card) return null;

  const currentStep = steps.find((s) => s.id === card.stepId);
  const currentStepIndex = steps.findIndex((s) => s.id === card.stepId);
  const canAdvance = currentStepIndex < steps.length - 1;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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

  // Calculate average rating from stage evaluations
  const averageRating = card.stageRatings && card.stageRatings.length > 0
    ? Math.round(
        card.stageRatings.reduce((sum, r) => sum + r.rating, 0) /
          card.stageRatings.length
      )
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b bg-muted/30">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {getInitials(card.candidate.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl font-bold truncate">
                {card.candidate.name}
              </SheetTitle>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                <span className="truncate">{job?.title || "Vaga"}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
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
          </div>
        </SheetHeader>

        {/* Quick Actions */}
        <div className="px-6 py-3 border-b bg-background flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={onRate}
          >
            <Star className="h-4 w-4" />
            Avaliar
          </Button>
          {canAdvance && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={onAdvanceStage}
            >
              <ChevronRight className="h-4 w-4" />
              Avançar Etapa
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
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

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-muted-foreground text-xs">Candidatura</p>
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
              </div>
            </section>

            <Separator />

            {/* Evaluation Section */}
            <section>
              <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3">
                Avaliações por Etapa
              </h3>
              {card.stageRatings && card.stageRatings.length > 0 ? (
                <div className="space-y-2">
                  {card.stageRatings.map((rating) => (
                    <div
                      key={rating.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium text-sm">{rating.stepName}</p>
                        {rating.notes && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {rating.notes}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Por {rating.evaluatedBy} • {formatDateTime(rating.evaluatedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= rating.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhuma avaliação registrada ainda.
                </p>
              )}
            </section>

            <Separator />

            {/* Timeline Section */}
            <section>
              <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3">
                Timeline do Processo
              </h3>
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const isCurrentStep = step.id === card.stepId;
                  const isPastStep = index < currentStepIndex;
                  const isFutureStep = index > currentStepIndex;

                  return (
                    <div
                      key={step.id}
                      className={`flex items-start gap-3 ${
                        isFutureStep ? "opacity-40" : ""
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${
                          isCurrentStep
                            ? "ring-4 ring-primary/20"
                            : ""
                        }`}
                        style={{
                          backgroundColor: isPastStep || isCurrentStep
                            ? step.color
                            : "transparent",
                          border: `2px solid ${step.color}`,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`font-medium text-sm ${
                              isCurrentStep ? "text-primary" : ""
                            }`}
                          >
                            {step.name}
                          </p>
                          {isCurrentStep && (
                            <Badge variant="secondary" className="text-xs">
                              Atual
                            </Badge>
                          )}
                        </div>
                        {isCurrentStep && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Desde {formatDate(card.enteredAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <Separator />

            {/* Comments Section */}
            <section>
              <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comentários
              </h3>

              {comments.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {getInitials(comment.author)}
                          </AvatarFallback>
                        </Avatar>
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
                  Nenhum comentário ainda. Seja o primeiro a comentar!
                </p>
              )}

              <div className="space-y-2">
                <RichTextarea
                  value={newComment}
                  onChange={setNewComment}
                  placeholder="Adicione um comentário..."
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
  );
}
