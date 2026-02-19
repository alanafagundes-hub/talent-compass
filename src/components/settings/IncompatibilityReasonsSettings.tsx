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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, ArchiveRestore, GripVertical, AlertCircle, Loader2 } from "lucide-react";
import { useIncompatibilityReasons } from "@/hooks/useIncompatibilityReasons";

export default function IncompatibilityReasonsSettings() {
  const { activeReasons, archivedReasons, isLoading, createReason, updateReason, toggleArchive } = useIncompatibilityReasons();
  
  const [showArchived, setShowArchived] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReasonId, setEditingReasonId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const displayedReasons = showArchived ? archivedReasons : activeReasons;

  const openCreateDialog = () => {
    setEditingReasonId(null);
    setFormData({ name: "", description: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (reason: { id: string; name: string; description?: string }) => {
    setEditingReasonId(reason.id);
    setFormData({ name: reason.name, description: reason.description || "" });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setIsSaving(true);
    if (editingReasonId) {
      await updateReason(editingReasonId, formData.name, formData.description);
    } else {
      await createReason(formData.name, formData.description);
    }
    setIsSaving(false);
    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await toggleArchive(deleteTarget.id);
    setDeleteTarget(null);
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
            <CardTitle>Motivos de Incompatibilidade</CardTitle>
            <CardDescription>Defina os motivos padrão para reprovar candidatos</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowArchived(!showArchived)}>
              {showArchived ? "Ver Ativos" : "Ver Arquivados"}
            </Button>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Motivo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {displayedReasons.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                {showArchived ? "Nenhum motivo arquivado" : "Nenhum motivo criado"}
              </h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Crie motivos de incompatibilidade para padronizar as reprovações
              </p>
              {!showArchived && (
                <Button onClick={openCreateDialog} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Primeiro Motivo
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {displayedReasons.map((reason) => (
                <div
                  key={reason.id}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50 ${reason.isArchived ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                    <div>
                      <p className="font-medium">{reason.name}</p>
                      {reason.description && (
                        <p className="text-sm text-muted-foreground">{reason.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(reason)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {reason.isArchived ? (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleArchive(reason.id)}>
                        <ArchiveRestore className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget({ id: reason.id, name: reason.name })}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingReasonId ? "Editar Motivo" : "Novo Motivo de Incompatibilidade"}</DialogTitle>
            <DialogDescription>Defina um motivo padrão para reprovação de candidatos</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Motivo</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Pretensão salarial acima do orçamento" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Detalhes adicionais sobre este motivo..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>) : (editingReasonId ? "Salvar" : "Criar")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir motivo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o motivo <strong>"{deleteTarget?.name}"</strong>? Ele será arquivado e poderá ser restaurado posteriormente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
