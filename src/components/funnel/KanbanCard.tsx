import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Star, 
  MessageSquare, 
  ExternalLink,
  UserX,
  FileText
} from "lucide-react";
import type { Candidate, Tag } from "@/types/ats";

interface KanbanCardData {
  id: string;
  candidate: Candidate;
  rating?: number;
  notes?: string;
  tags?: Tag[];
  enteredAt: Date;
}

interface KanbanCardProps {
  card: KanbanCardData;
  onViewDetails?: (card: KanbanCardData) => void;
  onMarkAsLost?: (card: KanbanCardData) => void;
}

export default function KanbanCard({ card, onViewDetails, onMarkAsLost }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimeInStage = (enteredAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - enteredAt.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return "Agora";
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
        isDragging ? "opacity-50 shadow-lg rotate-2" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {getInitials(card.candidate.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{card.candidate.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {card.candidate.email}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails?.(card)}>
                <FileText className="mr-2 h-4 w-4" />
                Ver Detalhes
              </DropdownMenuItem>
              {card.candidate.linkedinUrl && (
                <DropdownMenuItem asChild>
                  <a href={card.candidate.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver LinkedIn
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onMarkAsLost?.(card)}
                className="text-destructive focus:text-destructive"
              >
                <UserX className="mr-2 h-4 w-4" />
                Marcar como Perdido
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Rating & Notes indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {card.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{card.rating}</span>
            </div>
          )}
          {card.notes && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
            </div>
          )}
          <span className="ml-auto">{formatTimeInStage(card.enteredAt)}</span>
        </div>

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-[10px] px-1.5 py-0"
                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
              >
                {tag.name}
              </Badge>
            ))}
            {card.tags.length > 3 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                +{card.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
