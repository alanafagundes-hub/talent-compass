import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Building2,
  GitBranch,
  Tags,
  FileText,
  GripVertical,
  MoreHorizontal,
  Mail,
  AlertCircle,
  Link2,
  LayoutTemplate,
} from "lucide-react";
import TagsSettings from "@/components/settings/TagsSettings";
import FormTemplatesSettings from "@/components/settings/FormTemplatesSettings";
import EmailTemplatesSettings from "@/components/settings/EmailTemplatesSettings";
import IncompatibilityReasonsSettings from "@/components/settings/IncompatibilityReasonsSettings";
import CandidateSourcesSettings from "@/components/settings/CandidateSourcesSettings";
import AreasSettings from "@/components/settings/AreasSettings";
import LandingPageSettings from "@/components/settings/LandingPageSettings";

// Mock data for funnel stages
const mockFunnelStages = [
  { id: "1", name: "Triagem", order: 1, color: "bg-stage-triagem" },
  { id: "2", name: "Entrevista RH", order: 2, color: "bg-stage-entrevistaRh" },
  { id: "3", name: "Teste Técnico", order: 3, color: "bg-stage-teste" },
  { id: "4", name: "Entrevista Gestor", order: 4, color: "bg-stage-gestor" },
  { id: "5", name: "Proposta", order: 5, color: "bg-stage-proposta" },
  { id: "6", name: "Contratado", order: 6, color: "bg-stage-contratado" },
];

export default function ConfiguracoesRecrutamento() {
  const [activeTab, setActiveTab] = useState("etiquetas");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Configure etiquetas, formulários, e-mails e muito mais
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 lg:w-auto lg:inline-grid">
          <TabsTrigger value="etiquetas" className="gap-2">
            <Tags className="h-4 w-4" />
            <span className="hidden sm:inline">Etiquetas</span>
          </TabsTrigger>
          <TabsTrigger value="formularios" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Formulários</span>
          </TabsTrigger>
          <TabsTrigger value="emails" className="gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">E-mails</span>
          </TabsTrigger>
          <TabsTrigger value="incompatibilidade" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Motivos</span>
          </TabsTrigger>
          <TabsTrigger value="fontes" className="gap-2">
            <Link2 className="h-4 w-4" />
            <span className="hidden sm:inline">Fontes</span>
          </TabsTrigger>
          <TabsTrigger value="areas" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Áreas</span>
          </TabsTrigger>
          <TabsTrigger value="funil" className="gap-2">
            <GitBranch className="h-4 w-4" />
            <span className="hidden sm:inline">Funil</span>
          </TabsTrigger>
          <TabsTrigger value="landing" className="gap-2">
            <LayoutTemplate className="h-4 w-4" />
            <span className="hidden sm:inline">Landing Page</span>
          </TabsTrigger>
        </TabsList>

        {/* Etiquetas Tab */}
        <TabsContent value="etiquetas">
          <TagsSettings />
        </TabsContent>

        {/* Formulários Tab */}
        <TabsContent value="formularios">
          <FormTemplatesSettings />
        </TabsContent>

        {/* E-mails Tab */}
        <TabsContent value="emails">
          <EmailTemplatesSettings />
        </TabsContent>

        {/* Motivos de Incompatibilidade Tab */}
        <TabsContent value="incompatibilidade">
          <IncompatibilityReasonsSettings />
        </TabsContent>

        {/* Fontes Tab */}
        <TabsContent value="fontes">
          <CandidateSourcesSettings />
        </TabsContent>

        {/* Áreas Tab */}
        <TabsContent value="areas">
          <AreasSettings />
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

        {/* Landing Page Tab */}
        <TabsContent value="landing">
          <LandingPageSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}