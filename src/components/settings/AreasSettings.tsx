import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Pencil, 
  Archive, 
  ArchiveRestore, 
  GripVertical,
  Building2,
  Briefcase,
  Loader2
} from "lucide-react";
import type { Area } from "@/types/ats";
import { useAreas } from "@/hooks/useAreas";
import { toast } from "sonner";

export default function AreasSettings() {
  const { areas, isLoading, createArea, updateArea, toggleArchive } = useAreas();

  const [showArchived, setShowArchived] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSaving, setIsSaving] = useState(false);

  const filteredAreas = areas.filter(a => showArchived ? a.isArchived : !a.isArchived);

  const openCreateDialog = () => {
    setEditingArea(null);
    setFormData({ name: "", description: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (area: Area) => {
    setEditingArea(area);
    setFormData({ name: area.name, description: area.description || "" });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    setIsSaving(true);
    try {
      if (editingArea) {
        const result = await updateArea(editingArea.id, { 
          name: formData.name, 
          description: formData.description 
        });
        if (!result) {
          toast.error("Erro ao atualizar área");
          return;
        }
      } else {
        const result = await createArea({ 
          name: formData.name, 
          description: formData.description, 
          isArchived: false 
        });
        if (!result) {
          toast.error("Erro ao criar área");
          return;
        }
      }
      setIsDialogOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleArchive = async (area: Area) => {
    await toggleArchive(area.id);
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
            <CardTitle>Áreas da Empresa</CardTitle>
            <CardDescription>
              Organize as vagas por áreas ou departamentos
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
              Nova Área
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAreas.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
              <Building2 className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                {showArchived ? "Nenhuma área arquivada" : "Nenhuma área criada"}
              </h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Crie áreas para organizar suas vagas por departamento
              </p>
              {!showArchived && (
                <Button onClick={openCreateDialog} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Primeira Área
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAreas.map((area) => (
                <div
                  key={area.id}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50 ${area.isArchived ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{area.name}</p>
                      {area.description && (
                        <p className="text-sm text-muted-foreground">{area.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => openEditDialog(area)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleToggleArchive(area)}
                    >
                      {area.isArchived ? (
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingArea ? "Editar Área" : "Nova Área"}
            </DialogTitle>
            <DialogDescription>
              Áreas são usadas para organizar e agrupar vagas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Área *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Tech, Comercial, Marketing..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva brevemente a área..."
                rows={3}
              />
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
              ) : (
                editingArea ? "Salvar" : "Criar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
