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
  Archive,
  GitBranch,
  Link2,
  ExternalLink,
} from "lucide-react";
import type { Job, Area, JobStatus } from "@/types/ats";
import { jobLevelLabels, contractTypeLabels, jobStatusLabels } from "@/types/ats";
import { toast } from "sonner";

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

interface JobCardProps {
  job: Job;
  area?: Area;
  candidatesCount?: number;
  onEdit: (job: Job) => void;
  onArchive: (job: Job) => void;
  onViewFunnel: (job: Job) => void;
}

export default function JobCard({
  job,
  area,
  candidatesCount = 0,
  onEdit,
  onArchive,
  onViewFunnel,
}: JobCardProps) {
  const publicUrl = `${window.location.origin}/carreiras/${job.id}`;

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl);
    toast.success("Link copiado!");
  };

  const openPublicPage = () => {
    window.open(publicUrl, "_blank");
  };

  return (
    <Card className="transition-all hover:shadow-md hover:border-primary/30">
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
                <DropdownMenuItem onClick={() => onEdit(job)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {job.status === "publicada" && (
                  <>
                    <DropdownMenuItem onClick={openPublicPage}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ver Página Pública
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={copyPublicLink}>
                      <Link2 className="mr-2 h-4 w-4" />
                      Copiar Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => onArchive(job)}>
                  <Archive className="mr-2 h-4 w-4" />
                  Arquivar
                </DropdownMenuItem>
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
            {job.isRemote && (
              <Badge variant="secondary" className="ml-1 text-xs">
                Remoto
              </Badge>
            )}
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
              onClick={copyPublicLink}
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