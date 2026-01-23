import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Search, 
  Filter, 
  UserX, 
  Calendar, 
  Briefcase, 
  Building2,
  MoreHorizontal,
  UserPlus,
  MapPin
} from "lucide-react";
import type { LostCandidate } from "@/types/ats";
import { toast } from "sonner";

// Mock data with extended fields
const mockLostCandidates: LostCandidate[] = [
  {
    id: "1",
    candidateId: "c1",
    candidateName: "Roberto Almeida",
    candidateEmail: "roberto.almeida@email.com",
    jobId: "1",
    jobTitle: "Desenvolvedor Backend Senior",
    areaId: "1",
    areaName: "Tech",
    cardId: "card-1",
    stepId: "step-5",
    stepName: "Oferta",
    reasonId: "5",
    reasonName: "Aceitou outra proposta",
    observation: "Aceitou proposta de outra empresa com salário 30% maior",
    canReapply: true,
    reapplyAfter: new Date("2024-07-01"),
    lostAt: new Date("2024-01-10T14:30:00"),
    createdAt: new Date("2024-01-10T14:30:00"),
  },
  {
    id: "2",
    candidateId: "c2",
    candidateName: "Fernanda Costa",
    candidateEmail: "fernanda.costa@email.com",
    jobId: "2",
    jobTitle: "Designer UX/UI",
    areaId: "3",
    areaName: "Criação",
    cardId: "card-2",
    stepId: "step-4",
    stepName: "Entrevista Técnica",
    reasonId: "2",
    reasonName: "Falta de experiência técnica",
    observation: "Não demonstrou conhecimento em design systems e Figma avançado",
    canReapply: true,
    reapplyAfter: new Date("2024-06-01"),
    lostAt: new Date("2024-01-08T10:15:00"),
    createdAt: new Date("2024-01-08T10:15:00"),
  },
  {
    id: "3",
    candidateId: "c3",
    candidateName: "Lucas Mendes",
    candidateEmail: "lucas.mendes@email.com",
    jobId: "3",
    jobTitle: "Gerente Comercial",
    areaId: "2",
    areaName: "Comercial",
    cardId: "card-3",
    stepId: "step-3",
    stepName: "Entrevista RH",
    reasonId: "6",
    reasonName: "Desistiu do processo",
    observation: "Desistiu por motivos pessoais - mudança de cidade",
    canReapply: true,
    lostAt: new Date("2024-01-05T16:45:00"),
    createdAt: new Date("2024-01-05T16:45:00"),
  },
  {
    id: "4",
    candidateId: "c4",
    candidateName: "Patrícia Souza",
    candidateEmail: "patricia.souza@email.com",
    jobId: "4",
    jobTitle: "Analista de Marketing",
    areaId: "4",
    areaName: "Marketing",
    cardId: "card-4",
    stepId: "step-2",
    stepName: "Triagem RH",
    reasonId: "4",
    reasonName: "Desalinhamento cultural",
    observation: "Perfil não compatível com os valores e cultura da empresa",
    canReapply: false,
    lostAt: new Date("2024-01-02T09:20:00"),
    createdAt: new Date("2024-01-02T09:20:00"),
  },
  {
    id: "5",
    candidateId: "c5",
    candidateName: "Thiago Oliveira",
    candidateEmail: "thiago.oliveira@email.com",
    jobId: "1",
    jobTitle: "Desenvolvedor Frontend Pleno",
    areaId: "1",
    areaName: "Tech",
    cardId: "card-5",
    stepId: "step-1",
    stepName: "Inscritos",
    reasonId: "7",
    reasonName: "Sem retorno após contato",
    observation: "Não retornou contatos após 3 tentativas por e-mail e telefone",
    canReapply: true,
    lostAt: new Date("2023-12-28T11:00:00"),
    createdAt: new Date("2023-12-28T11:00:00"),
  },
];

// Get unique values for filters
const getUniqueAreas = (candidates: LostCandidate[]) => {
  const areas = new Map<string, string>();
  candidates.forEach(c => areas.set(c.areaId, c.areaName));
  return Array.from(areas.entries()).map(([id, name]) => ({ id, name }));
};

const getUniqueReasons = (candidates: LostCandidate[]) => {
  const reasons = new Map<string, string>();
  candidates.forEach(c => reasons.set(c.reasonId, c.reasonName));
  return Array.from(reasons.entries()).map(([id, name]) => ({ id, name }));
};

export default function Perdidos() {
  const [lostCandidates, setLostCandidates] = useState<LostCandidate[]>(mockLostCandidates);
  const [searchTerm, setSearchTerm] = useState("");
  const [reasonFilter, setReasonFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [moveToTalentDialog, setMoveToTalentDialog] = useState<LostCandidate | null>(null);

  const uniqueAreas = getUniqueAreas(lostCandidates);
  const uniqueReasons = getUniqueReasons(lostCandidates);

  const filteredCandidates = lostCandidates.filter((candidate) => {
    const matchesSearch =
      candidate.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReason =
      reasonFilter === "all" || candidate.reasonId === reasonFilter;
    const matchesArea =
      areaFilter === "all" || candidate.areaId === areaFilter;
    return matchesSearch && matchesReason && matchesArea;
  });

  const handleMoveToTalentBank = (candidate: LostCandidate) => {
    // Remove from lost candidates list
    setLostCandidates(prev => prev.filter(c => c.id !== candidate.id));
    setMoveToTalentDialog(null);
    toast.success(`${candidate.candidateName} movido para o Banco de Talentos`);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perdidos</h1>
        <p className="text-muted-foreground">
          Candidatos marcados como incompatíveis durante o processo seletivo
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, e-mail ou vaga..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="w-[160px]">
              <Building2 className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as áreas</SelectItem>
              {uniqueAreas.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={reasonFilter} onValueChange={setReasonFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Motivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os motivos</SelectItem>
              {uniqueReasons.map((reason) => (
                <SelectItem key={reason.id} value={reason.id}>
                  {reason.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{filteredCandidates.length} candidato(s) encontrado(s)</span>
      </div>

      {/* Candidates List */}
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
                        {candidate.candidateEmail}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        {candidate.reasonName}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setMoveToTalentDialog(candidate)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Mover para Banco de Talentos
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Job and Area info */}
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{candidate.jobTitle}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{candidate.areaName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Perdido em: {candidate.stepName}</span>
                    </div>
                  </div>

                  {/* Observation */}
                  {candidate.observation && (
                    <div className="mt-3 p-3 rounded-lg bg-muted/50 text-sm">
                      <p className="text-muted-foreground">{candidate.observation}</p>
                    </div>
                  )}

                  {/* Footer info */}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDateTime(candidate.lostAt)}</span>
                    </div>
                    {candidate.canReapply ? (
                      <Badge variant="secondary" className="text-xs">
                        {candidate.reapplyAfter
                          ? `Pode reaplicar após ${new Date(candidate.reapplyAfter).toLocaleDateString("pt-BR")}`
                          : "Pode reaplicar"}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-destructive border-destructive/30">
                        Não pode reaplicar
                      </Badge>
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

      {/* Move to Talent Bank Dialog */}
      <AlertDialog open={!!moveToTalentDialog} onOpenChange={() => setMoveToTalentDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mover para Banco de Talentos</AlertDialogTitle>
            <AlertDialogDescription>
              {moveToTalentDialog && (
                <>
                  <strong>{moveToTalentDialog.candidateName}</strong> será removido da lista 
                  de perdidos e ficará disponível no Banco de Talentos para futuras oportunidades.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => moveToTalentDialog && handleMoveToTalentBank(moveToTalentDialog)}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
