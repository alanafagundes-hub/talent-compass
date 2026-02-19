import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Shield } from 'lucide-react';
import { AccessProfilesTab } from '@/components/admin/AccessProfilesTab';
import { UserManagementTab } from '@/components/admin/UserManagementTab';

export default function ConfiguracoesGerais() {
  const { userRole } = useAuth();

  if (userRole !== 'admin') {
    return <Navigate to="/meu-perfil" replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Configurações Gerais</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie usuários, perfis de acesso e permissões do sistema
        </p>
      </div>

      <Tabs defaultValue="usuarios" className="w-full">
        <TabsList>
          <TabsTrigger value="usuarios" className="gap-2">
            <Users className="h-4 w-4" />
            Gestão de Usuários
          </TabsTrigger>
          <TabsTrigger value="perfis" className="gap-2">
            <Shield className="h-4 w-4" />
            Perfis de Acesso
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="mt-6">
          <UserManagementTab />
        </TabsContent>

        <TabsContent value="perfis" className="mt-6">
          <AccessProfilesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
