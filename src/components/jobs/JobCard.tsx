import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MapPin,
  Users,
  Calendar,
  MoreHorizontal,
  Pencil,
  GitBranch,
  Link2,
  ExternalLink,
  Play,
  Pause,
  XCircle,
  Home,
  Building,
  Laptop,
} from "lucide-react";
import type { Job, Area, JobStatus } from "@/types/ats";
import { jobLevelLabels, contractTypeLabels, jobStatusLabels, workModelLabels } from "@/types/ats";

const statusColors: Record<JobStatus, string> = {
  rascunho: "bg-muted text-muted-foreground border-muted",
  publicada: "bg-success/10 text-success border-success/20",
  pausada: "bg-warning/10 text-warning border-warning/20",
  encerrada: "bg-muted text-muted-foreground border-muted",
};

const priorityColors = {
  baixa: "bg-priority-baixa",
  media: "bg-priority-media",
  alta: "bg-priority-alta",
  urgente: "bg-priority-urgente",
};

const workModelIcons = {
  remoto: Laptop,
  presencial: Building,
  hibrido: Home,
};

interface JobCardProps {
  job: Job;
  area?: Area;
  candidatesCount?: number;
  onEdit: (job: Job) => void;
  onChangeStatus: (job: Job, newStatus: JobStatus) => void;
  onViewFunnel: (job: Job) => void;
  onCopyLink: (job: Job) => void;
}

export default function JobCard({
  job,
  area,
  candidatesCount = 0,
  onEdit,
  onChangeStatus,
  onViewFunnel,
  onCopyLink,
}: JobCardProps) {
  const isEditable = job.status !== "encerrada";

  return (
    <Card className={`transition-all hover:shadow-md hover:border-primary/30 ${
      job.status === "encerrada" ? "opacity-75" : ""
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`mt-1 h-2 w-2 rounded-full ${priorityColors[job.priority]}`}
              title={`Prioridade: ${job.priority}`}
            />
            <div>
              <h3 className="font-semibold text-lg leading-tight">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {area && (
                  <span className="text-sm text-muted-foreground">{area.name}</span>
                )}
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {jobLevelLabels[job.level]}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {contractTypeLabels[job.contractType]}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={statusColors[job.status]}>
              {jobStatusLabels[job.status]}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewFunnel(job)}>
                  <GitBranch className="mr-2 h-4 w-4" />
                  Ver Funil
                </DropdownMenuItem>
                
                {isEditable && (
                  <DropdownMenuItem onClick={() => onEdit(job)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                
                {/* Status actions based on current status */}
                {job.status === "rascunho" && (
                  <DropdownMenuItem onClick={() => onChangeStatus(job, "publicada")}>
                    <Play className="mr-2 h-4 w-4" />
                    Publicar Vaga
                  </DropdownMenuItem>
                )}
                
                {job.status === "publicada" && (
                  <>
                    <DropdownMenuItem onClick={() => window.open(`/carreiras/${job.id}`, "_blank")}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ver Página Pública
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCopyLink(job)}>
                      <Link2 className="mr-2 h-4 w-4" />
                      Copiar Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onChangeStatus(job, "pausada")}>
                      <Pause className="mr-2 h-4 w-4" />
                      Pausar Vaga
                    </DropdownMenuItem>
                  </>
                )}
                
                {job.status === "pausada" && (
                  <DropdownMenuItem onClick={() => onChangeStatus(job, "publicada")}>
                    <Play className="mr-2 h-4 w-4" />
                    Reativar Vaga
                  </DropdownMenuItem>
                )}
                
                {/* Encerrar vaga - available for all except already closed */}
                {job.status !== "encerrada" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onChangeStatus(job, "encerrada")}
                      className="text-destructive focus:text-destructive"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Encerrar Vaga
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {(() => {
              const WorkIcon = workModelIcons[job.workModel || 'presencial'];
              return <WorkIcon className="h-4 w-4" />;
            })()}
            <Badge variant="secondary" className="text-xs">
              {workModelLabels[job.workModel || 'presencial']}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{candidatesCount} candidatos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>
              Criada em{" "}
              {new Date(job.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>
        
        {/* Quick actions */}
        <div className="mt-4 pt-3 border-t flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 gap-2"
            onClick={() => onViewFunnel(job)}
          >
            <GitBranch className="h-4 w-4" />
            Acessar Funil
          </Button>
          {job.status === "publicada" && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => onCopyLink(job)}
            >
              <Link2 className="h-4 w-4" />
              Copiar Link
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}