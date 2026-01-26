import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Vagas from "./pages/Vagas";
import VagaFunil from "./pages/VagaFunil";
import CandidatoDetalhe from "./pages/CandidatoDetalhe";
import Talentos from "./pages/Talentos";
import Perdidos from "./pages/Perdidos";
import ConfiguracoesRecrutamento from "./pages/ConfiguracoesRecrutamento";
import VagasPublicas from "./pages/VagasPublicas";
import VagaPublica from "./pages/VagaPublica";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import { Users, Target, MessageSquare, TrendingUp, MessagesSquare, FileText, SmilePlus, LayoutDashboard } from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes - No Layout, No Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/carreiras" element={<VagasPublicas />} />
            <Route path="/carreiras/:id" element={<VagaPublica />} />
            
            {/* Protected Admin Routes - With Layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout><Dashboard /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/vagas" element={
              <ProtectedRoute>
                <AppLayout><Vagas /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/vagas/:jobId/funil" element={
              <ProtectedRoute>
                <AppLayout><VagaFunil /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/vagas/:jobId/candidato/:cardId" element={
              <ProtectedRoute>
                <AppLayout><CandidatoDetalhe /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/talentos" element={
              <ProtectedRoute>
                <AppLayout><Talentos /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/perdidos" element={
              <ProtectedRoute>
                <AppLayout><Perdidos /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute>
                <AppLayout><ConfiguracoesRecrutamento /></AppLayout>
              </ProtectedRoute>
            } />
            
            {/* HCM Routes - Placeholder (roadmap) */}
            <Route path="/hcm/dashboard" element={
              <ProtectedRoute>
                <AppLayout><PlaceholderPage title="Dashboard" description="Visão geral de métricas e indicadores de People e Performance." icon={LayoutDashboard} /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/hcm/colaboradores" element={
              <ProtectedRoute>
                <AppLayout><PlaceholderPage title="Colaboradores" description="Gestão completa do quadro de colaboradores da empresa." icon={Users} /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/hcm/gestao" element={
              <ProtectedRoute>
                <AppLayout><PlaceholderPage title="Gestão de Pessoas" description="Hub central para gestão e desenvolvimento de pessoas." icon={Target} /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/hcm/gestao/1-1s" element={
              <ProtectedRoute>
                <AppLayout><PlaceholderPage title="1:1s" description="Reuniões one-on-one entre gestores e colaboradores." icon={MessageSquare} /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/hcm/gestao/pdis" element={
              <ProtectedRoute>
                <AppLayout><PlaceholderPage title="PDIs" description="Planos de Desenvolvimento Individual dos colaboradores." icon={TrendingUp} /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/hcm/gestao/conversas" element={
              <ProtectedRoute>
                <AppLayout><PlaceholderPage title="Conversas" description="Histórico de conversas e feedbacks registrados." icon={MessagesSquare} /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/hcm/gestao/documentos" element={
              <ProtectedRoute>
                <AppLayout><PlaceholderPage title="Documentos" description="Gestão de documentos e arquivos dos colaboradores." icon={FileText} /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/hcm/csat" element={
              <ProtectedRoute>
                <AppLayout><PlaceholderPage title="CSAT Interno" description="Pesquisas de satisfação e clima organizacional." icon={SmilePlus} /></AppLayout>
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
