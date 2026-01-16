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
  GripVertical,
  Trash2,
  FileText,
  Type,
  AlignLeft,
  ListChecks,
  ToggleLeft,
  Upload,
  Copy
} from "lucide-react";
import type { FormTemplate, FormField, FormFieldType } from "@/types/ats";
import { toast } from "sonner";

const fieldTypeConfig: Record<FormFieldType, { icon: React.ReactNode; label: string }> = {
  short_text: { icon: <Type className="h-4 w-4" />, label: "Texto Curto" },
  long_text: { icon: <AlignLeft className="h-4 w-4" />, label: "Texto Longo" },
  multiple_choice: { icon: <ListChecks className="h-4 w-4" />, label: "Múltipla Escolha" },
  yes_no: { icon: <ToggleLeft className="h-4 w-4" />, label: "Sim/Não" },
  file_upload: { icon: <Upload className="h-4 w-4" />, label: "Upload de Arquivo" },
};

const initialTemplates: FormTemplate[] = [
  {
    id: "1",
    name: "Formulário Padrão",
    description: "Formulário básico para todas as vagas",
    isDefault: true,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    fields: [
      { id: "f1", label: "Nome Completo", type: "short_text", required: true, order: 1 },
      { id: "f2", label: "E-mail", type: "short_text", required: true, order: 2 },
      { id: "f3", label: "Telefone", type: "short_text", required: true, order: 3 },
      { id: "f4", label: "LinkedIn", type: "short_text", required: false, order: 4 },
      { id: "f5", label: "Por que você quer trabalhar conosco?", type: "long_text", required: true, order: 5 },
      { id: "f6", label: "Currículo", type: "file_upload", required: true, order: 6 },
    ],
  },
  {
    id: "2",
    name: "Formulário Tech",
    description: "Perguntas específicas para vagas de tecnologia",
    isDefault: false,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    fields: [
      { id: "f1", label: "Nome Completo", type: "short_text", required: true, order: 1 },
      { id: "f2", label: "E-mail", type: "short_text", required: true, order: 2 },
      { id: "f3", label: "GitHub", type: "short_text", required: false, order: 3 },
      { id: "f4", label: "Principais tecnologias", type: "multiple_choice", required: true, order: 4, options: ["React", "Node.js", "Python", "Java", "Go", "Outros"] },
      { id: "f5", label: "Anos de experiência", type: "short_text", required: true, order: 5 },
      { id: "f6", label: "Aceita trabalhar presencial?", type: "yes_no", required: true, order: 6 },
    ],
  },
];

export default function FormTemplatesSettings() {
  const [templates, setTemplates] = useState<FormTemplate[]>(initialTemplates);
  const [showArchived, setShowArchived] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FormTemplate | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    isDefault: boolean;
    fields: FormField[];
  }>({
    name: "",
    description: "",
    isDefault: false,
    fields: [],
  });

  const filteredTemplates = templates.filter(t => showArchived ? t.isArchived : !t.isArchived);

  const openCreateDialog = () => {
    setEditingTemplate(null);
    setFormData({
      name: "",
      description: "",
      isDefault: false,
      fields: [],
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (template: FormTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || "",
      isDefault: template.isDefault,
      fields: [...template.fields],
    });
    setIsDialogOpen(true);
  };

  const duplicateTemplate = (template: FormTemplate) => {
    const newTemplate: FormTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Cópia)`,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      fields: template.fields.map(f => ({ ...f, id: `${f.id}-copy-${Date.now()}` })),
    };
    setTemplates([...templates, newTemplate]);
    toast.success("Template duplicado!");
  };

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: "",
      type: "short_text",
      required: false,
      order: formData.fields.length + 1,
    };
    setFormData({ ...formData, fields: [...formData.fields, newField] });
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormData({
      ...formData,
      fields: formData.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f),
    });
  };

  const removeField = (fieldId: string) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter(f => f.id !== fieldId),
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (formData.fields.length === 0) {
      toast.error("Adicione pelo menos um campo");
      return;
    }

    if (formData.fields.some(f => !f.label.trim())) {
      toast.error("Todos os campos precisam de um rótulo");
      return;
    }

    if (editingTemplate) {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id 
          ? { 
              ...t, 
              name: formData.name, 
              description: formData.description,
              isDefault: formData.isDefault,
              fields: formData.fields,
              updatedAt: new Date(),
            }
          : formData.isDefault ? { ...t, isDefault: false } : t
      ));
      toast.success("Template atualizado!");
    } else {
      const newTemplate: FormTemplate = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        isDefault: formData.isDefault,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        fields: formData.fields,
      };
      
      if (formData.isDefault) {
        setTemplates([...templates.map(t => ({ ...t, isDefault: false })), newTemplate]);
      } else {
        setTemplates([...templates, newTemplate]);
      }
      toast.success("Template criado!");
    }
    setIsDialogOpen(false);
  };

  const toggleArchive = (template: FormTemplate) => {
    setTemplates(templates.map(t => 
      t.id === template.id ? { ...t, isArchived: !t.isArchived } : t
    ));
    toast.success(template.isArchived ? "Template restaurado!" : "Template arquivado!");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Templates de Formulário</CardTitle>
            <CardDescription>
              Crie formulários reutilizáveis para as vagas
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
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                {showArchived ? "Nenhum template arquivado" : "Nenhum template criado"}
              </h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Crie templates de formulário para coletar informações dos candidatos
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
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{template.name}</p>
                        {template.isDefault && (
                          <Badge variant="secondary" className="text-xs">Padrão</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {template.fields.length} campo(s)
                        {template.description && ` • ${template.description}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Editar Template" : "Novo Template"}
            </DialogTitle>
            <DialogDescription>
              Configure os campos do formulário de candidatura
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Template</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Formulário Tech"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição opcional"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
              />
              <Label htmlFor="isDefault">Definir como padrão para novas vagas</Label>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Campos do Formulário</Label>
                <Button type="button" variant="outline" size="sm" onClick={addField}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Campo
                </Button>
              </div>

              {formData.fields.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">Nenhum campo adicionado</p>
                  <Button type="button" variant="link" onClick={addField}>
                    Adicionar primeiro campo
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-start gap-3 rounded-lg border p-3 bg-muted/30"
                    >
                      <div className="pt-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      </div>
                      <div className="flex-1 grid gap-3 sm:grid-cols-[1fr,160px,auto]">
                        <div className="space-y-1">
                          <Input
                            value={field.label}
                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                            placeholder="Rótulo do campo"
                          />
                        </div>
                        <Select
                          value={field.type}
                          onValueChange={(value: FormFieldType) => updateField(field.id, { type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(fieldTypeConfig).map(([type, config]) => (
                              <SelectItem key={type} value={type}>
                                <div className="flex items-center gap-2">
                                  {config.icon}
                                  <span>{config.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center space-x-1">
                            <Switch
                              id={`required-${field.id}`}
                              checked={field.required}
                              onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                            />
                            <Label htmlFor={`required-${field.id}`} className="text-xs">Obrig.</Label>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeField(field.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
    </>
  );
}
