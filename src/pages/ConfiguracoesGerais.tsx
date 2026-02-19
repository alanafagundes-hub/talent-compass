import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Users, Shield } from 'lucide-react';
import { AccessProfilesTab } from '@/components/admin/AccessProfilesTab';
import { UserManagementTab } from '@/components/admin/UserManagementTab';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'usuarios', label: 'Usuários', icon: Users, path: '/configuracoes-gerais/usuarios' },
  { id: 'perfis', label: 'Perfis de Acesso', icon: Shield, path: '/configuracoes-gerais/perfis' },
];

export default function ConfiguracoesGerais() {
  const { userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (userRole !== 'admin') {
    return <Navigate to="/meu-perfil" replace />;
  }

  // Determine active tab from path
  const activeTab = location.pathname.includes('/perfis') ? 'perfis' : 'usuarios';

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Configurações Gerais</h1>
        <p className="text-[0.8125rem] text-muted-foreground mt-1">
          Gerencie usuários, perfis de acesso e permissões do sistema
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {activeTab === 'usuarios' && <UserManagementTab />}
        {activeTab === 'perfis' && <AccessProfilesTab />}
      </div>
    </div>
  );
}