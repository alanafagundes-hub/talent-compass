import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
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
  Copy,
  Loader2
} from "lucide-react";
import type { FormField, FormFieldType } from "@/types/ats";
import { useFormTemplates } from "@/hooks/useFormTemplates";
import { toast } from "sonner";

const fieldTypeConfig: Record<FormFieldType, { icon: React.ReactNode; label: string }> = {
  short_text: { icon: <Type className="h-4 w-4" />, label: "Texto Curto" },
  long_text: { icon: <AlignLeft className="h-4 w-4" />, label: "Texto Longo" },
  multiple_choice: { icon: <ListChecks className="h-4 w-4" />, label: "Múltipla Escolha" },
  yes_no: { icon: <ToggleLeft className="h-4 w-4" />, label: "Sim/Não" },
  file_upload: { icon: <Upload className="h-4 w-4" />, label: "Upload de Arquivo" },
};

export default function FormTemplatesSettings() {
  const { templates, isLoading, createTemplate, updateTemplate, toggleArchive, duplicateTemplate } = useFormTemplates();
  const [showArchived, setShowArchived] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
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
    setEditingTemplateId(null);
    setFormData({
      name: "",
      description: "",
      isDefault: false,
      fields: [],
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    setEditingTemplateId(template.id);
    setFormData({
      name: template.name,
      description: template.description || "",
      isDefault: template.isDefault,
      fields: [...template.fields],
    });
    setIsDialogOpen(true);
  };

  const handleDuplicate = async (templateId: string) => {
    await duplicateTemplate(templateId);
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

  const handleSave = async () => {
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

    setIsSaving(true);
    try {
      if (editingTemplateId) {
        await updateTemplate(editingTemplateId, formData);
      } else {
        await createTemplate(formData);
      }
      setIsDialogOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleArchive = async (templateId: string) => {
    await toggleArchive(templateId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Templates de Formulário</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

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
                      onClick={() => handleDuplicate(template.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => openEditDialog(template.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleToggleArchive(template.id)}
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
              {editingTemplateId ? "Editar Template" : "Novo Template"}
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : editingTemplateId ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
