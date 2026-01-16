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
  baixa: "bg-priority-baixa/10 text-priority-baixa border-priority-baixa/20",
  media: "bg-priority-media/10 text-priority-media border-priority-media/20",
  alta: "bg-priority-alta/10 text-priority-alta border-priority-alta/20",
  urgente: "bg-priority-urgente/10 text-priority-urgente border-priority-urgente/20",
};

export function JobsOverview() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Vagas em Destaque</CardTitle>
        <Briefcase className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {mockJobs.map((job) => (
          <div
            key={job.id}
            className="rounded-lg border p-4 transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h4 className="font-medium text-sm">{job.title}</h4>
                <p className="text-xs text-muted-foreground">{job.area}</p>
              </div>
              <Badge variant="outline" className={priorityColors[job.priority]}>
                {priorityLabels[job.priority]}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{job.candidates} candidatos</span>
                </div>
                <span className="text-muted-foreground">
                  {Math.round((job.candidates / job.capacity) * 100)}%
                </span>
              </div>
              <Progress
                value={(job.candidates / job.capacity) * 100}
                className="h-1.5"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
