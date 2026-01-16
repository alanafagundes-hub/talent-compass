import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, UserX, Calendar, Briefcase, AlertCircle } from "lucide-react";
import { LostReason } from "@/types/ats";

interface LostCandidateItem {
  id: string;
  candidateName: string;
  email: string;
  jobTitle: string;
  reason: LostReason;
  reasonDetails?: string;
  canReapply: boolean;
  reapplyAfter?: string;
  lostAt: string;
}

const mockLostCandidates: LostCandidateItem[] = [
  {
    id: "1",
    candidateName: "Roberto Almeida",
    email: "roberto.almeida@email.com",
    jobTitle: "Desenvolvedor Backend Senior",
    reason: "outra_proposta",
    reasonDetails: "Aceitou proposta de outra empresa com salário maior",
    canReapply: true,
    reapplyAfter: "2024-07-01",
    lostAt: "2024-01-10",
  },
  {
    id: "2",
    candidateName: "Fernanda Costa",
    email: "fernanda.costa@email.com",
    jobTitle: "Designer UX/UI",
    reason: "reprovado_entrevista",
    reasonDetails: "Não demonstrou conhecimento técnico esperado",
    canReapply: true,
    reapplyAfter: "2024-06-01",
    lostAt: "2024-01-08",
  },
  {
    id: "3",
    candidateName: "Lucas Mendes",
    email: "lucas.mendes@email.com",
    jobTitle: "Gerente Comercial",
    reason: "desistencia",
    reasonDetails: "Desistiu do processo por motivos pessoais",
    canReapply: true,
    lostAt: "2024-01-05",
  },
  {
    id: "4",
    candidateName: "Patrícia Souza",
    email: "patricia.souza@email.com",
    jobTitle: "Analista de Marketing",
    reason: "perfil_inadequado",
    reasonDetails: "Perfil não compatível com a cultura da empresa",
    canReapply: false,
    lostAt: "2024-01-02",
  },
  {
    id: "5",
    candidateName: "Thiago Oliveira",
    email: "thiago.oliveira@email.com",
    jobTitle: "Desenvolvedor Frontend Pleno",
    reason: "sem_retorno",
    reasonDetails: "Não retornou contatos após 3 tentativas",
    canReapply: true,
    lostAt: "2023-12-28",
  },
];

const reasonLabels: Record<LostReason, string> = {
  salario: "Salário",
  perfil_inadequado: "Perfil Inadequado",
  desistencia: "Desistência",
  outra_proposta: "Outra Proposta",
  sem_retorno: "Sem Retorno",
  reprovado_teste: "Reprovado Teste",
  reprovado_entrevista: "Reprovado Entrevista",
  outros: "Outros",
};

const reasonColors: Record<LostReason, string> = {
  salario: "bg-warning/10 text-warning border-warning/20",
  perfil_inadequado: "bg-destructive/10 text-destructive border-destructive/20",
  desistencia: "bg-muted text-muted-foreground border-muted",
  outra_proposta: "bg-info/10 text-info border-info/20",
  sem_retorno: "bg-muted text-muted-foreground border-muted",
  reprovado_teste: "bg-destructive/10 text-destructive border-destructive/20",
  reprovado_entrevista: "bg-destructive/10 text-destructive border-destructive/20",
  outros: "bg-muted text-muted-foreground border-muted",
};

export default function Perdidos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reasonFilter, setReasonFilter] = useState<string>("all");

  const filteredCandidates = mockLostCandidates.filter((candidate) => {
    const matchesSearch =
      candidate.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReason =
      reasonFilter === "all" || candidate.reason === reasonFilter;
    return matchesSearch && matchesReason;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perdidos</h1>
        <p className="text-muted-foreground">
          Candidatos que não foram aprovados ou desistiram do processo
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou vaga..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={reasonFilter} onValueChange={setReasonFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Motivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os motivos</SelectItem>
              <SelectItem value="salario">Salário</SelectItem>
              <SelectItem value="perfil_inadequado">Perfil Inadequado</SelectItem>
              <SelectItem value="desistencia">Desistência</SelectItem>
              <SelectItem value="outra_proposta">Outra Proposta</SelectItem>
              <SelectItem value="sem_retorno">Sem Retorno</SelectItem>
              <SelectItem value="reprovado_teste">Reprovado Teste</SelectItem>
              <SelectItem value="reprovado_entrevista">Reprovado Entrevista</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCandidates.map((candidate) => (
          <Card
            key={candidate.id}
            className="transition-all hover:shadow-md border-l-4 border-l-destructive/50"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-destructive/10 text-destructive font-medium">
                    {candidate.candidateName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{candidate.candidateName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {candidate.email}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={reasonColors[candidate.reason]}
                    >
                      {reasonLabels[candidate.reason]}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{candidate.jobTitle}</span>
                  </div>

                  {candidate.reasonDetails && (
                    <p className="mt-2 text-sm text-muted-foreground bg-muted/50 rounded-md p-2">
                      {candidate.reasonDetails}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        Perdido em:{" "}
                        {new Date(candidate.lostAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    {candidate.canReapply ? (
                      <Badge variant="secondary" className="text-xs">
                        {candidate.reapplyAfter
                          ? `Pode reaplicar após ${new Date(candidate.reapplyAfter).toLocaleDateString("pt-BR")}`
                          : "Pode reaplicar"}
                      </Badge>
                    ) : (
                      <div className="flex items-center gap-1 text-destructive">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>Não pode reaplicar</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCandidates.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <UserX className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">
              Nenhum candidato perdido encontrado
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros de busca.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
