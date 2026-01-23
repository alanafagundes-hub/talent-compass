import { LucideIcon, Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export default function PlaceholderPage({ 
  title, 
  description = "Estrutura criada para implementação futura.",
  icon: Icon = Construction 
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <Card className="max-w-md w-full text-center border-dashed border-2">
        <CardContent className="pt-10 pb-10 space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-muted">
              <Icon className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Badge variant="secondary" className="mb-2">
              Em breve
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">
              Módulo em construção. {description}
            </p>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Este módulo faz parte do roadmap de evolução da plataforma de ATS para People Platform.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
