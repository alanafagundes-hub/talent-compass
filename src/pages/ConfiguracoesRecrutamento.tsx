import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Building2,
  GitBranch,
  Tags,
  FileText,
  GripVertical,
  MoreHorizontal,
  Archive,
} from "lucide-react";

// Mock data for areas
const mockAreas = [
  { id: "1", name: "Tech", type: "tech", jobsCount: 5, isArchived: false },
  { id: "2", name: "Comercial", type: "comercial", jobsCount: 3, isArchived: false },
  { id: "3", name: "Criação", type: "criacao", jobsCount: 2, isArchived: false },
  { id: "4", name: "Marketing", type: "marketing", jobsCount: 4, isArchived: false },
  { id: "5", name: "RH", type: "rh", jobsCount: 1, isArchived: false },
];

// Mock data for funnel stages
const mockFunnelStages = [
  { id: "1", name: "Triagem", order: 1, color: "bg-stage-triagem" },
  { id: "2", name: "Entrevista RH", order: 2, color: "bg-stage-entrevistaRh" },
  { id: "3", name: "Teste Técnico", order: 3, color: "bg-stage-teste" },
  { id: "4", name: "Entrevista Gestor", order: 4, color: "bg-stage-gestor" },
  { id: "5", name: "Proposta", order: 5, color: "bg-stage-proposta" },
  { id: "6", name: "Contratado", order: 6, color: "bg-stage-contratado" },
];

// Mock data for tags
const mockTags = [
  { id: "1", name: "Senior", color: "#3B82F6" },
  { id: "2", name: "Pleno", color: "#8B5CF6" },
  { id: "3", name: "Junior", color: "#22C55E" },
  { id: "4", name: "React", color: "#06B6D4" },
  { id: "5", name: "Node.js", color: "#84CC16" },
  { id: "6", name: "Design", color: "#F43F5E" },
  { id: "7", name: "Remoto", color: "#F59E0B" },
];

export default function ConfiguracoesRecrutamento() {
  const [activeTab, setActiveTab] = useState("areas");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recrutamento</h1>
        <p className="text-muted-foreground">
          Configure áreas, funil de seleção, etiquetas e formulários
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="areas" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Áreas</span>
          </TabsTrigger>
          <TabsTrigger value="funil" className="gap-2">
            <GitBranch className="h-4 w-4" />
            <span className="hidden sm:inline">Funil</span>
          </TabsTrigger>
          <TabsTrigger value="etiquetas" className="gap-2">
            <Tags className="h-4 w-4" />
            <span className="hidden sm:inline">Etiquetas</span>
          </TabsTrigger>
          <TabsTrigger value="formularios" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Formulários</span>
          </TabsTrigger>
        </TabsList>

        {/* Áreas Tab */}
        <TabsContent value="areas" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Áreas da Empresa</CardTitle>
                <CardDescription>
                  Organize as vagas por áreas ou departamentos
                </CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Área
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockAreas.map((area) => (
                  <div
                    key={area.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      <div>
                        <p className="font-medium">{area.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {area.jobsCount} vaga(s) ativa(s)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Funil Tab */}
        <TabsContent value="funil" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Etapas do Funil</CardTitle>
                <CardDescription>
                  Configure as etapas padrão do processo seletivo
                </CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Etapa
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockFunnelStages.map((stage) => (
                  <div
                    key={stage.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      <div className={`h-3 w-3 rounded-full ${stage.color}`} />
                      <div>
                        <p className="font-medium">{stage.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Etapa {stage.order}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Etiquetas Tab */}
        <TabsContent value="etiquetas" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Etiquetas</CardTitle>
                <CardDescription>
                  Crie etiquetas para categorizar candidatos
                </CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Etiqueta
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="gap-2 py-2 px-3 cursor-pointer transition-colors hover:bg-muted"
                    style={{ borderColor: tag.color }}
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Formulários Tab */}
        <TabsContent value="formularios" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Formulários de Aplicação</CardTitle>
                <CardDescription>
                  Configure formulários personalizados para cada vaga
                </CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Formulário
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                <FileText className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">
                  Nenhum formulário criado
                </h3>
                <p className="text-muted-foreground text-center max-w-sm">
                  Crie formulários personalizados para coletar informações específicas
                  dos candidatos durante a aplicação.
                </p>
                <Button className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Primeiro Formulário
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
