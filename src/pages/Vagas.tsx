import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Briefcase,
  Users,
  MapPin,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { JobStatus } from "@/types/ats";

interface JobListItem {
  id: string;
  title: string;
  area: string;
  location: string;
  isRemote: boolean;
  status: JobStatus;
  priority: "baixa" | "media" | "alta" | "urgente";
  candidatesCount: number;
  createdAt: string;
}

const mockJobs: JobListItem[] = [
  {
    id: "1",
    title: "Desenvolvedor Frontend Senior",
    area: "Tech",
    location: "São Paulo, SP",
    isRemote: true,
    status: "aberta",
    priority: "alta",
    candidatesCount: 12,
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    title: "Designer UX/UI",
    area: "Criação",
    location: "Rio de Janeiro, RJ",
    isRemote: true,
    status: "aberta",
    priority: "media",
    candidatesCount: 8,
    createdAt: "2024-01-08",
  },
  {
    id: "3",
    title: "Gerente Comercial",
    area: "Comercial",
    location: "São Paulo, SP",
    isRemote: false,
    status: "aberta",
    priority: "urgente",
    candidatesCount: 5,
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    title: "Analista de Marketing Digital",
    area: "Marketing",
    location: "Remoto",
    isRemote: true,
    status: "pausada",
    priority: "baixa",
    candidatesCount: 18,
    createdAt: "2024-01-02",
  },
  {
    id: "5",
    title: "Desenvolvedor Backend Pleno",
    area: "Tech",
    location: "São Paulo, SP",
    isRemote: true,
    status: "fechada",
    priority: "media",
    candidatesCount: 25,
    createdAt: "2023-12-20",
  },
];

const statusLabels: Record<JobStatus, string> = {
  aberta: "Aberta",
  pausada: "Pausada",
  fechada: "Fechada",
  arquivada: "Arquivada",
};

const statusColors: Record<JobStatus, string> = {
  aberta: "bg-success/10 text-success border-success/20",
  pausada: "bg-warning/10 text-warning border-warning/20",
  fechada: "bg-muted text-muted-foreground border-muted",
  arquivada: "bg-muted text-muted-foreground border-muted",
};

const priorityColors = {
  baixa: "bg-priority-baixa",
  media: "bg-priority-media",
  alta: "bg-priority-alta",
  urgente: "bg-priority-urgente",
};

export default function Vagas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vagas</h1>
          <p className="text-muted-foreground">
            Gerencie as vagas abertas e em andamento
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Vaga
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar vagas..."
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
              <SelectItem value="aberta">Aberta</SelectItem>
              <SelectItem value="pausada">Pausada</SelectItem>
              <SelectItem value="fechada">Fechada</SelectItem>
              <SelectItem value="arquivada">Arquivada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <Card
            key={job.id}
            className="transition-all hover:shadow-md hover:border-primary/30"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-2 w-2 rounded-full ${priorityColors[job.priority]}`}
                  />
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">
                      {job.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{job.area}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={statusColors[job.status]}>
                    {statusLabels[job.status]}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                  {job.isRemote && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      Remoto
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>{job.candidatesCount} candidatos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Criada em{" "}
                    {new Date(job.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Nenhuma vaga encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou criar uma nova vaga.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
