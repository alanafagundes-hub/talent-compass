import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Star,
  ChevronDown,
  ChevronRight,
  Check,
  Clock,
  Circle,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { FunnelStep } from "@/types/ats";

export type StageStatus = "not_started" | "in_progress" | "completed";

export interface StageEvaluation {
  stepId: string;
  rating: number | null;
  notes: string;
  evaluatedBy?: string;
  evaluatedAt?: Date;
}

interface StageEvaluationBlockProps {
  step: FunnelStep;
  status: StageStatus;
  isCurrentStage: boolean;
  evaluation?: StageEvaluation;
  onSaveEvaluation: (stepId: string, rating: number | null, notes: string) => void;
  disabled?: boolean;
}

export default function StageEvaluationBlock({
  step,
  status,
  isCurrentStage,
  evaluation,
  onSaveEvaluation,
  disabled = false,
}: StageEvaluationBlockProps) {
  const [isOpen, setIsOpen] = useState(isCurrentStage);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState<number | null>(evaluation?.rating ?? null);
  const [notes, setNotes] = useState(evaluation?.notes || "");
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  // Sync with external evaluation changes
  useEffect(() => {
    setRating(evaluation?.rating ?? null);
    setNotes(evaluation?.notes || "");
  }, [evaluation]);

  // Auto-open current stage
  useEffect(() => {
    if (isCurrentStage) {
      setIsOpen(true);
    }
  }, [isCurrentStage]);

  const handleSave = () => {
    onSaveEvaluation(step.id, rating, notes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setRating(evaluation?.rating ?? null);
    setNotes(evaluation?.notes || "");
    setIsEditing(false);
  };

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground/40" />;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "completed":
        return "Concluída";
      case "in_progress":
        return "Em avaliação";
      default:
        return "Não iniciada";
    }
  };

  const getStatusBadgeVariant = () => {
    switch (status) {
      case "completed":
        return "default" as const;
      case "in_progress":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  const formatDateTime = (date: Date) => {
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const hasEvaluation = evaluation && (evaluation.rating || evaluation.notes);
  const showEditMode = isEditing || (isCurrentStage && !hasEvaluation);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={`border rounded-lg overflow-hidden transition-all ${
          isCurrentStage
            ? "border-primary/50 bg-primary/5"
            : status === "completed"
            ? "border-green-200 bg-green-50/30 dark:bg-green-950/10 dark:border-green-900/30"
            : "border-border"
        }`}
      >
        <CollapsibleTrigger asChild>
          <button
            className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left"
            disabled={disabled}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: step.color }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{step.name}</span>
                  {isCurrentStage && (
                    <Badge variant="default" className="text-[10px] px-1.5 py-0">
                      Atual
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasEvaluation && rating && (
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                {getStatusIcon()}
                <Badge variant={getStatusBadgeVariant()} className="text-[10px]">
                  {getStatusLabel()}
                </Badge>
              </div>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-3 pb-3 pt-1 space-y-3 border-t">
            {showEditMode && !disabled ? (
              <>
                {/* Rating Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Nota da Etapa
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="p-1 hover:scale-110 transition-transform"
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(null)}
                        onClick={() => setRating(rating === star ? null : star)}
                      >
                        <Star
                          className={`h-5 w-5 transition-colors ${
                            star <= (hoveredStar ?? rating ?? 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/30 hover:text-yellow-300"
                          }`}
                        />
                      </button>
                    ))}
                    {rating && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        {rating}/5
                      </span>
                    )}
                  </div>
                </div>

                {/* Notes Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Parecer / Comentário{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Registre sua avaliação detalhada sobre o candidato nesta etapa..."
                    className="min-h-[80px] text-sm"
                  />
                  {!notes.trim() && (
                    <p className="text-xs text-destructive">
                      O parecer é obrigatório para avançar o candidato
                    </p>
                  )}
                </div>

                {/* Save/Cancel Buttons */}
                <div className="flex justify-end gap-2">
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      className="gap-1.5"
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancelar
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!notes.trim()}
                    className="gap-1.5"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Salvar Avaliação
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Read-only evaluation display */}
                {hasEvaluation ? (
                  <div className="space-y-2">
                    {evaluation.rating && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Nota:</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= evaluation.rating!
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm font-medium">
                            {evaluation.rating}/5
                          </span>
                        </div>
                      </div>
                    )}
                    {evaluation.notes && (
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Parecer:</span>
                        <p className="text-sm bg-muted/30 rounded p-2 whitespace-pre-wrap">
                          {evaluation.notes}
                        </p>
                      </div>
                    )}
                    {evaluation.evaluatedAt && (
                      <p className="text-xs text-muted-foreground">
                        Por {evaluation.evaluatedBy || "admin"} •{" "}
                        {formatDateTime(evaluation.evaluatedAt)}
                      </p>
                    )}
                    {!disabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="gap-1.5 mt-1"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Editar Avaliação
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      {status === "not_started"
                        ? "O candidato ainda não chegou a esta etapa"
                        : "Nenhuma avaliação registrada"}
                    </p>
                    {status !== "not_started" && !disabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="gap-1.5 mt-2"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Adicionar Avaliação
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
