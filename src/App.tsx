import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Vagas from "./pages/Vagas";
import VagaFunil from "./pages/VagaFunil";
import CandidatoDetalhe from "./pages/CandidatoDetalhe";
import Talentos from "./pages/Talentos";
import Perdidos from "./pages/Perdidos";
import Configuracoes from "./pages/Configuracoes";
import ConfiguracoesRecrutamento from "./pages/ConfiguracoesRecrutamento";
import VagasPublicas from "./pages/VagasPublicas";
import VagaPublica from "./pages/VagaPublica";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import { Users, Target, MessageSquare, TrendingUp, MessagesSquare, FileText, SmilePlus, LayoutDashboard } from "lucide-react";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes - No Layout */}
          <Route path="/carreiras" element={<VagasPublicas />} />
          <Route path="/carreiras/:id" element={<VagaPublica />} />
          
          {/* Admin Routes - With Layout */}
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/vagas" element={<AppLayout><Vagas /></AppLayout>} />
          <Route path="/vagas/:jobId/funil" element={<AppLayout><VagaFunil /></AppLayout>} />
          <Route path="/vagas/:jobId/candidato/:cardId" element={<AppLayout><CandidatoDetalhe /></AppLayout>} />
          <Route path="/talentos" element={<AppLayout><Talentos /></AppLayout>} />
          <Route path="/perdidos" element={<AppLayout><Perdidos /></AppLayout>} />
          <Route path="/configuracoes" element={<AppLayout><Configuracoes /></AppLayout>} />
          <Route path="/configuracoes/recrutamento" element={<AppLayout><ConfiguracoesRecrutamento /></AppLayout>} />
          
          {/* HCM Routes - Placeholder (roadmap) */}
          <Route path="/hcm/dashboard" element={<AppLayout><PlaceholderPage title="Dashboard" description="Visão geral de métricas e indicadores de People e Performance." icon={LayoutDashboard} /></AppLayout>} />
          <Route path="/hcm/colaboradores" element={<AppLayout><PlaceholderPage title="Colaboradores" description="Gestão completa do quadro de colaboradores da empresa." icon={Users} /></AppLayout>} />
          <Route path="/hcm/gestao" element={<AppLayout><PlaceholderPage title="Gestão de Pessoas" description="Hub central para gestão e desenvolvimento de pessoas." icon={Target} /></AppLayout>} />
          <Route path="/hcm/gestao/1-1s" element={<AppLayout><PlaceholderPage title="1:1s" description="Reuniões one-on-one entre gestores e colaboradores." icon={MessageSquare} /></AppLayout>} />
          <Route path="/hcm/gestao/pdis" element={<AppLayout><PlaceholderPage title="PDIs" description="Planos de Desenvolvimento Individual dos colaboradores." icon={TrendingUp} /></AppLayout>} />
          <Route path="/hcm/gestao/conversas" element={<AppLayout><PlaceholderPage title="Conversas" description="Histórico de conversas e feedbacks registrados." icon={MessagesSquare} /></AppLayout>} />
          <Route path="/hcm/gestao/documentos" element={<AppLayout><PlaceholderPage title="Documentos" description="Gestão de documentos e arquivos dos colaboradores." icon={FileText} /></AppLayout>} />
          <Route path="/hcm/csat" element={<AppLayout><PlaceholderPage title="CSAT Interno" description="Pesquisas de satisfação e clima organizacional." icon={SmilePlus} /></AppLayout>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
