import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import type { Candidate, Tag, FunnelStep, CardHistory, CardStageRating } from "@/types/ats";

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

interface KanbanBoardProps {
  steps: FunnelStep[];
  cards: KanbanCardData[];
  onCardMove: (cardId: string, fromStepId: string, toStepId: string) => void;
  onViewDetails?: (card: KanbanCardData) => void;
  onMarkAsLost?: (card: KanbanCardData) => void;
  onRate?: (card: KanbanCardData) => void;
}

export default function KanbanBoard({
  steps,
  cards,
  onCardMove,
  onViewDetails,
  onMarkAsLost,
  onRate,
}: KanbanBoardProps) {
  const [activeCard, setActiveCard] = useState<KanbanCardData | null>(null);
  const [localCards, setLocalCards] = useState(cards);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const card = localCards.find((c) => c.id === event.active.id);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeCardId = active.id as string;
    const overId = over.id as string;

    const activeCard = localCards.find((c) => c.id === activeCardId);
    if (!activeCard) return;

    // Check if dropping over a column
    const overStep = steps.find((s) => s.id === overId);
    if (overStep && activeCard.stepId !== overId) {
      setLocalCards((prev) =>
        prev.map((c) =>
          c.id === activeCardId ? { ...c, stepId: overId } : c
        )
      );
      return;
    }

    // Check if dropping over another card
    const overCard = localCards.find((c) => c.id === overId);
    if (overCard && activeCard.stepId !== overCard.stepId) {
      setLocalCards((prev) =>
        prev.map((c) =>
          c.id === activeCardId ? { ...c, stepId: overCard.stepId } : c
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeCardId = active.id as string;
    const originalCard = cards.find((c) => c.id === activeCardId);
    const movedCard = localCards.find((c) => c.id === activeCardId);

    if (!originalCard || !movedCard) return;

    // Only trigger move if step changed
    if (originalCard.stepId !== movedCard.stepId) {
      onCardMove(activeCardId, originalCard.stepId, movedCard.stepId);
    }
  };

  // Group cards by step
  const cardsByStep = steps.reduce((acc, step) => {
    acc[step.id] = localCards
      .filter((c) => c.stepId === step.id)
      .sort((a, b) => a.enteredAt.getTime() - b.enteredAt.getTime());
    return acc;
  }, {} as Record<string, KanbanCardData[]>);

  // Sync local cards when props change
  if (JSON.stringify(cards) !== JSON.stringify(localCards)) {
    setLocalCards(cards);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <ScrollArea className="w-full">
        <div className="flex gap-4 p-1 pb-4 min-w-max">
          {steps
            .sort((a, b) => a.order - b.order)
            .map((step) => (
              <KanbanColumn
                key={step.id}
                step={step}
                cards={cardsByStep[step.id] || []}
                onViewDetails={onViewDetails}
                onMarkAsLost={onMarkAsLost}
                onRate={onRate}
              />
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <DragOverlay>
        {activeCard && (
          <div className="w-72">
            <KanbanCard card={activeCard} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
