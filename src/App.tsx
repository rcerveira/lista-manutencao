
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
import { MobileMenu } from "./components/MobileMenu";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <div className="relative">
          <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b p-4">
            <div className="container mx-auto flex items-center justify-between">
              <MobileMenu />
            </div>
          </header>
          <main className="pt-16">
            <Toaster />
            <Sonner />
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
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
