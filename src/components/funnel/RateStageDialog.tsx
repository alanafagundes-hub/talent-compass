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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import type { CardStageRating } from "@/types/ats";
import { toast } from "sonner";

interface RateStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  stepName: string;
  currentRating?: number;
  currentNotes?: string;
  onSave: (rating: number, notes: string) => void;
}

export default function RateStageDialog({
  open,
  onOpenChange,
  candidateName,
  stepName,
  currentRating,
  currentNotes,
  onSave,
}: RateStageDialogProps) {
  const [rating, setRating] = useState(currentRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [notes, setNotes] = useState(currentNotes || "");

  const handleSave = () => {
    if (rating === 0) {
      toast.error("Selecione uma nota de 1 a 5");
      return;
    }

    onSave(rating, notes.trim());
    onOpenChange(false);
    
    // Reset for next use
    setRating(0);
    setNotes("");
  };

  const handleClose = () => {
    setRating(currentRating || 0);
    setNotes(currentNotes || "");
    onOpenChange(false);
  };

  const ratingLabels = [
    "",
    "Não atende",
    "Abaixo do esperado",
    "Atende parcialmente",
    "Atende às expectativas",
    "Excepcional",
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliar Candidato</DialogTitle>
          <DialogDescription>
            Avalie {candidateName} na etapa "{stepName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-3">
            <Label>Nota</Label>
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {(hoveredRating || rating) > 0 && (
                <p className="text-sm text-muted-foreground">
                  {ratingLabels[hoveredRating || rating]}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="rating-notes">Observações</Label>
            <Textarea
              id="rating-notes"
              placeholder="Adicione observações sobre a avaliação..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {notes.length}/500
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={rating === 0}>
            Salvar Avaliação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
