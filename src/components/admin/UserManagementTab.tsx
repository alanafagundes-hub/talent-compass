import { useState } from 'react';
import { useUsers, UserWithDetails } from '@/hooks/useUsers';
import { useAreas } from '@/hooks/useAreas';
import {
  Plus, Search, MoreVertical, UserCircle, Shield, MapPin,
  UserX, UserCheck, Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  rh: 'RH',
  head: 'Head',
  viewer: 'Visualizador',
};

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  rh: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  head: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  viewer: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export function UserManagementTab() {
  const { users, isLoading, createUser, updateUser, toggleUserStatus } = useUsers();
  const { areas } = useAreas();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'viewer' as 'admin' | 'rh' | 'head' | 'viewer',
    areaIds: [] as string[],
  });

  const filteredUsers = users.filter(user =>
    user.profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.profile.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUser = async () => {
    if (!formData.email || !formData.password || !formData.name) return;
    setIsSubmitting(true);
    const result = await createUser(formData);
    setIsSubmitting(false);
    if (result.success) {
      setIsCreateDialogOpen(false);
      setFormData({ email: '', password: '', name: '', role: 'viewer', areaIds: [] });
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    const result = await updateUser(selectedUser.profile.user_id, {
      name: formData.name,
      role: formData.role,
      areaIds: formData.areaIds,
    });
    setIsSubmitting(false);
    if (result.success) {
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const openEditDialog = (user: UserWithDetails) => {
    setSelectedUser(user);
    setFormData({
      email: user.profile.email,
      password: '',
      name: user.profile.name,
      role: user.role?.role || 'viewer',
      areaIds: user.areas.map(a => a.area_id),
    });
    setIsEditDialogOpen(true);
  };

  const toggleAreaSelection = (areaId: string) => {
    setFormData(prev => ({
      ...prev,
      areaIds: prev.areaIds.includes(areaId)
        ? prev.areaIds.filter(id => id !== areaId)
        : [...prev.areaIds, areaId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Gestão de Usuários</h2>
          <p className="text-sm text-muted-foreground">
            Liste, crie e gerencie os usuários do sistema
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou e-mail..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Áreas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.profile.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {user.profile.avatar_url ? (
                        <img
                          src={user.profile.avatar_url}
                          alt={user.profile.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCircle className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{user.profile.name}</p>
                        <p className="text-sm text-muted-foreground">{user.profile.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.role ? (
                      <Badge variant="secondary" className={roleColors[user.role.role]}>
                        <Shield className="mr-1 h-3 w-3" />
                        {roleLabels[user.role.role]}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Sem papel</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.areas.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.areas.slice(0, 2).map((a) => (
                          <Badge key={a.id} variant="outline" className="text-xs">
                            <MapPin className="mr-1 h-3 w-3" />
                            {a.area?.name}
                          </Badge>
                        ))}
                        {user.areas.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{user.areas.length - 2}</Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Todas</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.profile.is_active ? 'default' : 'secondary'}>
                      {user.profile.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => toggleUserStatus(user.profile.user_id, user.profile.is_active)}
                          className={user.profile.is_active ? 'text-destructive' : ''}
                        >
                          {user.profile.is_active ? (
                            <><UserX className="mr-2 h-4 w-4" />Desativar</>
                          ) : (
                            <><UserCheck className="mr-2 h-4 w-4" />Ativar</>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
            <DialogDescription>
              Crie um novo usuário no sistema. Um e-mail de confirmação será enviado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha inicial</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Papel</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'admin' | 'rh' | 'head' | 'viewer') =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="rh">RH</SelectItem>
                  <SelectItem value="head">Head</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.role === 'head' && (
              <div className="space-y-2">
                <Label>Áreas de acesso</Label>
                <div className="border rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                  {areas.map((area) => (
                    <div key={area.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`area-${area.id}`}
                        checked={formData.areaIds.includes(area.id)}
                        onCheckedChange={() => toggleAreaSelection(area.id)}
                      />
                      <label htmlFor={`area-${area.id}`} className="text-sm font-medium leading-none">
                        {area.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateUser} disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>Altere as informações e permissões do usuário.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">E-mail</Label>
              <Input id="edit-email" type="email" value={formData.email} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Papel</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'admin' | 'rh' | 'head' | 'viewer') =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="rh">RH</SelectItem>
                  <SelectItem value="head">Head</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.role === 'head' && (
              <div className="space-y-2">
                <Label>Áreas de acesso</Label>
                <div className="border rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                  {areas.map((area) => (
                    <div key={area.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-area-${area.id}`}
                        checked={formData.areaIds.includes(area.id)}
                        onCheckedChange={() => toggleAreaSelection(area.id)}
                      />
                      <label htmlFor={`edit-area-${area.id}`} className="text-sm font-medium leading-none">
                        {area.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateUser} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
