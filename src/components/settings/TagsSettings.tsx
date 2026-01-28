import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Archive, ArchiveRestore, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTags } from "@/hooks/useTags";

const colorOptions = [
  "#3B82F6", "#8B5CF6", "#22C55E", "#06B6D4", "#84CC16", 
  "#F43F5E", "#F59E0B", "#EC4899", "#6366F1", "#14B8A6",
  "#EF4444", "#10B981", "#F97316", "#64748B"
];

export default function TagsSettings() {
  const { 
    activeTags, 
    archivedTags, 
    isLoading, 
    createTag, 
    updateTag, 
    archiveTag, 
    restoreTag 
  } = useTags();
  
  const [showArchived, setShowArchived] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", color: colorOptions[0] });
  const [isSaving, setIsSaving] = useState(false);

  const displayedTags = showArchived ? archivedTags : activeTags;

  const openCreateDialog = () => {
    setEditingTagId(null);
    setFormData({ name: "", color: colorOptions[0] });
    setIsDialogOpen(true);
  };

  const openEditDialog = (tag: { id: string; name: string; color: string }) => {
    setEditingTagId(tag.id);
    setFormData({ name: tag.name, color: tag.color });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    setIsSaving(true);

    if (editingTagId) {
      const success = await updateTag(editingTagId, formData.name, formData.color);
      if (success) {
        toast.success("Etiqueta atualizada!");
      } else {
        toast.error("Erro ao atualizar etiqueta");
      }
    } else {
      const newTag = await createTag(formData.name, formData.color);
      if (newTag) {
        toast.success("Etiqueta criada!");
      } else {
        toast.error("Erro ao criar etiqueta");
      }
    }

    setIsSaving(false);
    setIsDialogOpen(false);
  };

  const handleToggleArchive = async (tag: { id: string; name: string; isArchived: boolean }) => {
    if (tag.isArchived) {
      const success = await restoreTag(tag.id);
      if (success) {
        toast.success("Etiqueta restaurada!");
      } else {
        toast.error("Erro ao restaurar etiqueta");
      }
    } else {
      const success = await archiveTag(tag.id);
      if (success) {
        toast.success("Etiqueta arquivada!");
      } else {
        toast.error("Erro ao arquivar etiqueta");
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Etiquetas</CardTitle>
            <CardDescription>
              Crie etiquetas para categorizar candidatos
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
            >
              {showArchived ? "Ver Ativas" : "Ver Arquivadas"}
            </Button>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Etiqueta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {displayedTags.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {showArchived ? "Nenhuma etiqueta arquivada" : "Nenhuma etiqueta criada"}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {displayedTags.map((tag) => (
                <div
                  key={tag.id}
                  className="group relative"
                >
                  <Badge
                    variant="outline"
                    className={`gap-2 py-2 px-4 pr-16 cursor-pointer transition-all hover:shadow-md ${tag.isArchived ? 'opacity-60' : ''}`}
                    style={{ borderColor: tag.color }}
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </Badge>
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => openEditDialog(tag)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => handleToggleArchive(tag)}
                    >
                      {tag.isArchived ? (
                        <ArchiveRestore className="h-3 w-3" />
                      ) : (
                        <Archive className="h-3 w-3" />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTagId ? "Editar Etiqueta" : "Nova Etiqueta"}
            </DialogTitle>
            <DialogDescription>
              Configure o nome e a cor da etiqueta
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Senior, React, Urgente"
              />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      formData.color === color 
                        ? 'ring-2 ring-offset-2 ring-primary' 
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
            </div>
            <div className="pt-2">
              <Label>Preview</Label>
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className="gap-2 py-2 px-4"
                  style={{ borderColor: formData.color }}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: formData.color }}
                  />
                  {formData.name || "Nome da etiqueta"}
                </Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                editingTagId ? "Salvar" : "Criar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
