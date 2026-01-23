import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border/50 bg-background px-4">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
            <Separator orientation="vertical" className="h-4 bg-border/50" />
            
            {/* Page title - clean header style */}
            <h1 className="text-sm font-medium text-foreground flex-1">
              {pageTitle}
            </h1>
            
            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
                A
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-background p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
