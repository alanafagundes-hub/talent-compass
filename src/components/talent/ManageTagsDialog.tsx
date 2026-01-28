import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tags, Loader2 } from "lucide-react";
import type { Tag } from "@/types/ats";

interface ManageTagsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  applicationId: string;
  currentTags: Tag[];
  availableTags: Tag[];
  onAddTag: (applicationId: string, tagId: string) => Promise<boolean>;
  onRemoveTag: (applicationId: string, tagId: string) => Promise<boolean>;
}

export default function ManageTagsDialog({
  open,
  onOpenChange,
  candidateName,
  applicationId,
  currentTags,
  availableTags,
  onAddTag,
  onRemoveTag,
}: ManageTagsDialogProps) {
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(
    new Set(currentTags.map(t => t.id))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Map<string, 'add' | 'remove'>>(new Map());

  const handleTagToggle = (tagId: string, checked: boolean) => {
    const newSelected = new Set(selectedTagIds);
    const newPending = new Map(pendingChanges);
    
    const wasOriginallySelected = currentTags.some(t => t.id === tagId);
    
    if (checked) {
      newSelected.add(tagId);
      if (!wasOriginallySelected) {
        newPending.set(tagId, 'add');
      } else {
        newPending.delete(tagId);
      }
    } else {
      newSelected.delete(tagId);
      if (wasOriginallySelected) {
        newPending.set(tagId, 'remove');
      } else {
        newPending.delete(tagId);
      }
    }
    
    setSelectedTagIds(newSelected);
    setPendingChanges(newPending);
  };

  const handleSave = async () => {
    if (pendingChanges.size === 0) {
      onOpenChange(false);
      return;
    }

    setIsLoading(true);

    const promises: Promise<boolean>[] = [];

    pendingChanges.forEach((action, tagId) => {
      if (action === 'add') {
        promises.push(onAddTag(applicationId, tagId));
      } else {
        promises.push(onRemoveTag(applicationId, tagId));
      }
    });

    await Promise.all(promises);

    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5" />
            Gerenciar Etiquetas
          </DialogTitle>
          <DialogDescription>
            Selecione as etiquetas para {candidateName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[300px] pr-4">
          <div className="space-y-3 py-4">
            {availableTags.filter(t => !t.isArchived).map((tag) => (
              <div 
                key={tag.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`tag-${tag.id}`}
                  checked={selectedTagIds.has(tag.id)}
                  onCheckedChange={(checked) => 
                    handleTagToggle(tag.id, checked as boolean)
                  }
                />
                <label 
                  htmlFor={`tag-${tag.id}`}
                  className="flex-1 flex items-center gap-2 cursor-pointer"
                >
                  <Badge
                    variant="outline"
                    style={{ 
                      backgroundColor: `${tag.color}15`,
                      color: tag.color,
                      borderColor: `${tag.color}40`,
                    }}
                  >
                    {tag.name}
                  </Badge>
                </label>
              </div>
            ))}

            {availableTags.filter(t => !t.isArchived).length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                Nenhuma etiqueta disponível.
                <br />
                <span className="text-sm">
                  Crie etiquetas em Configurações.
                </span>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              `Salvar${pendingChanges.size > 0 ? ` (${pendingChanges.size})` : ''}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
