import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare,
  Star,
  ArrowRight 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface JobHistory {
  jobId: string;
  jobTitle: string;
  status: string;
  appliedAt: Date;
  currentStage?: string;
  stageRatings: {
    stageName: string;
    rating: number | null;
    notes?: string;
  }[];
}

interface CandidateHistoryTimelineProps {
  jobsHistory: JobHistory[];
}

const statusIcons: Record<string, React.ReactNode> = {
  ativa: <Clock className="h-4 w-4 text-blue-500" />,
  contratada: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  incompativel: <XCircle className="h-4 w-4 text-red-500" />,
  desistente: <XCircle className="h-4 w-4 text-orange-500" />,
};

const statusLabels: Record<string, string> = {
  ativa: 'Em Processo',
  contratada: 'Contratado',
  incompativel: 'Incompatível',
  desistente: 'Desistente',
};

const statusColors: Record<string, string> = {
  ativa: 'bg-blue-100 text-blue-700 border-blue-200',
  contratada: 'bg-green-100 text-green-700 border-green-200',
  incompativel: 'bg-red-100 text-red-700 border-red-200',
  desistente: 'bg-orange-100 text-orange-700 border-orange-200',
};

export default function CandidateHistoryTimeline({ 
  jobsHistory 
}: CandidateHistoryTimelineProps) {
  if (!jobsHistory || jobsHistory.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Nenhuma candidatura registrada</p>
      </div>
    );
  }

  // Sort by most recent
  const sortedHistory = [...jobsHistory].sort(
    (a, b) => b.appliedAt.getTime() - a.appliedAt.getTime()
  );

  return (
    <div className="space-y-4">
      {sortedHistory.map((job, index) => (
        <div key={`${job.jobId}-${index}`} className="relative">
          {/* Timeline connector */}
          {index < sortedHistory.length - 1 && (
            <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-border" />
          )}

          <div className="flex gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              {statusIcons[job.status] || <Briefcase className="h-4 w-4" />}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-medium text-sm">{job.jobTitle}</h4>
                  <p className="text-xs text-muted-foreground">
                    {format(job.appliedAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className={statusColors[job.status]}
                >
                  {statusLabels[job.status] || job.status}
                </Badge>
              </div>

              {/* Current Stage */}
              {job.currentStage && job.status === 'ativa' && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowRight className="h-3 w-3" />
                  <span>Etapa atual: <strong>{job.currentStage}</strong></span>
                </div>
              )}

              {/* Stage Ratings */}
              {job.stageRatings && job.stageRatings.length > 0 && (
                <div className="mt-3 space-y-2">
                  {job.stageRatings.map((rating, rIdx) => (
                    <div 
                      key={rIdx}
                      className="bg-muted/50 rounded-lg p-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{rating.stageName}</span>
                        {rating.rating && (
                          <div className="flex items-center gap-0.5 text-yellow-600">
                            <Star className="h-3 w-3 fill-current" />
                            <span>{rating.rating}/5</span>
                          </div>
                        )}
                      </div>
                      {rating.notes && (
                        <div className="mt-1 flex items-start gap-1 text-muted-foreground">
                          <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                          <p className="line-clamp-2">{rating.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
