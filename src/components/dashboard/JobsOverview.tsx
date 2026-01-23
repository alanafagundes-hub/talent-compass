import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Users } from "lucide-react";

interface JobOverview {
  id: string;
  title: string;
  area: string;
  candidates: number;
  capacity: number;
  priority: "baixa" | "media" | "alta" | "urgente";
}

const mockJobs: JobOverview[] = [
  {
    id: "1",
    title: "Desenvolvedor Frontend Senior",
    area: "Tech",
    candidates: 12,
    capacity: 20,
    priority: "alta",
  },
  {
    id: "2",
    title: "Designer UX/UI",
    area: "Criação",
    candidates: 8,
    capacity: 15,
    priority: "media",
  },
  {
    id: "3",
    title: "Gerente Comercial",
    area: "Comercial",
    candidates: 5,
    capacity: 10,
    priority: "urgente",
  },
  {
    id: "4",
    title: "Analista de Marketing",
    area: "Marketing",
    candidates: 18,
    capacity: 25,
    priority: "baixa",
  },
];

const priorityLabels = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  urgente: "Urgente",
};

const priorityColors = {
  baixa: "bg-muted text-muted-foreground border-muted",
  media: "bg-warning/20 text-warning border-warning/30",
  alta: "bg-primary/20 text-primary border-primary/30",
  urgente: "bg-destructive/20 text-destructive border-destructive/30",
};

export function JobsOverview() {
  return (
    <Card className="card-elevated">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold">Vagas em Destaque</CardTitle>
        <Briefcase className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
        {mockJobs.map((job) => (
          <div
            key={job.id}
            className="rounded-lg bg-muted/30 border border-border/50 p-3 transition-all hover:bg-muted/50 hover:border-border"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="font-medium text-sm">{job.title}</h4>
                <p className="text-xs text-muted-foreground">{job.area}</p>
              </div>
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityColors[job.priority]}`}>
                {priorityLabels[job.priority]}
              </Badge>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{job.candidates} candidatos</span>
                </div>
                <span className="text-muted-foreground font-medium">
                  {Math.round((job.candidates / job.capacity) * 100)}%
                </span>
              </div>
              <Progress
                value={(job.candidates / job.capacity) * 100}
                className="h-1"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
