import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Briefcase, Loader2 } from "lucide-react";
import { supabase as supabaseClient } from "@/integrations/supabase/client";

const supabase = supabaseClient as any;
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  areaName?: string;
}

interface LinkToJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  candidateId: string;
  excludeJobIds?: string[];
  onConfirm: (jobId: string) => Promise<boolean>;
}

export default function LinkToJobDialog({
  open,
  onOpenChange,
  candidateName,
  candidateId,
  excludeJobIds = [],
  onConfirm,
}: LinkToJobDialogProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (open) {
      fetchJobs();
    } else {
      setSelectedJobId("");
    }
  }, [open, excludeJobIds]);

  const fetchJobs = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          areas (
            name
          )
        `)
        .eq('status', 'publicada')
        .eq('is_archived', false)
        .order('title');

      if (error) throw error;

      const availableJobs = (data || [])
        .filter((j: any) => !excludeJobIds.includes(j.id))
        .map((j: any) => ({
          id: j.id,
          title: j.title,
          areaName: j.areas?.name,
        }));

      setJobs(availableJobs);
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      toast.error('Erro ao carregar vagas');
    } finally {
      setIsFetching(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedJobId) return;

    setIsLoading(true);
    const success = await onConfirm(selectedJobId);
    setIsLoading(false);

    if (success) {
      toast.success('Candidato vinculado à vaga com sucesso!');
      onOpenChange(false);
    } else {
      toast.error('Erro ao vincular candidato à vaga');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Vincular a Outra Vaga
          </DialogTitle>
          <DialogDescription>
            Selecione a vaga para vincular {candidateName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="job">Vaga</Label>
            {isFetching ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando vagas...
              </div>
            ) : jobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma vaga disponível para vincular.
              </p>
            ) : (
              <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma vaga" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                      {job.areaName && (
                        <span className="text-muted-foreground ml-2">
                          ({job.areaName})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedJobId || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vinculando...
              </>
            ) : (
              'Vincular'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
