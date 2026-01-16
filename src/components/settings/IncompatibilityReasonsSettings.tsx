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
  AlertCircle
} from "lucide-react";
import type { IncompatibilityReason } from "@/types/ats";
import { toast } from "sonner";

const initialReasons: IncompatibilityReason[] = [
  { id: "1", name: "Pretensão salarial acima do orçamento", description: "Candidato solicita salário além da faixa disponível", isArchived: false, createdAt: new Date() },
  { id: "2", name: "Perfil técnico incompatível", description: "Habilidades técnicas não atendem aos requisitos", isArchived: false, createdAt: new Date() },
  { id: "3", name: "Indisponibilidade de horário", description: "Candidato não pode cumprir o horário da vaga", isArchived: false, createdAt: new Date() },
  { id: "4", name: "Localização incompatível", description: "Candidato não pode trabalhar na localidade exigida", isArchived: false, createdAt: new Date() },
  { id: "5", name: "Desistência do candidato", description: "Candidato desistiu do processo seletivo", isArchived: false, createdAt: new Date() },
  { id: "6", name: "Aceite de outra proposta", description: "Candidato aceitou proposta de outra empresa", isArchived: false, createdAt: new Date() },
  { id: "7", name: "Sem retorno do candidato", description: "Candidato não respondeu às tentativas de contato", isArchived: false, createdAt: new Date() },
  { id: "8", name: "Reprovado no teste técnico", description: "Candidato não atingiu pontuação mínima no teste", isArchived: false, createdAt: new Date() },
  { id: "9", name: "Reprovado na entrevista", description: "Candidato não aprovado na etapa de entrevista", isArchived: false, createdAt: new Date() },
  { id: "10", name: "Fit cultural inadequado", description: "Perfil comportamental não alinha com a cultura da empresa", isArchived: false, createdAt: new Date() },
];

export default function IncompatibilityReasonsSettings() {
  const [reasons, setReasons] = useState<IncompatibilityReason[]>(initialReasons);
  const [showArchived, setShowArchived] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReason, setEditingReason] = useState<IncompatibilityReason | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const filteredReasons = reasons.filter(r => showArchived ? r.isArchived : !r.isArchived);

  const openCreateDialog = () => {
    setEditingReason(null);
    setFormData({ name: "", description: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (reason: IncompatibilityReason) => {
    setEditingReason(reason);
    setFormData({ name: reason.name, description: reason.description || "" });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (editingReason) {
      setReasons(reasons.map(r => 
        r.id === editingReason.id 
          ? { ...r, name: formData.name, description: formData.description }
          : r
      ));
      toast.success("Motivo atualizado!");
    } else {
      const newReason: IncompatibilityReason = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        isArchived: false,
        createdAt: new Date(),
      };
      setReasons([...reasons, newReason]);
      toast.success("Motivo criado!");
    }
    setIsDialogOpen(false);
  };

  const toggleArchive = (reason: IncompatibilityReason) => {
    setReasons(reasons.map(r => 
      r.id === reason.id ? { ...r, isArchived: !r.isArchived } : r
    ));
    toast.success(reason.isArchived ? "Motivo restaurado!" : "Motivo arquivado!");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Motivos de Incompatibilidade</CardTitle>
            <CardDescription>
              Defina os motivos padrão para reprovar candidatos
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
              Novo Motivo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReasons.length === 0 ? (
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
              {filteredReasons.map((reason) => (
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
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => openEditDialog(reason)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => toggleArchive(reason)}
                    >
                      {reason.isArchived ? (
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
              {editingReason ? "Editar Motivo" : "Novo Motivo de Incompatibilidade"}
            </DialogTitle>
            <DialogDescription>
              Defina um motivo padrão para reprovação de candidatos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Motivo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Pretensão salarial acima do orçamento"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes adicionais sobre este motivo..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingReason ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
