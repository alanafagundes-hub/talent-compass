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
import NotFound from "./pages/NotFound";


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
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
