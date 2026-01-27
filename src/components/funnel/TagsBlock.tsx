import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, X } from "lucide-react";
import type { Tag } from "@/types/ats";

interface TagsBlockProps {
  cardTags: Tag[];
  availableTags: Tag[];
  onAddTag?: (tagId: string) => void;
  onRemoveTag?: (tagId: string) => void;
  readOnly?: boolean;
}

export default function TagsBlock({
  cardTags,
  availableTags,
  onAddTag,
  onRemoveTag,
  readOnly = false,
}: TagsBlockProps) {
  const [isOpen, setIsOpen] = useState(false);

  const unassignedTags = availableTags.filter(
    (tag) => !cardTags.some((ct) => ct.id === tag.id)
  );

  const handleAddTag = (tagId: string) => {
    onAddTag?.(tagId);
    if (unassignedTags.length <= 1) {
      setIsOpen(false);
    }
  };

  if (cardTags.length === 0 && readOnly) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma etiqueta associada.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {cardTags.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          style={{
            backgroundColor: `${tag.color}20`,
            color: tag.color,
            borderColor: tag.color,
          }}
          className="gap-1 pr-1"
        >
          {tag.name}
          {!readOnly && onRemoveTag && (
            <button
              onClick={() => onRemoveTag(tag.id)}
              className="ml-1 rounded-full hover:bg-black/10 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}

      {!readOnly && onAddTag && unassignedTags.length > 0 && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-6 px-2 gap-1">
              <Plus className="h-3 w-3" />
              Adicionar
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="start">
            <div className="space-y-1">
              {unassignedTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleAddTag(tag.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted text-sm text-left"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
