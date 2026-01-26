import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserX,
  Settings,
  ChevronDown,
  UserCircle,
  Target,
  MessageSquare,
  TrendingUp,
  MessagesSquare,
  FileText,
  SmilePlus,
  ShieldCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import logoDot from "@/assets/logo-dot.png";
import { useAuth } from "@/contexts/AuthContext";

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Vagas",
    url: "/vagas",
    icon: Briefcase,
  },
  {
    title: "Banco de Talentos",
    url: "/talentos",
    icon: Users,
  },
  {
    title: "Perdidos",
    url: "/perdidos",
    icon: UserX,
  },
];


// HCM Menu Items (roadmap - placeholder)
const hcmMenuItems = [
  {
    title: "Dashboard",
    url: "/hcm/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Colaboradores",
    url: "/hcm/colaboradores",
    icon: UserCircle,
  },
  {
    title: "CSAT Interno",
    url: "/hcm/csat",
    icon: SmilePlus,
  },
];

const gestaoSubItems = [
  {
    title: "1:1s",
    url: "/hcm/gestao/1-1s",
    icon: MessageSquare,
  },
  {
    title: "PDIs",
    url: "/hcm/gestao/pdis",
    icon: TrendingUp,
  },
  {
    title: "Conversas",
    url: "/hcm/gestao/conversas",
    icon: MessagesSquare,
  },
  {
    title: "Documentos",
    url: "/hcm/gestao/documentos",
    icon: FileText,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const { userRole } = useAuth();
  const isCollapsed = state === "collapsed";
  const [hcmOpen, setHcmOpen] = useState(
    location.pathname.startsWith("/hcm")
  );
  const [gestaoOpen, setGestaoOpen] = useState(
    location.pathname.startsWith("/hcm/gestao")
  );

  const isAdmin = userRole === 'admin';

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-6">
        <div className="flex items-center justify-center">
          {!isCollapsed ? (
            <img 
              src={logoDot} 
              alt="DOT" 
              className="h-12 w-auto object-contain"
            />
          ) : (
            <img 
              src={logoDot} 
              alt="DOT" 
              className="h-9 w-auto object-contain"
            />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted text-[11px] uppercase tracking-wider font-medium mb-3 px-3">
            Recrutamento e Seleção
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                        isActive(item.url)
                          ? "bg-sidebar-accent text-primary font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className={cn(
                        "h-4 w-4 shrink-0",
                        isActive(item.url) ? "text-primary" : ""
                      )} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Configurações */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/configuracoes")}
                  tooltip="Configurações"
                >
                  <NavLink
                    to="/configuracoes"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                      isActive("/configuracoes")
                        ? "bg-sidebar-accent text-primary font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Settings className={cn(
                      "h-4 w-4 shrink-0",
                      isActive("/configuracoes") ? "text-primary" : ""
                    )} />
                    {!isCollapsed && <span>Configurações</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* HCM Section - Roadmap Placeholder */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-sidebar-muted text-[11px] uppercase tracking-wider font-medium mb-3 px-3 flex items-center gap-2">
            People e Performance
            {!isCollapsed && (
              <span className="ml-auto text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-semibold">
                Em breve
              </span>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {hcmMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                        isActive(item.url)
                          ? "bg-sidebar-accent text-primary font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className={cn(
                        "h-4 w-4 shrink-0",
                        isActive(item.url) ? "text-primary" : ""
                      )} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Gestão Submenu */}
              <Collapsible
                open={gestaoOpen}
                onOpenChange={setGestaoOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip="Gestão"
                      isActive={isActive("/hcm/gestao")}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-all w-full",
                        isActive("/hcm/gestao")
                          ? "bg-sidebar-accent text-primary font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Target className={cn(
                          "h-4 w-4 shrink-0",
                          isActive("/hcm/gestao") ? "text-primary" : ""
                        )} />
                        {!isCollapsed && <span>Gestão</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-200",
                            gestaoOpen && "rotate-180"
                          )}
                        />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {gestaoSubItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(subItem.url)}
                          >
                            <NavLink
                              to={subItem.url}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-1.5 text-sm transition-all",
                                isActive(subItem.url)
                                  ? "text-primary font-medium"
                                  : "text-sidebar-muted hover:text-sidebar-foreground"
                              )}
                            >
                              <subItem.icon className={cn(
                                "h-3.5 w-3.5 shrink-0",
                                isActive(subItem.url) ? "text-primary" : ""
                              )} />
                              <span>{subItem.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Administração - Apenas Admin */}
        {isAdmin && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="text-sidebar-muted text-[11px] uppercase tracking-wider font-medium mb-3 px-3">
              Administração
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/usuarios")}
                    tooltip="Usuários"
                  >
                    <NavLink
                      to="/usuarios"
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                        isActive("/usuarios")
                          ? "bg-sidebar-accent text-primary font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <ShieldCheck className={cn(
                        "h-4 w-4 shrink-0",
                        isActive("/usuarios") ? "text-primary" : ""
                      )} />
                      {!isCollapsed && <span>Usuários</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

      </SidebarContent>
    </Sidebar>
  );
}
