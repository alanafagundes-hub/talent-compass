import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ActivityItem {
  id: string;
  candidateName: string;
  action: string;
  jobTitle: string;
  time: string;
  type: "move" | "new" | "hired" | "lost";
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    candidateName: "Ana Silva",
    action: "movido para",
    jobTitle: "Entrevista RH",
    time: "há 5 min",
    type: "move",
  },
  {
    id: "2",
    candidateName: "Carlos Santos",
    action: "aplicou para",
    jobTitle: "Dev Frontend Sr",
    time: "há 15 min",
    type: "new",
  },
  {
    id: "3",
    candidateName: "Maria Oliveira",
    action: "contratado para",
    jobTitle: "Designer UX",
    time: "há 1 hora",
    type: "hired",
  },
  {
    id: "4",
    candidateName: "Pedro Costa",
    action: "perdido em",
    jobTitle: "Dev Backend Pl",
    time: "há 2 horas",
    type: "lost",
  },
  {
    id: "5",
    candidateName: "Julia Lima",
    action: "movido para",
    jobTitle: "Teste Técnico",
    time: "há 3 horas",
    type: "move",
  },
];

const typeColors = {
  move: "bg-info/20 text-info border-info/30",
  new: "bg-strategic/20 text-strategic border-strategic/30",
  hired: "bg-success/20 text-success border-success/30",
  lost: "bg-destructive/20 text-destructive border-destructive/30",
};

export function RecentActivity() {
  return (
    <Card className="card-elevated">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {mockActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/30"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                {activity.candidateName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {activity.candidateName}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.action}{" "}
                <span className="text-foreground">
                  {activity.jobTitle}
                </span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 ${typeColors[activity.type]}`}
              >
                {activity.type === "move" && "Movido"}
                {activity.type === "new" && "Novo"}
                {activity.type === "hired" && "Contratado"}
                {activity.type === "lost" && "Perdido"}
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
