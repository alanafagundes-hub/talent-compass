import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  FileText,
  Award,
  Briefcase,
  Tags,
  Archive
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Candidate, Tag, CardStageRating } from "@/types/ats";

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

interface KanbanCardProps {
  card: KanbanCardData;
  onViewDetails?: (card: KanbanCardData) => void;
  onMarkAsLost?: (card: KanbanCardData) => void;
  onRate?: (card: KanbanCardData) => void;
  onLinkToJob?: (card: KanbanCardData) => void;
  onManageTags?: (card: KanbanCardData) => void;
  onArchive?: (card: KanbanCardData) => void;
}

export default function KanbanCard({ 
  card, 
  onViewDetails, 
  onMarkAsLost, 
  onRate,
  onLinkToJob,
  onManageTags,
  onArchive 
}: KanbanCardProps) {
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

  // Calculate average rating from stage evaluations
  const averageRating = card.stageRatings && card.stageRatings.length > 0
    ? Math.round(
        card.stageRatings.reduce((sum, r) => sum + r.rating, 0) /
          card.stageRatings.length
      )
    : card.rating || null;

  // Get Fit Cultural (rating from "Entrevista RH" stage)
  const fitCultural = card.stageRatings?.find(
    r => r.stepName.toLowerCase().includes('entrevista rh')
  )?.rating || null;

  const fitCulturalColor = fitCultural ? ({
    1: '#ef4444',
    2: '#f97316',
    3: '#eab308',
    4: '#22c55e',
    5: '#10b981',
  } as Record<number, string>)[fitCultural] : undefined;

  const fitCulturalTooltip = fitCultural ? ({
    1: 'Fit Cultural Baixo',
    2: 'Fit Cultural Abaixo da Média',
    3: 'Fit Cultural Médio',
    4: 'Fit Cultural Bom',
    5: 'Fit Cultural Excelente',
  } as Record<number, string>)[fitCultural] : undefined;

  const formatTimeInStage = (enteredAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - enteredAt.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return "Agora";
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if not clicking on dropdown menu
    if ((e.target as HTMLElement).closest('[data-radix-popper-content-wrapper]')) return;
    if ((e.target as HTMLElement).closest('[role="menu"]')) return;
    if ((e.target as HTMLElement).closest('button')) return;
    onViewDetails?.(card);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
        isDragging ? "opacity-50 shadow-lg rotate-2" : ""
      }`}
      onClick={handleCardClick}
      {...attributes}
      {...listeners}
    >
      <div className="space-y-2.5">
        {/* Header - Name and Actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm leading-tight truncate">{card.candidate.name}</p>
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
              <DropdownMenuItem onClick={() => onRate?.(card)}>
                <Award className="mr-2 h-4 w-4" />
                Avaliar nesta Etapa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {onLinkToJob && (
                <DropdownMenuItem onClick={() => onLinkToJob(card)}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Vincular a outra vaga
                </DropdownMenuItem>
              )}
              {onManageTags && (
                <DropdownMenuItem onClick={() => onManageTags(card)}>
                  <Tags className="mr-2 h-4 w-4" />
                  Gerenciar etiquetas
                </DropdownMenuItem>
              )}
              {onArchive && (
                <DropdownMenuItem onClick={() => onArchive(card)}>
                  <Archive className="mr-2 h-4 w-4" />
                  Arquivar candidato
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

        {/* Status Badge and Ratings */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            Ativo
          </Badge>
          
          {/* Fit Cultural Badge */}
          {fitCultural && fitCulturalColor && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="flex items-center gap-0.5 text-[10px] px-1.5 py-0 rounded-full cursor-help"
                    style={{
                      backgroundColor: `${fitCulturalColor}15`,
                      color: fitCulturalColor,
                    }}
                  >
                    <Star className="h-2.5 w-2.5" fill={fitCulturalColor} />
                    <span className="font-semibold">FC {fitCultural}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{fitCulturalTooltip}</p>
                  <p className="text-xs text-muted-foreground">
                    Baseado na avaliação da Entrevista RH
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* Average Rating */}
          {averageRating && (
            <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{averageRating}/5</span>
            </div>
          )}
        </div>

        {/* Time in stage indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
