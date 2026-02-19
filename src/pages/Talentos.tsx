import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Plus,
  Search,
  Filter,
  Users,
  Mail,
  Phone,
  Linkedin,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import { CandidateStatus } from "@/types/ats";

interface CandidateListItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  tags: string[];
  status: CandidateStatus;
  appliedJobs: number;
  lastActivity: string;
  createdAt: string;
}

const mockCandidates: CandidateListItem[] = [
  {
    id: "1",
    name: "Ana Carolina Silva",
    email: "ana.silva@email.com",
    phone: "(11) 98765-4321",
    linkedinUrl: "https://linkedin.com/in/anasilva",
    tags: ["Frontend", "React", "Senior"],
    status: "ativo",
    appliedJobs: 2,
    lastActivity: "2024-01-15",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Carlos Eduardo Santos",
    email: "carlos.santos@email.com",
    phone: "(21) 99876-5432",
    linkedinUrl: "https://linkedin.com/in/carlossantos",
    tags: ["Backend", "Node.js", "Pleno"],
    status: "ativo",
    appliedJobs: 1,
    lastActivity: "2024-01-14",
    createdAt: "2024-01-08",
  },
  {
    id: "3",
    name: "Maria Fernanda Oliveira",
    email: "maria.oliveira@email.com",
    tags: ["UX Design", "Figma"],
    status: "ativo",
    appliedJobs: 3,
    lastActivity: "2024-01-13",
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    name: "Pedro Henrique Costa",
    email: "pedro.costa@email.com",
    phone: "(11) 91234-5678",
    tags: ["Comercial", "B2B"],
    status: "arquivado",
    appliedJobs: 1,
    lastActivity: "2024-01-10",
    createdAt: "2023-12-20",
  },
  {
    id: "5",
    name: "Julia Lima Souza",
    email: "julia.lima@email.com",
    linkedinUrl: "https://linkedin.com/in/julialima",
    tags: ["Marketing", "Growth"],
    status: "ativo",
    appliedJobs: 2,
    lastActivity: "2024-01-12",
    createdAt: "2024-01-02",
  },
];

const statusLabels: Record<CandidateStatus, string> = {
  ativo: "Ativo",
  arquivado: "Arquivado",
  perdido: "Perdido",
};

const statusColors: Record<CandidateStatus, string> = {
  ativo: "bg-success/10 text-success border-success/20",
  arquivado: "bg-muted text-muted-foreground border-muted",
  perdido: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Talentos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredCandidates = mockCandidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Banco de Talentos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os candidatos do sistema
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Candidato
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="arquivado">Arquivado</SelectItem>
              <SelectItem value="perdido">Perdido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCandidates.map((candidate) => (
          <Card
            key={candidate.id}
            className="transition-all hover:shadow-md hover:border-primary/30"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {candidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{candidate.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{candidate.email}</span>
                        </div>
                        {candidate.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{candidate.phone}</span>
                          </div>
                        )}
                        {candidate.linkedinUrl && (
                          <a
                            href={candidate.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <Linkedin className="h-3.5 w-3.5" />
                            <span>LinkedIn</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={statusColors[candidate.status]}
                      >
                        {statusLabels[candidate.status]}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {candidate.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>
                      {candidate.appliedJobs} vaga(s) aplicada(s)
                    </span>
                    <span>•</span>
                    <span>
                      Última atividade:{" "}
                      {new Date(candidate.lastActivity).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCandidates.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">
              Nenhum candidato encontrado
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou adicionar um novo candidato.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
