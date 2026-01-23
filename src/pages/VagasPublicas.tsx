import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Briefcase,
  Building2,
  Search,
  ArrowRight,
  Loader2,
} from "lucide-react";
import type { Job, Area } from "@/types/ats";
import { jobLevelLabels, contractTypeLabels } from "@/types/ats";

// Mock data
const mockJobs: Job[] = [
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
    formTemplateId: "1",
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
    formTemplateId: "1",
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
];

const mockAreas: Area[] = [
  { id: "1", name: "Tech", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "2", name: "Comercial", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "3", name: "Criação", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
];

export default function VagasPublicas() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");

  useEffect(() => {
    // Simulate API call
    const loadJobs = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      // Only show published jobs
      setJobs(mockJobs.filter(j => j.status === "publicada" && !j.isArchived));
      setIsLoading(false);
    };
    loadJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = areaFilter === "all" || job.areaId === areaFilter;
    return matchesSearch && matchesArea;
  });

  const getAreaById = (areaId: string) => mockAreas.find(a => a.id === areaId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Carregando vagas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container max-w-5xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Trabalhe na <span className="text-primary">DOT</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Junte-se a um time apaixonado por tecnologia e inovação. 
            Encontre a vaga perfeita para você.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container max-w-5xl mx-auto px-4 py-8">
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
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="w-[180px]">
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
        </div>
      </section>

      {/* Jobs List */}
      <section className="container max-w-5xl mx-auto px-4 pb-16">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Nenhuma vaga encontrada</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou volte mais tarde.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {filteredJobs.length} vaga(s) disponível(is)
            </p>
            {filteredJobs.map((job) => {
              const area = getAreaById(job.areaId);
              return (
                <Card key={job.id} className="transition-all hover:shadow-md hover:border-primary/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {area && (
                            <Badge variant="secondary" className="text-xs">
                              {area.name}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {jobLevelLabels[job.level]} • {contractTypeLabels[job.contractType]}
                        </CardDescription>
                      </div>
                      <Button asChild>
                        <Link to={`/carreiras/${job.id}`}>
                          Ver Vaga
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                        {job.isRemote && (
                          <Badge variant="outline" className="ml-1 text-xs">
                            Remoto
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container max-w-5xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DOT. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
