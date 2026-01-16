import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { ClipboardList, Users, Tags, FileText, Building2, ChevronRight } from "lucide-react";

const settingsCards = [
  {
    title: "Recrutamento",
    description: "Configure áreas, etapas do funil, etiquetas e formulários",
    icon: ClipboardList,
    href: "/configuracoes/recrutamento",
  },
  {
    title: "Equipe",
    description: "Gerencie usuários e permissões do sistema",
    icon: Users,
    href: "/configuracoes/equipe",
    disabled: true,
  },
  {
    title: "Etiquetas",
    description: "Crie e gerencie etiquetas para categorizar candidatos",
    icon: Tags,
    href: "/configuracoes/etiquetas",
    disabled: true,
  },
  {
    title: "Formulários",
    description: "Configure formulários de aplicação personalizados",
    icon: FileText,
    href: "/configuracoes/formularios",
    disabled: true,
  },
  {
    title: "Empresa",
    description: "Informações e configurações gerais da empresa",
    icon: Building2,
    href: "/configuracoes/empresa",
    disabled: true,
  },
];

export default function Configuracoes() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema de recrutamento
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsCards.map((card) => (
          <Card
            key={card.title}
            className={`transition-all ${
              card.disabled
                ? "opacity-60 cursor-not-allowed"
                : "hover:shadow-md hover:border-primary/30"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-primary/10 p-2">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                {card.disabled && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    Em breve
                  </span>
                )}
              </div>
              <CardTitle className="text-lg">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {card.disabled ? (
                <Button variant="outline" className="w-full" disabled>
                  Configurar
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button variant="outline" className="w-full" asChild>
                  <NavLink to={card.href}>
                    Configurar
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </NavLink>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
