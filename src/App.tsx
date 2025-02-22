
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ManutencaoDetalhes from "./pages/ManutencaoDetalhes";
import Manutencoes from "./pages/Manutencoes";
import NotFound from "./pages/NotFound";
import Requests from "./pages/Requests";
import RequestDetails from "./pages/RequestDetails";
import Categories from "./pages/Categories";
import RequestStatuses from "./pages/RequestStatuses";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/manutencoes" element={<Manutencoes />} />
          <Route path="/manutencao/:id" element={<ManutencaoDetalhes />} />
          <Route path="/manutencao/nova" element={<ManutencaoDetalhes />} />
          <Route path="/solicitacoes" element={<Requests />} />
          <Route path="/solicitacao/:id" element={<RequestDetails />} />
          <Route path="/solicitacao/nova" element={<RequestDetails />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/status" element={<RequestStatuses />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
