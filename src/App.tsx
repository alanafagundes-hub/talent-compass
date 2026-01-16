import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Vagas from "./pages/Vagas";
import Talentos from "./pages/Talentos";
import Perdidos from "./pages/Perdidos";
import Configuracoes from "./pages/Configuracoes";
import ConfiguracoesRecrutamento from "./pages/ConfiguracoesRecrutamento";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vagas" element={<Vagas />} />
            <Route path="/talentos" element={<Talentos />} />
            <Route path="/perdidos" element={<Perdidos />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/configuracoes/recrutamento" element={<ConfiguracoesRecrutamento />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
