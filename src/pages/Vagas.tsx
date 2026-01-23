import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Building2,
  Eye,
  EyeOff,
} from "lucide-react";
import type { Job, JobStatus, Area, CandidateSource, FormTemplate } from "@/types/ats";
import { jobStatusLabels } from "@/types/ats";
import JobCard from "@/components/jobs/JobCard";
import JobFormDialog from "@/components/jobs/JobFormDialog";
import { toast } from "sonner";

// Mock data
const mockAreas: Area[] = [
  { id: "1", name: "Tech", description: "Desenvolvimento e infraestrutura", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "2", name: "Comercial", description: "Vendas e relacionamento", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "3", name: "Criação", description: "Design e produção visual", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "4", name: "Marketing", description: "Comunicação e growth", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "5", name: "RH", description: "Pessoas e cultura", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
];

const mockSources: CandidateSource[] = [
  { id: "1", name: "LinkedIn", icon: "linkedin", isArchived: false, createdAt: new Date() },
  { id: "2", name: "Indicação Interna", icon: "users", isArchived: false, createdAt: new Date() },
  { id: "3", name: "Site Carreiras", icon: "globe", isArchived: false, createdAt: new Date() },
];

const mockFormTemplates: FormTemplate[] = [
  { id: "1", name: "Formulário Padrão", fields: [], isDefault: true, isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "2", name: "Formulário Tech", fields: [], isDefault: false, isArchived: false, createdAt: new Date(), updatedAt: new Date() },
];

const initialJobs: Job[] = [
  {
    id: "1",
    title: "Desenvolvedor Frontend Senior",
    areaId: "1",
    level: "senior",
    contractType: "clt",
    location: "São Paulo, SP",
    isRemote: true,
    description: "Buscamos um desenvolvedor frontend senior para liderar projetos.",
    status: "publicada",
    priority: "alta",
    isArchived: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "2",
    title: "Designer UX/UI",
    areaId: "3",
    level: "pleno",
    contractType: "clt",
    location: "Rio de Janeiro, RJ",
    isRemote: true,
    description: "Designer para criar experiências incríveis.",
    status: "publicada",
    priority: "media",
    isArchived: false,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
  },
  {
    id: "3",
    title: "Gerente Comercial",
    areaId: "2",
    level: "gerente",
    contractType: "clt",
    location: "São Paulo, SP",
    isRemote: false,
    description: "Gerente para liderar equipe comercial.",
    status: "publicada",
    priority: "urgente",
    isArchived: false,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "4",
    title: "Analista de Marketing Digital",
    areaId: "4",
    level: "pleno",
    contractType: "pj",
    location: "Remoto",
    isRemote: true,
    description: "Analista para campanhas digitais.",
    status: "pausada",
    priority: "baixa",
    isArchived: false,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "5",
    title: "Desenvolvedor Backend Pleno",
    areaId: "1",
    level: "pleno",
    contractType: "clt",
    location: "São Paulo, SP",
    isRemote: true,
    description: "Desenvolvedor backend para APIs.",
    status: "encerrada",
    priority: "media",
    isArchived: false,
    createdAt: new Date("2023-12-20"),
    updatedAt: new Date("2023-12-20"),
  },
  {
    id: "6",
    title: "Estagiário de RH",
    areaId: "5",
    level: "estagio",
    contractType: "estagio",
    location: "São Paulo, SP",
    isRemote: false,
    description: "Estágio em recrutamento e seleção.",
    status: "rascunho",
    priority: "baixa",
    isArchived: false,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
];

// Mock candidates count per job
const mockCandidatesCount: Record<string, number> = {
  "1": 12,
  "2": 8,
  "3": 5,
  "4": 18,
  "5": 25,
  "6": 0,
};

export default function Vagas() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [showClosed, setShowClosed] = useState(false);
  const [viewMode, setViewMode] = useState<"all" | "by-area">("all");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Filter jobs - hide closed by default
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesArea = areaFilter === "all" || job.areaId === areaFilter;
    const matchesClosed = showClosed || job.status !== "encerrada";
    return matchesSearch && matchesStatus && matchesArea && matchesClosed && !job.isArchived;
  });

  // Group jobs by area
  const jobsByArea = mockAreas.reduce((acc, area) => {
    acc[area.id] = filteredJobs.filter(job => job.areaId === area.id);
    return acc;
  }, {} as Record<string, Job[]>);

  const handleOpenCreate = () => {
    setEditingJob(null);
    setIsFormOpen(true);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleArchive = (job: Job) => {
    setJobs(jobs.map(j => 
      j.id === job.id ? { ...j, isArchived: true, updatedAt: new Date() } : j
    ));
    toast.success("Vaga arquivada!");
  };

  const handleViewFunnel = (job: Job) => {
    toast.info(`Abrindo funil da vaga: ${job.title}`);
    // TODO: Navigate to funnel page
  };

  const handleSaveJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    if (jobData.id) {
      // Update
      setJobs(jobs.map(j => 
        j.id === jobData.id 
          ? { ...j, ...jobData, updatedAt: new Date() } as Job
          : j
      ));
      toast.success("Vaga atualizada!");
    } else {
      // Create
      const newJob: Job = {
        ...jobData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Job;
      setJobs([newJob, ...jobs]);
      toast.success("Vaga criada!");
    }
  };

  const getAreaById = (areaId: string) => mockAreas.find(a => a.id === areaId);

  const closedCount = jobs.filter(j => j.status === "encerrada" && !j.isArchived).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vagas</h1>
          <p className="text-muted-foreground">
            Gerencie as vagas abertas e em andamento
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Vaga
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar vagas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-[140px]">
                <Building2 className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
                {mockAreas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {Object.entries(jobStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowClosed(!showClosed)}
            className="gap-2"
          >
            {showClosed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showClosed ? "Ocultar" : "Mostrar"} Encerradas ({closedCount})
          </Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "all" | "by-area")}>
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <Briefcase className="h-4 w-4" />
            Todas as Vagas
          </TabsTrigger>
          <TabsTrigger value="by-area" className="gap-2">
            <Building2 className="h-4 w-4" />
            Por Área
          </TabsTrigger>
        </TabsList>

        {/* All Jobs View */}
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                area={getAreaById(job.areaId)}
                candidatesCount={mockCandidatesCount[job.id]}
                onEdit={handleEdit}
                onArchive={handleArchive}
                onViewFunnel={handleViewFunnel}
              />
            ))}

            {filteredJobs.length === 0 && (
              <EmptyState onCreateJob={handleOpenCreate} />
            )}
          </div>
        </TabsContent>

        {/* Jobs by Area View */}
        <TabsContent value="by-area" className="mt-6 space-y-8">
          {mockAreas.map((area) => {
            const areaJobs = jobsByArea[area.id] || [];
            if (areaJobs.length === 0 && areaFilter !== "all" && areaFilter !== area.id) return null;
            
            return (
              <div key={area.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{area.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {areaJobs.length} vaga(s)
                    </p>
                  </div>
                </div>
                
                {areaJobs.length > 0 ? (
                  <div className="grid gap-4 pl-11">
                    {areaJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        area={area}
                        candidatesCount={mockCandidatesCount[job.id]}
                        onEdit={handleEdit}
                        onArchive={handleArchive}
                        onViewFunnel={handleViewFunnel}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="pl-11">
                    <p className="text-sm text-muted-foreground italic">
                      Nenhuma vaga nesta área
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Job Form Dialog */}
      <JobFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        job={editingJob}
        areas={mockAreas}
        sources={mockSources}
        formTemplates={mockFormTemplates}
        onSave={handleSaveJob}
      />
    </div>
  );
}

function EmptyState({ onCreateJob }: { onCreateJob: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
      <Briefcase className="h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold">Nenhuma vaga encontrada</h3>
      <p className="text-muted-foreground">
        Tente ajustar os filtros ou criar uma nova vaga.
      </p>
      <Button onClick={onCreateJob} className="mt-4 gap-2">
        <Plus className="h-4 w-4" />
        Criar Nova Vaga
      </Button>
    </div>
  );
}
