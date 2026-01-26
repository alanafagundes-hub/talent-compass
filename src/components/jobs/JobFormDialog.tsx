import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { 
  Job, 
  JobStatus, 
  JobLevel, 
  ContractType,
  WorkModel,
  Area, 
  CandidateSource,
  FormTemplate 
} from "@/types/ats";
import { jobLevelLabels, contractTypeLabels, jobStatusLabels, workModelLabels } from "@/types/ats";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface JobFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job | null;
  areas: Area[];
  sources: CandidateSource[];
  formTemplates: FormTemplate[];
  onSave: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<void>;
}

const initialFormData = {
  title: "",
  areaId: "",
  level: "pleno" as JobLevel,
  contractType: "clt" as ContractType,
  workModel: "presencial" as WorkModel,
  location: "",
  // Editorial fields
  aboutJob: "",
  aboutCompany: "",
  responsibilities: "",
  requirementsText: "",
  niceToHave: "",
  additionalInfo: "",
  // Legacy
  description: "",
  requirements: "",
  // Other
  salaryMin: "",
  salaryMax: "",
  sourceId: "",
  status: "rascunho" as JobStatus,
  formTemplateId: "",
  priority: "media" as Job['priority'],
  isBoosted: false,
  investmentAmount: "",
};

export default function JobFormDialog({
  open,
  onOpenChange,
  job,
  areas,
  sources,
  formTemplates,
  onSave,
}: JobFormDialogProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        areaId: job.areaId,
        level: job.level,
        contractType: job.contractType,
        workModel: job.workModel || "presencial",
        location: job.location,
        // Editorial fields
        aboutJob: job.aboutJob || "",
        aboutCompany: job.aboutCompany || "",
        responsibilities: job.responsibilities || "",
        requirementsText: job.requirementsText || "",
        niceToHave: job.niceToHave || "",
        additionalInfo: job.additionalInfo || "",
        // Legacy
        description: job.description,
        requirements: job.requirements || "",
        // Other
        salaryMin: job.salary?.min?.toString() || "",
        salaryMax: job.salary?.max?.toString() || "",
        sourceId: job.sourceId || "",
        status: job.status,
        formTemplateId: job.formTemplateId || "",
        priority: job.priority,
        isBoosted: job.isBoosted || false,
        investmentAmount: job.investmentAmount?.toString() || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [job, open]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Título é obrigatório");
      return;
    }
    if (!formData.areaId) {
      toast.error("Área é obrigatória");
      return;
    }
    // Validate location for non-remote jobs
    if (formData.workModel !== "remoto" && !formData.location.trim()) {
      toast.error("Localidade é obrigatória para vagas presenciais ou híbridas");
      return;
    }
    if (!formData.aboutJob.trim()) {
      toast.error("O campo 'Sobre a vaga' é obrigatório");
      return;
    }

    // Build description from editorial fields for legacy compatibility
    const fullDescription = [
      formData.aboutJob,
      formData.aboutCompany ? `\n\n**Sobre a DOT:**\n${formData.aboutCompany}` : "",
      formData.responsibilities ? `\n\n**Responsabilidades:**\n${formData.responsibilities}` : "",
    ].filter(Boolean).join("");

    const jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'> & { id?: string } = {
      ...(job && { id: job.id }),
      title: formData.title,
      areaId: formData.areaId,
      level: formData.level,
      contractType: formData.contractType,
      workModel: formData.workModel,
      location: formData.location || "Brasil",
      // Editorial fields
      aboutJob: formData.aboutJob || undefined,
      aboutCompany: formData.aboutCompany || undefined,
      responsibilities: formData.responsibilities || undefined,
      requirementsText: formData.requirementsText || undefined,
      niceToHave: formData.niceToHave || undefined,
      additionalInfo: formData.additionalInfo || undefined,
      // Legacy fields
      description: fullDescription || formData.aboutJob,
      requirements: formData.requirementsText || undefined,
      salary: formData.salaryMin || formData.salaryMax ? {
        min: formData.salaryMin ? parseInt(formData.salaryMin) : 0,
        max: formData.salaryMax ? parseInt(formData.salaryMax) : 0,
      } : undefined,
      sourceId: formData.sourceId || undefined,
      status: formData.status,
      formTemplateId: formData.formTemplateId || undefined,
      priority: formData.priority,
      isBoosted: formData.isBoosted,
      investmentAmount: formData.investmentAmount ? parseFloat(formData.investmentAmount) : undefined,
      isArchived: false,
    };

    setIsSaving(true);
    try {
      await onSave(jobData);
    } finally {
      setIsSaving(false);
    }
  };

  const activeAreas = areas.filter(a => !a.isArchived);
  const activeSources = sources.filter(s => !s.isArchived);
  const activeTemplates = formTemplates.filter(t => !t.isArchived);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{job ? "Editar Vaga" : "Nova Vaga"}</DialogTitle>
          <DialogDescription>
            {job ? "Atualize as informações da vaga" : "Preencha os dados para criar uma nova vaga"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Informações Básicas
              </h4>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Vaga *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Desenvolvedor Frontend Senior"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">Área *</Label>
                    <Select 
                      value={formData.areaId} 
                      onValueChange={(value) => setFormData({ ...formData, areaId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a área" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeAreas.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Nível *</Label>
                    <Select 
                      value={formData.level} 
                      onValueChange={(value) => setFormData({ ...formData, level: value as JobLevel })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(jobLevelLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractType">Tipo de Contratação *</Label>
                    <Select 
                      value={formData.contractType} 
                      onValueChange={(value) => setFormData({ ...formData, contractType: value as ContractType })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(contractTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => setFormData({ ...formData, status: value as JobStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status da vaga" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(jobStatusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Modelo de Trabalho e Localização */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Modelo de Trabalho
              </h4>
              
              <div className="grid gap-4">
                <div className="space-y-3">
                  <Label>Modelo de Trabalho *</Label>
                  <RadioGroup
                    value={formData.workModel}
                    onValueChange={(value) => setFormData({ ...formData, workModel: value as WorkModel })}
                    className="flex gap-6"
                  >
                    {Object.entries(workModelLabels).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={`workModel-${value}`} />
                        <Label htmlFor={`workModel-${value}`} className="cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    Localidade {formData.workModel !== "remoto" && "*"}
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={formData.workModel === "remoto" ? "Ex: Brasil, Global" : "Ex: São Paulo, SP"}
                  />
                  {formData.workModel === "remoto" && (
                    <p className="text-xs text-muted-foreground">
                      Para vagas remotas, você pode usar uma localidade genérica como "Brasil" ou "Global"
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Conteúdo Editorial */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Conteúdo da Vaga
              </h4>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aboutJob">Sobre a Vaga *</Label>
                  <Textarea
                    id="aboutJob"
                    value={formData.aboutJob}
                    onChange={(e) => setFormData({ ...formData, aboutJob: e.target.value })}
                    placeholder="Descreva a vaga, o contexto do time e os principais desafios..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aboutCompany">Sobre a DOT</Label>
                  <Textarea
                    id="aboutCompany"
                    value={formData.aboutCompany}
                    onChange={(e) => setFormData({ ...formData, aboutCompany: e.target.value })}
                    placeholder="Breve descrição sobre a empresa, cultura e valores..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Responsabilidades da Função</Label>
                  <Textarea
                    id="responsibilities"
                    value={formData.responsibilities}
                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                    placeholder="Liste as principais responsabilidades e atividades do dia a dia..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirementsText">Pré-requisitos</Label>
                  <Textarea
                    id="requirementsText"
                    value={formData.requirementsText}
                    onChange={(e) => setFormData({ ...formData, requirementsText: e.target.value })}
                    placeholder="Liste os requisitos obrigatórios: experiência, formação, conhecimentos técnicos..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niceToHave">Diferenciais</Label>
                  <Textarea
                    id="niceToHave"
                    value={formData.niceToHave}
                    onChange={(e) => setFormData({ ...formData, niceToHave: e.target.value })}
                    placeholder="Conhecimentos ou experiências que seriam um diferencial..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Informações Adicionais</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                    placeholder="Benefícios, etapas do processo seletivo, outras informações relevantes..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Salário e Configurações */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Configurações Adicionais
              </h4>
              
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salaryMin">Salário Mínimo (R$)</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salaryMax">Salário Máximo (R$)</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source">Fonte da Vaga</Label>
                    <Select 
                      value={formData.sourceId} 
                      onValueChange={(value) => setFormData({ ...formData, sourceId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a fonte" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeSources.map((source) => (
                          <SelectItem key={source.id} value={source.id}>
                            {source.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value) => setFormData({ ...formData, priority: value as Job['priority'] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="formTemplate">Template de Formulário</Label>
                  <Select 
                    value={formData.formTemplateId} 
                    onValueChange={(value) => setFormData({ ...formData, formTemplateId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um template (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Investimento */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Investimento
              </h4>
              <p className="text-xs text-muted-foreground -mt-2">
                Dados para cálculo futuro de custo por contratação
              </p>
              
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isBoosted">Vaga Impulsionada</Label>
                    <p className="text-sm text-muted-foreground">
                      Esta vaga possui investimento em divulgação
                    </p>
                  </div>
                  <Switch
                    id="isBoosted"
                    checked={formData.isBoosted}
                    onCheckedChange={(checked) => setFormData({ ...formData, isBoosted: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investmentAmount">Valor Investido (R$)</Label>
                  <Input
                    id="investmentAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.investmentAmount}
                    onChange={(e) => setFormData({ ...formData, investmentAmount: e.target.value })}
                    placeholder="0,00"
                    disabled={!formData.isBoosted}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : job ? "Salvar Alterações" : "Criar Vaga"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
