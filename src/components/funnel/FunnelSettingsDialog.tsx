import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  GripVertical, 
  Trash2, 
  Plus, 
  RotateCcw,
  Lock,
  Pencil,
  Check,
  X
} from "lucide-react";
import type { FunnelStep } from "@/types/ats";
import { defaultFunnelStages } from "@/types/ats";
import { toast } from "sonner";

interface FunnelSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  steps: FunnelStep[];
  cardCountByStep: Record<string, number>;
  onSave: (steps: FunnelStep[]) => void;
  jobId: string;
}

interface SortableStepItemProps {
  step: FunnelStep;
  cardCount: number;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

function SortableStepItem({ step, cardCount, onRename, onDelete }: SortableStepItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(step.name);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const canDelete = cardCount === 0;

  const handleSave = () => {
    if (editName.trim()) {
      onRename(step.id, editName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(step.name);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border bg-card ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <button
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div 
        className="w-3 h-3 rounded-full shrink-0" 
        style={{ backgroundColor: step.color || 'hsl(var(--primary))' }}
      />

      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="h-8"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
          />
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <span className="flex-1 font-medium">{step.name}</span>
          
          {cardCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {cardCount} candidato{cardCount !== 1 ? "s" : ""}
            </Badge>
          )}

          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          {canDelete ? (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(step.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground"
                  disabled
                >
                  <Lock className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Não pode ser excluída enquanto tiver candidatos</p>
              </TooltipContent>
            </Tooltip>
          )}
        </>
      )}
    </div>
  );
}

export default function FunnelSettingsDialog({
  open,
  onOpenChange,
  steps,
  cardCountByStep,
  onSave,
  jobId,
}: FunnelSettingsDialogProps) {
  const [localSteps, setLocalSteps] = useState<FunnelStep[]>([]);

  useEffect(() => {
    setLocalSteps([...steps].sort((a, b) => a.order - b.order));
  }, [steps, open]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLocalSteps((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      return newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const handleRename = (id: string, name: string) => {
    setLocalSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name } : s))
    );
  };

  const handleDelete = (id: string) => {
    setLocalSteps((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      return filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
    });
  };

  const handleAddStep = () => {
    const newStep: FunnelStep = {
      id: `step-${Date.now()}`,
      jobId,
      name: `Nova Etapa ${localSteps.length + 1}`,
      stage: "triagem",
      order: localSteps.length + 1,
      color: "#6366f1",
      isArchived: false,
      createdAt: new Date(),
    };
    setLocalSteps([...localSteps, newStep]);
  };

  const handleResetToDefault = () => {
    const hasCards = Object.values(cardCountByStep).some((count) => count > 0);
    if (hasCards) {
      toast.error("Não é possível resetar com candidatos no funil");
      return;
    }

    const defaultSteps = defaultFunnelStages.map((stage, index) => ({
      id: `default-${index + 1}`,
      jobId,
      name: stage.name,
      stage: "triagem" as const,
      order: stage.order,
      color: stage.color,
      isArchived: false,
      createdAt: new Date(),
    }));
    setLocalSteps(defaultSteps);
  };

  const handleSave = () => {
    if (localSteps.length < 2) {
      toast.error("O funil precisa ter pelo menos 2 etapas");
      return;
    }
    onSave(localSteps);
    onOpenChange(false);
    toast.success("Etapas do funil atualizadas!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Configurar Etapas do Funil</DialogTitle>
          <DialogDescription>
            Arraste para reordenar, clique no lápis para renomear.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localSteps.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {localSteps.map((step) => (
                  <SortableStepItem
                    key={step.id}
                    step={step}
                    cardCount={cardCountByStep[step.id] || 0}
                    onRename={handleRename}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleAddStep}>
              <Plus className="h-4 w-4" />
              Adicionar Etapa
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleResetToDefault}>
              <RotateCcw className="h-4 w-4" />
              Resetar
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Etapas com candidatos não podem ser excluídas.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
