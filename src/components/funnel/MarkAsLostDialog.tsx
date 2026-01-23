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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import type { LostReason, IncompatibilityReason } from "@/types/ats";

// Mock incompatibility reasons - will come from settings
const mockIncompatibilityReasons: IncompatibilityReason[] = [
  { id: "1", name: "Expectativa salarial acima do orçamento", isArchived: false, createdAt: new Date() },
  { id: "2", name: "Falta de experiência técnica", isArchived: false, createdAt: new Date() },
  { id: "3", name: "Não compareceu à entrevista", isArchived: false, createdAt: new Date() },
  { id: "4", name: "Desalinhamento cultural", isArchived: false, createdAt: new Date() },
  { id: "5", name: "Aceitou outra proposta", isArchived: false, createdAt: new Date() },
  { id: "6", name: "Desistiu do processo", isArchived: false, createdAt: new Date() },
  { id: "7", name: "Sem retorno após contato", isArchived: false, createdAt: new Date() },
  { id: "8", name: "Reprovado no teste técnico", isArchived: false, createdAt: new Date() },
  { id: "9", name: "Reprovado na entrevista final", isArchived: false, createdAt: new Date() },
];

interface CandidateInfo {
  id: string;
  cardId: string;
  name: string;
  email: string;
  currentStepId: string;
  currentStepName: string;
  jobId: string;
  jobTitle: string;
  areaId: string;
  areaName: string;
}

interface MarkAsLostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: CandidateInfo | null;
  onConfirm: (data: {
    candidateId: string;
    cardId: string;
    reasonId: string;
    reasonName: string;
    observation: string;
    stepId: string;
    stepName: string;
    jobId: string;
    jobTitle: string;
    areaId: string;
    areaName: string;
    lostAt: Date;
  }) => void;
}

export default function MarkAsLostDialog({
  open,
  onOpenChange,
  candidate,
  onConfirm,
}: MarkAsLostDialogProps) {
  const [selectedReasonId, setSelectedReasonId] = useState<string>("");
  const [observation, setObservation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!candidate || !selectedReasonId) return;

    const reason = mockIncompatibilityReasons.find(r => r.id === selectedReasonId);
    if (!reason) return;

    setIsSubmitting(true);

    onConfirm({
      candidateId: candidate.id,
      cardId: candidate.cardId,
      reasonId: reason.id,
      reasonName: reason.name,
      observation: observation.trim(),
      stepId: candidate.currentStepId,
      stepName: candidate.currentStepName,
      jobId: candidate.jobId,
      jobTitle: candidate.jobTitle,
      areaId: candidate.areaId,
      areaName: candidate.areaName,
      lostAt: new Date(),
    });

    // Reset form
    setSelectedReasonId("");
    setObservation("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setSelectedReasonId("");
    setObservation("");
    onOpenChange(false);
  };

  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Marcar como Incompatível</DialogTitle>
              <DialogDescription>
                {candidate.name} será movido para Perdidos
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Context info */}
          <div className="rounded-lg bg-muted/50 p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vaga:</span>
              <span className="font-medium">{candidate.jobTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Área:</span>
              <span>{candidate.areaName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Etapa atual:</span>
              <span>{candidate.currentStepName}</span>
            </div>
          </div>

          {/* Reason select */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Motivo da Incompatibilidade <span className="text-destructive">*</span>
            </Label>
            <Select value={selectedReasonId} onValueChange={setSelectedReasonId}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                {mockIncompatibilityReasons
                  .filter(r => !r.isArchived)
                  .map((reason) => (
                    <SelectItem key={reason.id} value={reason.id}>
                      {reason.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Observation */}
          <div className="space-y-2">
            <Label htmlFor="observation">Observação</Label>
            <Textarea
              id="observation"
              placeholder="Adicione detalhes sobre a decisão..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {observation.length}/500
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!selectedReasonId || isSubmitting}
          >
            Confirmar Incompatibilidade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
