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
  move: "bg-info/10 text-info",
  new: "bg-primary/10 text-primary",
  hired: "bg-success/10 text-success",
  lost: "bg-destructive/10 text-destructive",
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
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
                <span className="font-medium text-foreground">
                  {activity.jobTitle}
                </span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant="secondary"
                className={typeColors[activity.type]}
              >
                {activity.type === "move" && "Movido"}
                {activity.type === "new" && "Novo"}
                {activity.type === "hired" && "Contratado"}
                {activity.type === "lost" && "Perdido"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
