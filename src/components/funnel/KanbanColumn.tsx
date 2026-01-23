import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import KanbanCard from "./KanbanCard";
import type { Candidate, Tag, FunnelStep, CardStageRating } from "@/types/ats";

interface KanbanCardData {
  id: string;
  candidate: Candidate;
  stepId: string;
  sourceId?: string;
  sourceName?: string;
  rating?: number;
  notes?: string;
  tags?: Tag[];
  enteredAt: Date;
  stageRatings?: CardStageRating[];
}

interface KanbanColumnProps {
  step: FunnelStep;
  cards: KanbanCardData[];
  onViewDetails?: (card: KanbanCardData) => void;
  onMarkAsLost?: (card: KanbanCardData) => void;
  onRate?: (card: KanbanCardData) => void;
}

export default function KanbanColumn({ 
  step, 
  cards, 
  onViewDetails, 
  onMarkAsLost,
  onRate 
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: step.id,
  });

  return (
    <div className="flex flex-col w-72 shrink-0">
      {/* Column Header */}
      <div 
        className="flex items-center justify-between p-3 rounded-t-lg border-b-2"
        style={{ borderBottomColor: step.color || 'hsl(var(--border))' }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: step.color || 'hsl(var(--primary))' }}
          />
          <span className="font-medium text-sm">{step.name}</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {cards.length}
        </Badge>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-b-lg border border-t-0 bg-muted/30 transition-colors ${
          isOver ? "bg-primary/5 border-primary/30" : ""
        }`}
      >
        <ScrollArea className="h-[calc(100vh-280px)]">
          <SortableContext
            items={cards.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="p-2 space-y-2">
              {cards.map((card) => (
                <KanbanCard
                  key={card.id}
                  card={card}
                  onViewDetails={onViewDetails}
                  onMarkAsLost={onMarkAsLost}
                  onRate={onRate}
                />
              ))}
              
              {cards.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Nenhum candidato
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Arraste cards para cá
                  </p>
                </div>
              )}
            </div>
          </SortableContext>
        </ScrollArea>
      </div>
    </div>
  );
}
