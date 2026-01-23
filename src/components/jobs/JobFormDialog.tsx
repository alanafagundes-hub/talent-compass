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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { 
  Job, 
  JobStatus, 
  JobLevel, 
  ContractType, 
  Area, 
  CandidateSource,
  FormTemplate 
} from "@/types/ats";
import { jobLevelLabels, contractTypeLabels, jobStatusLabels } from "@/types/ats";
import { toast } from "sonner";

interface JobFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job | null;
  areas: Area[];
  sources: CandidateSource[];
  formTemplates: FormTemplate[];
  onSave: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
}

const initialFormData = {
  title: "",
  areaId: "",
  level: "pleno" as JobLevel,
  contractType: "clt" as ContractType,
  location: "",
  isRemote: false,
  description: "",
  requirements: "",
  salaryMin: "",
  salaryMax: "",
  sourceId: "",
  status: "rascunho" as JobStatus,
  formTemplateId: "",
  priority: "media" as Job['priority'],
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

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        areaId: job.areaId,
        level: job.level,
        contractType: job.contractType,
        location: job.location,
        isRemote: job.isRemote,
        description: job.description,
        requirements: job.requirements || "",
        salaryMin: job.salary?.min?.toString() || "",
        salaryMax: job.salary?.max?.toString() || "",
        sourceId: job.sourceId || "",
        status: job.status,
        formTemplateId: job.formTemplateId || "",
        priority: job.priority,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [job, open]);

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error("Título é obrigatório");
      return;
    }
    if (!formData.areaId) {
      toast.error("Área é obrigatória");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("Localidade é obrigatória");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Descrição é obrigatória");
      return;
    }

    const jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'> & { id?: string } = {
      ...(job && { id: job.id }),
      title: formData.title,
      areaId: formData.areaId,
      level: formData.level,
      contractType: formData.contractType,
      location: formData.location,
      isRemote: formData.isRemote,
      description: formData.description,
      requirements: formData.requirements || undefined,
      salary: formData.salaryMin || formData.salaryMax ? {
        min: formData.salaryMin ? parseInt(formData.salaryMin) : 0,
        max: formData.salaryMax ? parseInt(formData.salaryMax) : 0,
      } : undefined,
      sourceId: formData.sourceId || undefined,
      status: formData.status,
      formTemplateId: formData.formTemplateId || undefined,
      priority: formData.priority,
      isArchived: false,
    };

    onSave(jobData);
    onOpenChange(false);
  };

  const activeAreas = areas.filter(a => !a.isArchived);
  const activeSources = sources.filter(s => !s.isArchived);
  const activeTemplates = formTemplates.filter(t => !t.isArchived);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{job ? "Editar Vaga" : "Nova Vaga"}</DialogTitle>
          <DialogDescription>
            {job ? "Atualize as informações da vaga" : "Preencha os dados para criar uma nova vaga"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
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

            {/* Localização */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Localização
              </h4>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Localidade *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: São Paulo, SP"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="remote">Aceita Remoto</Label>
                    <p className="text-sm text-muted-foreground">
                      A vaga permite trabalho remoto
                    </p>
                  </div>
                  <Switch
                    id="remote"
                    checked={formData.isRemote}
                    onCheckedChange={(checked) => setFormData({ ...formData, isRemote: checked })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Descrição */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Descrição da Vaga
              </h4>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva as responsabilidades e atividades da vaga..."
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requisitos</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="Liste os requisitos técnicos e comportamentais..."
                    rows={4}
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
                  <p className="text-xs text-muted-foreground">
                    O formulário será usado para coleta de dados dos candidatos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {job ? "Salvar Alterações" : "Criar Vaga"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
