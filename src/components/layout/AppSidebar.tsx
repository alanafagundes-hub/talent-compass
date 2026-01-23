import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserX,
  Settings,
  ChevronDown,
  ClipboardList,
  Building2,
  UsersRound,
  UserCircle,
  Target,
  MessageSquare,
  TrendingUp,
  MessagesSquare,
  FileText,
  SmilePlus,
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

const settingsSubItems = [
  {
    title: "Recrutamento",
    url: "/configuracoes/recrutamento",
    icon: ClipboardList,
  },
];

// HCM Menu Items (roadmap - placeholder)
const hcmMenuItems = [
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
  const isCollapsed = state === "collapsed";
  const [settingsOpen, setSettingsOpen] = useState(
    location.pathname.startsWith("/configuracoes")
  );
  const [hcmOpen, setHcmOpen] = useState(
    location.pathname.startsWith("/hcm")
  );
  const [gestaoOpen, setGestaoOpen] = useState(
    location.pathname.startsWith("/hcm/gestao")
  );

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-sidebar-foreground">
                DOT
              </span>
              <span className="text-xs text-sidebar-muted">
                Recrutamento
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted text-xs uppercase tracking-wider mb-2">
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
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                        isActive(item.url)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* HCM Section - Roadmap Placeholder */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-sidebar-muted text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
            <UsersRound className="h-3.5 w-3.5" />
            HCM
            {!isCollapsed && (
              <span className="ml-auto text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
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
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                        isActive(item.url)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
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
                        "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-all w-full",
                        isActive("/hcm/gestao")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span>Gestão</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
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
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
                                isActive(subItem.url)
                                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                  : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                              )}
                            >
                              <subItem.icon className="h-4 w-4 shrink-0" />
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

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-sidebar-muted text-xs uppercase tracking-wider mb-2">
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip="Configurações"
                      isActive={isActive("/configuracoes")}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-all w-full",
                        isActive("/configuracoes")
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span>Configurações</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            settingsOpen && "rotate-180"
                          )}
                        />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {settingsSubItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(subItem.url)}
                          >
                            <NavLink
                              to={subItem.url}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
                                isActive(subItem.url)
                                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                  : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                              )}
                            >
                              <subItem.icon className="h-4 w-4 shrink-0" />
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
      </SidebarContent>
    </Sidebar>
  );
}
