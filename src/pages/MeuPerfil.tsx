import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Shield, 
  MapPin, 
  Pencil, 
  Camera 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

export default function MeuPerfil() {
  const { user } = useAuth();
  const { users, isLoading, updateUser } = useUsers();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '' });

  const currentUserProfile = users.find(u => u.profile.user_id === user?.id);

  const handleUpdateProfile = async () => {
    if (!user?.id || !formData.name.trim()) return;
    setIsSubmitting(true);
    const result = await updateUser(user.id, { name: formData.name });
    setIsSubmitting(false);
    if (result.success) setIsEditDialogOpen(false);
  };

  const openEditDialog = () => {
    if (currentUserProfile) setFormData({ name: currentUserProfile.profile.name });
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Meu Perfil</h1>
          <p className="text-sm text-muted-foreground mt-1">Visualize e edite suas informações pessoais</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUserProfile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Meu Perfil</h1>
          <p className="text-sm text-muted-foreground mt-1">Visualize e edite suas informações pessoais</p>
        </div>
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Não foi possível carregar seu perfil.
          </CardContent>
        </Card>
      </div>
    );
  }

  const profile = currentUserProfile.profile;
  const role = currentUserProfile.role;
  const areas = currentUserProfile.areas;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Meu Perfil</h1>
        <p className="text-sm text-muted-foreground mt-1">Visualize e edite suas informações pessoais</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>Seus dados cadastrais no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.name} />
                <AvatarFallback className="text-2xl">
                  {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{profile.name}</h3>
                  <p className="text-muted-foreground">{profile.email}</p>
                </div>
                <Button variant="outline" size="sm" onClick={openEditDialog}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Papel</Label>
                  <div className="mt-1">
                    {role ? (
                      <Badge variant="secondary" className={roleColors[role.role]}>
                        <Shield className="mr-1 h-3 w-3" />
                        {roleLabels[role.role]}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Não definido</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Status</Label>
                  <div className="mt-1">
                    <Badge variant={profile.is_active ? 'default' : 'secondary'}>
                      {profile.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
                {areas.length > 0 && (
                  <div className="md:col-span-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Áreas de Acesso</Label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {areas.map((a) => (
                        <Badge key={a.id} variant="outline" className="text-xs">
                          <MapPin className="mr-1 h-3 w-3" />
                          {a.area?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>Atualize suas informações pessoais.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="self-name">Nome</Label>
              <Input
                id="self-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="self-email">E-mail</Label>
              <Input id="self-email" type="email" value={profile.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateProfile} disabled={isSubmitting || !formData.name.trim()}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
