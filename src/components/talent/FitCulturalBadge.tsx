import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FitCulturalBadgeProps {
  rating: number | null;
  showTooltip?: boolean;
  size?: 'sm' | 'default';
}

const fitDescriptions: Record<number, string> = {
  1: 'Fit Cultural Baixo - Valores desalinhados com a empresa',
  2: 'Fit Cultural Abaixo da Média - Alguns pontos de atenção',
  3: 'Fit Cultural Médio - Alinhamento parcial',
  4: 'Fit Cultural Bom - Boa aderência à cultura',
  5: 'Fit Cultural Excelente - Forte alinhamento com valores',
};

const fitColors: Record<number, string> = {
  1: '#ef4444',
  2: '#f97316',
  3: '#eab308',
  4: '#22c55e',
  5: '#10b981',
};

export default function FitCulturalBadge({ 
  rating, 
  showTooltip = true,
  size = 'default' 
}: FitCulturalBadgeProps) {
  if (!rating) return null;

  const color = fitColors[rating] || '#94a3b8';
  const description = fitDescriptions[rating] || 'Fit Cultural não avaliado';

  const badge = (
    <div 
      className={`flex items-center gap-0.5 rounded-full px-1.5 ${
        size === 'sm' ? 'text-[10px]' : 'text-xs'
      }`}
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      <Star 
        className={size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'} 
        fill={color}
      />
      <span className="font-semibold">{rating}/5</span>
    </div>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">{description}</p>
            <p className="text-xs text-muted-foreground">
              Baseado na avaliação da etapa "Entrevista RH"
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
