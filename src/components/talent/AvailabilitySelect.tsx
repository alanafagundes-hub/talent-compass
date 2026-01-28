import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CandidateAvailability } from "@/types/ats";
import { availabilityLabels } from "@/types/ats";

interface AvailabilitySelectProps {
  value: CandidateAvailability;
  onValueChange: (value: CandidateAvailability) => void;
  disabled?: boolean;
}

export default function AvailabilitySelect({
  value,
  onValueChange,
  disabled = false,
}: AvailabilitySelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onValueChange(v as CandidateAvailability)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Selecione a disponibilidade" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="actively_seeking">
          🔥 Ativamente buscando
        </SelectItem>
        <SelectItem value="open_to_opportunities">
          🙂 Aberto a oportunidades
        </SelectItem>
        <SelectItem value="not_interested">
          ❄️ Sem interesse
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
