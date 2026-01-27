import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Clock, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { FunnelStep } from "@/types/ats";
import type { StageHistoryEntry } from "@/hooks/useFunnelData";

interface ProcessTimelineBlockProps {
  steps: FunnelStep[];
  currentStepId: string;
  stageHistory?: StageHistoryEntry[];
  appliedAt: Date;
}

export default function ProcessTimelineBlock({
  steps,
  currentStepId,
  stageHistory = [],
  appliedAt,
}: ProcessTimelineBlockProps) {
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
  const currentStepIndex = sortedSteps.findIndex((s) => s.id === currentStepId);

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const formatDateTime = (date: Date) => {
    return format(date, "dd/MM 'às' HH:mm", { locale: ptBR });
  };

  // Find entry date for each step
  const getStepEntryDate = (stepId: string, stepIndex: number): Date | null => {
    const historyEntry = stageHistory?.find((h) => h.stepId === stepId);
    if (historyEntry) {
      return historyEntry.enteredAt;
    }
    // For the first step, use appliedAt if no history
    if (stepIndex === 0 && currentStepIndex >= 0) {
      return appliedAt;
    }
    return null;
  };

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-border" />

      <div className="space-y-4">
        {sortedSteps.map((step, index) => {
          const isCurrentStep = step.id === currentStepId;
          const isPastStep = index < currentStepIndex;
          const isFutureStep = index > currentStepIndex;
          const entryDate = getStepEntryDate(step.id, index);

          return (
            <div
              key={step.id}
              className={`relative flex items-start gap-3 pl-6 ${
                isFutureStep ? "opacity-40" : ""
              }`}
            >
              {/* Status indicator */}
              <div
                className={`absolute left-0 w-4 h-4 rounded-full flex items-center justify-center ${
                  isPastStep
                    ? "bg-green-500 text-white"
                    : isCurrentStep
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-muted border-2 border-border"
                }`}
              >
                {isPastStep ? (
                  <Check className="h-2.5 w-2.5" />
                ) : isCurrentStep ? (
                  <Clock className="h-2.5 w-2.5" />
                ) : (
                  <Circle className="h-2 w-2 text-muted-foreground/50" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 -mt-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-medium text-sm ${
                      isCurrentStep ? "text-primary" : ""
                    }`}
                  >
                    {step.name}
                  </span>
                  {isCurrentStep && (
                    <Badge variant="default" className="text-[10px] px-1.5 py-0">
                      Atual
                    </Badge>
                  )}
                </div>
                {entryDate && (isPastStep || isCurrentStep) && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isCurrentStep ? "Desde " : ""}
                    {formatDateTime(entryDate)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
