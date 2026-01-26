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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  Briefcase,
  Building2,
  FileText,
  Eye,
  Loader2,
  CheckCircle,
  Laptop,
  Home,
  Building,
} from "lucide-react";
import type { Job, Area } from "@/types/ats";
import { jobLevelLabels, contractTypeLabels, workModelLabels } from "@/types/ats";

interface JobPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  area?: Area;
  onConfirm: () => void;
  isPublishing?: boolean;
}

const workModelIcons = {
  remoto: Laptop,
  presencial: Building,
  hibrido: Home,
};

export default function JobPreviewDialog({
  open,
  onOpenChange,
  job,
  area,
  onConfirm,
  isPublishing = false,
}: JobPreviewDialogProps) {
  if (!job) return null;

  const WorkIcon = workModelIcons[job.workModel || 'presencial'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Eye className="h-5 w-5" />
            <span className="text-sm font-medium">Pré-visualização</span>
          </div>
          <DialogTitle>Como a vaga aparecerá na página pública</DialogTitle>
          <DialogDescription>
            Revise as informações antes de publicar. Esta é a visualização que os candidatos terão.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          {/* Preview Card - Simulating public page style */}
          <div className="bg-card border rounded-lg p-6 space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">{job.title}</h2>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {area && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    <span>{area.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  <span>{contractTypeLabels[job.contractType]}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{jobLevelLabels[job.level]}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <WorkIcon className="h-4 w-4" />
                  <Badge variant="secondary" className="text-xs">
                    {workModelLabels[job.workModel || 'presencial']}
                  </Badge>
                </div>
              </div>

              {job.salary && (job.salary.min || job.salary.max) && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Faixa salarial: </span>
                  {job.salary.min && job.salary.max ? (
                    <>R$ {job.salary.min.toLocaleString('pt-BR')} - R$ {job.salary.max.toLocaleString('pt-BR')}</>
                  ) : job.salary.min ? (
                    <>A partir de R$ {job.salary.min.toLocaleString('pt-BR')}</>
                  ) : (
                    <>Até R$ {job.salary.max?.toLocaleString('pt-BR')}</>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* About Job */}
            {job.aboutJob && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Sobre a Vaga</h3>
                </div>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {job.aboutJob}
                </div>
              </div>
            )}

            {/* About Company */}
            {job.aboutCompany && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Sobre a DOT</h3>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {job.aboutCompany}
                  </div>
                </div>
              </>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Responsabilidades da Função</h3>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {job.responsibilities}
                  </div>
                </div>
              </>
            )}

            {/* Requirements */}
            {job.requirementsText && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Pré-requisitos</h3>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {job.requirementsText}
                  </div>
                </div>
              </>
            )}

            {/* Nice to Have */}
            {job.niceToHave && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Diferenciais</h3>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {job.niceToHave}
                  </div>
                </div>
              </>
            )}

            {/* Additional Info */}
            {job.additionalInfo && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Informações Adicionais</h3>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {job.additionalInfo}
                  </div>
                </div>
              </>
            )}

            {/* Legacy description fallback */}
            {!job.aboutJob && job.description && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Descrição da Vaga</h3>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {job.description}
                  </div>
                </div>
              </>
            )}

            {/* Legacy requirements fallback */}
            {!job.requirementsText && job.requirements && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Requisitos</h3>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {job.requirements}
                  </div>
                </div>
              </>
            )}

            {/* Summary badges */}
            <div className="pt-4 flex flex-wrap gap-2">
              <Badge variant="outline">{contractTypeLabels[job.contractType]}</Badge>
              <Badge variant="outline">{jobLevelLabels[job.level]}</Badge>
              <Badge variant="outline">{workModelLabels[job.workModel || 'presencial']}</Badge>
              {area && <Badge variant="secondary">{area.name}</Badge>}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPublishing}
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPublishing}
            className="gap-2"
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publicando...
              </>
            ) : (
              "Confirmar Publicação"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
