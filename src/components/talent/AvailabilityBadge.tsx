import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CandidateAvailability } from "@/types/ats";
import { availabilityLabels, availabilityColors } from "@/types/ats";

interface AvailabilityBadgeProps {
  availability: CandidateAvailability;
  showTooltip?: boolean;
  size?: 'sm' | 'default';
}

const tooltipDescriptions: Record<CandidateAvailability, string> = {
  actively_seeking: 'Candidato está ativamente buscando novas oportunidades e pode iniciar rapidamente.',
  open_to_opportunities: 'Candidato está aberto a propostas interessantes, mas não está buscando ativamente.',
  not_interested: 'Candidato não está interessado em novas oportunidades no momento.',
};

export default function AvailabilityBadge({ 
  availability, 
  showTooltip = true,
  size = 'default' 
}: AvailabilityBadgeProps) {
  const label = availabilityLabels[availability];
  const color = availabilityColors[availability];

  const badge = (
    <Badge
      variant="outline"
      className={size === 'sm' ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5'}
      style={{
        backgroundColor: `${color}15`,
        color: color,
        borderColor: `${color}40`,
      }}
    >
      {label}
    </Badge>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{tooltipDescriptions[availability]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
