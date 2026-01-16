import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { JobsOverview } from "@/components/dashboard/JobsOverview";
import { Users, Briefcase, UserCheck, UserX, Clock, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu processo de recrutamento
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Candidatos Ativos"
          value={156}
          description="Em processo seletivo"
          icon={Users}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Vagas Abertas"
          value={8}
          description="Aguardando preenchimento"
          icon={Briefcase}
          variant="info"
        />
        <StatCard
          title="Contratados no Mês"
          value={5}
          description="Meta: 10 contratações"
          icon={UserCheck}
          variant="success"
          trend={{ value: 25, isPositive: true }}
        />
        <StatCard
          title="Perdidos no Mês"
          value={12}
          description="Candidatos não aprovados"
          icon={UserX}
          variant="warning"
          trend={{ value: -8, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Tempo Médio de Contratação"
          value="18 dias"
          description="Da triagem à proposta"
          icon={Clock}
        />
        <StatCard
          title="Taxa de Conversão"
          value="32%"
          description="Triagem → Contratação"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Candidatos no Banco"
          value={847}
          description="Disponíveis para novas vagas"
          icon={Users}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        <JobsOverview />
      </div>
    </div>
  );
}
