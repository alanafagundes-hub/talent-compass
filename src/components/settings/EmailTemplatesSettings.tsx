import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { 
  Plus, 
  Pencil, 
  Archive, 
  ArchiveRestore, 
  Mail,
  Copy,
  Eye
} from "lucide-react";
import type { EmailTemplate, EmailTemplateType } from "@/types/ats";
import { toast } from "sonner";

const emailTypeConfig: Record<EmailTemplateType, { label: string; color: string }> = {
  confirmation: { label: "Confirmação", color: "bg-green-500" },
  rejection: { label: "Reprovação", color: "bg-red-500" },
  interview_invite: { label: "Convite Entrevista", color: "bg-blue-500" },
  offer: { label: "Proposta", color: "bg-purple-500" },
  custom: { label: "Personalizado", color: "bg-gray-500" },
};

const initialTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Confirmação de Inscrição",
    type: "confirmation",
    subject: "Recebemos sua candidatura - {{vaga}}",
    body: `Olá {{candidato}},

Agradecemos seu interesse em fazer parte do time DOT!

Recebemos sua candidatura para a vaga de {{vaga}} e ela está sendo analisada pela nossa equipe de recrutamento.

Em breve entraremos em contato com mais informações sobre as próximas etapas do processo seletivo.

Atenciosamente,
Equipe DOT`,
    isDefault: true,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Reprovação Padrão",
    type: "rejection",
    subject: "Atualização sobre sua candidatura - {{vaga}}",
    body: `Olá {{candidato}},

Agradecemos o tempo que você dedicou ao nosso processo seletivo para a vaga de {{vaga}}.

Após uma análise cuidadosa, decidimos seguir com outros candidatos cujos perfis estão mais alinhados com as necessidades atuais da posição.

Isso não diminui suas qualificações. Encorajamos você a acompanhar nossas futuras oportunidades.

Desejamos sucesso em sua jornada profissional!

Atenciosamente,
Equipe DOT`,
    isDefault: true,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const variablesList = [
  { key: "{{candidato}}", description: "Nome do candidato" },
  { key: "{{vaga}}", description: "Título da vaga" },
  { key: "{{area}}", description: "Área da vaga" },
  { key: "{{empresa}}", description: "Nome da empresa (DOT)" },
  { key: "{{data}}", description: "Data atual" },
];

export default function EmailTemplatesSettings() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [showArchived, setShowArchived] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "custom" as EmailTemplateType,
    subject: "",
    body: "",
    isDefault: false,
  });

  const filteredTemplates = templates.filter(t => showArchived ? t.isArchived : !t.isArchived);

  const openCreateDialog = () => {
    setEditingTemplate(null);
    setFormData({
      name: "",
      type: "custom",
      subject: "",
      body: "",
      isDefault: false,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      type: template.type,
      subject: template.subject,
      body: template.body,
      isDefault: template.isDefault,
    });
    setIsDialogOpen(true);
  };

  const openPreview = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  const duplicateTemplate = (template: EmailTemplate) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Cópia)`,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTemplates([...templates, newTemplate]);
    toast.success("Template duplicado!");
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    if (!formData.subject.trim()) {
      toast.error("Assunto é obrigatório");
      return;
    }
    if (!formData.body.trim()) {
      toast.error("Corpo do e-mail é obrigatório");
      return;
    }

    if (editingTemplate) {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id 
          ? { 
              ...t, 
              ...formData,
              updatedAt: new Date(),
            }
          : formData.isDefault && formData.type === t.type ? { ...t, isDefault: false } : t
      ));
      toast.success("Template atualizado!");
    } else {
      const newTemplate: EmailTemplate = {
        id: Date.now().toString(),
        ...formData,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      if (formData.isDefault) {
        setTemplates([
          ...templates.map(t => t.type === formData.type ? { ...t, isDefault: false } : t), 
          newTemplate
        ]);
      } else {
        setTemplates([...templates, newTemplate]);
      }
      toast.success("Template criado!");
    }
    setIsDialogOpen(false);
  };

  const toggleArchive = (template: EmailTemplate) => {
    setTemplates(templates.map(t => 
      t.id === template.id ? { ...t, isArchived: !t.isArchived } : t
    ));
    toast.success(template.isArchived ? "Template restaurado!" : "Template arquivado!");
  };

  const getPreviewContent = (content: string) => {
    return content
      .replace(/{{candidato}}/g, "João Silva")
      .replace(/{{vaga}}/g, "Desenvolvedor Full Stack")
      .replace(/{{area}}/g, "Tech")
      .replace(/{{empresa}}/g, "DOT")
      .replace(/{{data}}/g, new Date().toLocaleDateString("pt-BR"));
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Templates de E-mail</CardTitle>
            <CardDescription>
              Configure e-mails automáticos para candidatos
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
            >
              {showArchived ? "Ver Ativos" : "Ver Arquivados"}
            </Button>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
              <Mail className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                {showArchived ? "Nenhum template arquivado" : "Nenhum template criado"}
              </h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Crie templates de e-mail para automatizar comunicações
              </p>
              {!showArchived && (
                <Button onClick={openCreateDialog} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Primeiro Template
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50 ${template.isArchived ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${emailTypeConfig[template.type].color}/10`}>
                      <Mail className={`h-5 w-5 text-${emailTypeConfig[template.type].color.replace('bg-', '')}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{template.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {emailTypeConfig[template.type].label}
                        </Badge>
                        {template.isDefault && (
                          <Badge variant="secondary" className="text-xs">Padrão</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {template.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => openPreview(template)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => duplicateTemplate(template)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => openEditDialog(template)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => toggleArchive(template)}
                    >
                      {template.isArchived ? (
                        <ArchiveRestore className="h-4 w-4" />
                      ) : (
                        <Archive className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Editar Template" : "Novo Template de E-mail"}
            </DialogTitle>
            <DialogDescription>
              Configure o template de e-mail com variáveis dinâmicas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Template</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Confirmação de Inscrição"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: EmailTemplateType) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(emailTypeConfig).map(([type, config]) => (
                      <SelectItem key={type} value={type}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
              />
              <Label htmlFor="isDefault">Definir como padrão para este tipo</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Ex: Recebemos sua candidatura - {{vaga}}"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Corpo do E-mail</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Escreva o conteúdo do e-mail..."
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <div className="rounded-lg bg-muted p-4">
              <Label className="text-sm font-medium">Variáveis Disponíveis</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {variablesList.map((v) => (
                  <Badge 
                    key={v.key} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => setFormData({ ...formData, body: formData.body + v.key })}
                  >
                    {v.key}
                    <span className="ml-1 text-muted-foreground">- {v.description}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingTemplate ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview do E-mail</DialogTitle>
            <DialogDescription>
              Visualize como o e-mail será exibido para o candidato
            </DialogDescription>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border p-4">
                <div className="border-b pb-3 mb-3">
                  <p className="text-sm text-muted-foreground">Assunto:</p>
                  <p className="font-medium">{getPreviewContent(previewTemplate.subject)}</p>
                </div>
                <div className="whitespace-pre-wrap text-sm">
                  {getPreviewContent(previewTemplate.body)}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
