import { useState } from 'react';
import { useAccessProfiles, AccessProfile } from '@/hooks/useAccessProfiles';
import {
  Plus, Search, MoreVertical, Shield, Copy, Archive, Pencil, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const baseRoleLabels: Record<string, string> = {
  admin: 'Administrador',
  rh: 'RH',
  head: 'Head',
  viewer: 'Visualizador',
};

export function AccessProfilesTab() {
  const {
    profiles, modules, isLoading,
    createProfile, updateProfile, duplicateProfile, archiveProfile,
    updatePermission, getPermissionsForRole,
  } = useAccessProfiles();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPermsOpen, setIsPermsOpen] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<AccessProfile | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<AccessProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    display_name: '',
    description: '',
    base_role: 'custom',
  });

  const activeProfiles = profiles.filter(p => p.is_active);
  const filteredProfiles = activeProfiles.filter(p =>
    p.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async () => {
    if (!formData.display_name.trim()) return;
    setIsSubmitting(true);
    const result = await createProfile({
      name: formData.display_name.toLowerCase().replace(/\s+/g, '_'),
      display_name: formData.display_name,
      description: formData.description || undefined,
      base_role: formData.base_role,
    });
    setIsSubmitting(false);
    if (result.success) {
      setIsCreateOpen(false);
      setFormData({ display_name: '', description: '', base_role: 'custom' });
    }
  };

  const handleUpdate = async () => {
    if (!selectedProfile) return;
    setIsSubmitting(true);
    const result = await updateProfile(selectedProfile.id, {
      display_name: formData.display_name,
      description: formData.description,
      base_role: formData.base_role,
    });
    setIsSubmitting(false);
    if (result.success) {
      setIsEditOpen(false);
      setSelectedProfile(null);
    }
  };

  const openEdit = (profile: AccessProfile) => {
    setSelectedProfile(profile);
    setFormData({
      display_name: profile.display_name,
      description: profile.description || '',
      base_role: profile.base_role,
    });
    setIsEditOpen(true);
  };

  const openPermissions = (profile: AccessProfile) => {
    setSelectedProfile(profile);
    setIsPermsOpen(true);
  };

  const handleTogglePermission = async (
    roleId: string,
    moduleId: string,
    field: 'can_view' | 'can_create' | 'can_edit' | 'can_delete',
    currentPerms: { can_view: boolean; can_create: boolean; can_edit: boolean; can_delete: boolean }
  ) => {
    await updatePermission(roleId, moduleId, {
      ...currentPerms,
      [field]: !currentPerms[field],
    });
  };

  const usersUsingProfile = (profileId: string) => {
    // This is a simplified count - in a real app you'd query user counts
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Perfis de Acesso</h2>
          <p className="text-sm text-muted-foreground">
            Crie e gerencie perfis com permissões granulares por módulo
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Perfil
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar perfis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Profiles Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Perfil</TableHead>
              <TableHead>Base</TableHead>
              <TableHead>Módulos</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : filteredProfiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum perfil encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredProfiles.map((profile) => {
                const rolePerms = getPermissionsForRole(profile.id);
                return (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{profile.display_name}</p>
                          {profile.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {profile.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {baseRoleLabels[profile.base_role] || profile.base_role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => openPermissions(profile)}
                      >
                        {rolePerms.length} módulos
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(profile)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openPermissions(profile)}>
                            <Shield className="mr-2 h-4 w-4" />
                            Permissões
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateProfile(profile.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setArchiveTarget(profile)}
                            className="text-destructive"
                          >
                            <Archive className="mr-2 h-4 w-4" />
                            Arquivar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Profile Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Perfil de Acesso</DialogTitle>
            <DialogDescription>
              Crie um perfil para atribuir a usuários com permissões específicas.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm formData={formData} setFormData={setFormData} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={isSubmitting || !formData.display_name.trim()}>
              {isSubmitting ? 'Criando...' : 'Criar Perfil'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>Altere as informações do perfil de acesso.</DialogDescription>
          </DialogHeader>
          <ProfileForm formData={formData} setFormData={setFormData} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      {selectedProfile && (
        <Dialog open={isPermsOpen} onOpenChange={setIsPermsOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Permissões — {selectedProfile.display_name}</DialogTitle>
              <DialogDescription>
                Configure as permissões de acesso por módulo para este perfil.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[55vh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Módulo</TableHead>
                    <TableHead className="text-center">Visualizar</TableHead>
                    <TableHead className="text-center">Adicionar</TableHead>
                    <TableHead className="text-center">Editar</TableHead>
                    <TableHead className="text-center">Excluir</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((mod) => {
                    const perm = getPermissionsForRole(selectedProfile.id)
                      .find(p => p.module_id === mod.id);
                    const currentPerms = {
                      can_view: perm?.can_view ?? false,
                      can_create: perm?.can_create ?? false,
                      can_edit: perm?.can_edit ?? false,
                      can_delete: perm?.can_delete ?? false,
                    };

                    return (
                      <TableRow key={mod.id}>
                        <TableCell className="font-medium">{mod.display_name}</TableCell>
                        {(['can_view', 'can_create', 'can_edit', 'can_delete'] as const).map(field => (
                          <TableCell key={field} className="text-center">
                            <Checkbox
                              checked={currentPerms[field]}
                              onCheckedChange={() =>
                                handleTogglePermission(selectedProfile.id, mod.id, field, currentPerms)
                              }
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
            <DialogFooter>
              <Button onClick={() => setIsPermsOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Archive Confirmation */}
      <AlertDialog open={!!archiveTarget} onOpenChange={() => setArchiveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Arquivar perfil?</AlertDialogTitle>
            <AlertDialogDescription>
              O perfil "{archiveTarget?.display_name}" será arquivado. Usuários vinculados precisarão ser realocados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (archiveTarget) await archiveProfile(archiveTarget.id);
                setArchiveTarget(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Arquivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProfileForm({ formData, setFormData }: {
  formData: { display_name: string; description: string; base_role: string };
  setFormData: (data: any) => void;
}) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="profile-name">Nome do Perfil</Label>
        <Input
          id="profile-name"
          value={formData.display_name}
          onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
          placeholder="Ex: Recrutador Senior"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-desc">Descrição</Label>
        <Input
          id="profile-desc"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Breve descrição do perfil"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-base">Perfil Base</Label>
        <Select
          value={formData.base_role}
          onValueChange={(value) => setFormData({ ...formData, base_role: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="rh">RH</SelectItem>
            <SelectItem value="head">Head</SelectItem>
            <SelectItem value="viewer">Visualizador</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
