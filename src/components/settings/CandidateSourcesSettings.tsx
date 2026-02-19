import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Link2,
  Linkedin,
  Users,
  Globe,
  Building,
  GraduationCap,
  Megaphone
} from "lucide-react";
import type { CandidateSource } from "@/types/ats";
import { toast } from "sonner";

const iconOptions = [
  { id: "linkedin", icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn" },
  { id: "users", icon: <Users className="h-4 w-4" />, label: "Indicação" },
  { id: "globe", icon: <Globe className="h-4 w-4" />, label: "Site" },
  { id: "building", icon: <Building className="h-4 w-4" />, label: "Empresa" },
  { id: "graduation", icon: <GraduationCap className="h-4 w-4" />, label: "Universidade" },
  { id: "megaphone", icon: <Megaphone className="h-4 w-4" />, label: "Anúncio" },
  { id: "link", icon: <Link2 className="h-4 w-4" />, label: "Outro" },
];

const getIconComponent = (iconId?: string) => {
  const iconConfig = iconOptions.find(i => i.id === iconId);
  return iconConfig?.icon || <Link2 className="h-4 w-4" />;
};

const initialSources: CandidateSource[] = [
  { id: "1", name: "LinkedIn", icon: "linkedin", isArchived: false, createdAt: new Date() },
  { id: "2", name: "Indicação Interna", icon: "users", isArchived: false, createdAt: new Date() },
  { id: "3", name: "Site Carreiras", icon: "globe", isArchived: false, createdAt: new Date() },
  { id: "4", name: "Indeed", icon: "link", isArchived: false, createdAt: new Date() },
  { id: "5", name: "Glassdoor", icon: "link", isArchived: false, createdAt: new Date() },
  { id: "6", name: "Gupy", icon: "link", isArchived: false, createdAt: new Date() },
  { id: "7", name: "Feira de Carreiras", icon: "graduation", isArchived: false, createdAt: new Date() },
  { id: "8", name: "Instagram", icon: "megaphone", isArchived: false, createdAt: new Date() },
];

export default function CandidateSourcesSettings() {
  const [sources, setSources] = useState<CandidateSource[]>(initialSources);
  const [showArchived, setShowArchived] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<CandidateSource | null>(null);
  const [formData, setFormData] = useState({ name: "", icon: "link" });

  const filteredSources = sources.filter(s => showArchived ? s.isArchived : !s.isArchived);

  const openCreateDialog = () => {
    setEditingSource(null);
    setFormData({ name: "", icon: "link" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (source: CandidateSource) => {
    setEditingSource(source);
    setFormData({ name: source.name, icon: source.icon || "link" });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (editingSource) {
      setSources(sources.map(s => 
        s.id === editingSource.id 
          ? { ...s, name: formData.name, icon: formData.icon }
          : s
      ));
      toast.success("Fonte atualizada!");
    } else {
      const newSource: CandidateSource = {
        id: Date.now().toString(),
        name: formData.name,
        icon: formData.icon,
        isArchived: false,
        createdAt: new Date(),
      };
      setSources([...sources, newSource]);
      toast.success("Fonte criada!");
    }
    setIsDialogOpen(false);
  };

  const toggleArchive = (source: CandidateSource) => {
    setSources(sources.map(s => 
      s.id === source.id ? { ...s, isArchived: !s.isArchived } : s
    ));
    toast.success(source.isArchived ? "Fonte restaurada!" : "Fonte arquivada!");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fontes de Candidatura</CardTitle>
            <CardDescription>
              Configure de onde os candidatos chegam (LinkedIn, Indicação, etc.)
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
              Nova Fonte
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSources.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
              <Link2 className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                {showArchived ? "Nenhuma fonte arquivada" : "Nenhuma fonte criada"}
              </h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Defina as fontes de onde os candidatos chegam
              </p>
              {!showArchived && (
                <Button onClick={openCreateDialog} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Primeira Fonte
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSources.map((source) => (
                <div
                  key={source.id}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50 ${source.isArchived ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {getIconComponent(source.icon)}
                    </div>
                    <p className="font-medium">{source.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => openEditDialog(source)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => toggleArchive(source)}
                    >
                      {source.isArchived ? (
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
              {editingSource ? "Editar Fonte" : "Nova Fonte de Candidatura"}
            </DialogTitle>
            <DialogDescription>
              Configure uma fonte de onde candidatos se aplicam
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Fonte</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: LinkedIn, Indeed, Indicação..."
              />
            </div>
            <div className="space-y-2">
              <Label>Ícone</Label>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map((option) => (
                  <Button
                    key={option.id}
                    type="button"
                    variant={formData.icon === option.id ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={() => setFormData({ ...formData, icon: option.id })}
                  >
                    {option.icon}
                    <span className="text-xs">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="pt-2">
              <Label>Preview</Label>
              <div className="mt-2 flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {getIconComponent(formData.icon)}
                </div>
                <span className="font-medium">{formData.name || "Nome da fonte"}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingSource ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
