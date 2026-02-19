import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "@/components/ui/separator";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/vagas": "Vagas",
  "/talentos": "Banco de Talentos",
  "/perdidos": "Perdidos",
  "/configuracoes": "Configurações",
  "/configuracoes/recrutamento": "Recrutamento",
  "/usuarios": "Usuários",
  // HCM Routes
  "/hcm": "People e Performance",
  "/hcm/dashboard": "Dashboard",
  "/hcm/colaboradores": "Colaboradores",
  "/hcm/gestao": "Gestão",
  "/hcm/gestao/1-1s": "1:1s",
  "/hcm/gestao/pdis": "PDIs",
  "/hcm/gestao/conversas": "Conversas",
  "/hcm/gestao/documentos": "Documentos",
  "/hcm/csat": "CSAT Interno",
};

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, userRole } = useAuth();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const getBreadcrumbs = () => {
    const crumbs: { label: string; path: string; isLast: boolean }[] = [];
    let currentPath = "";

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeLabels[currentPath] || segment;
      crumbs.push({
        label,
        path: currentPath,
        isLast: index === pathSegments.length - 1,
      });
    });

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const pageTitle = routeLabels[location.pathname] || "Dashboard";

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user) return 'U';
    const name = user.user_metadata?.name || user.email || '';
    if (user.user_metadata?.name) {
      return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email?.charAt(0).toUpperCase() || 'U';
  };

  // Get display name
  const getDisplayName = () => {
    if (!user) return 'Usuário';
    return user.user_metadata?.name || user.email || 'Usuário';
  };

  // Get role label
  const getRoleLabel = () => {
    const roleLabels: Record<string, string> = {
      admin: 'Administrador',
      rh: 'RH',
      head: 'Head',
      viewer: 'Visualizador',
    };
    return userRole ? roleLabels[userRole] || userRole : 'Usuário';
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <header className="flex h-11 shrink-0 items-center gap-2 border-b border-border/50 bg-background px-3">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
            <Separator orientation="vertical" className="h-4 bg-border/50" />
            
            {/* Page title - clean header style */}
            <h1 className="text-[0.8125rem] font-medium text-foreground flex-1">
              {pageTitle}
            </h1>
            
            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
                      {getUserInitials()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-primary mt-1">
                        {getRoleLabel()}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/usuarios')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-background p-4">
            <div className="mx-auto w-full max-w-[1280px]">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
