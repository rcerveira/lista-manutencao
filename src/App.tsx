
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { MobileMenu } from "@/components/MobileMenu";
import Index from "@/pages/Index";
import Manutencoes from "@/pages/Manutencoes";
import ManutencaoDetalhes from "@/pages/ManutencaoDetalhes";
import Requests from "@/pages/Requests";
import RequestDetails from "@/pages/RequestDetails";
import Categories from "@/pages/Categories";
import RequestStatuses from "@/pages/RequestStatuses";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <div className="relative">
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b p-4">
              <div className="container mx-auto flex items-center justify-between">
                <MobileMenu />
              </div>
            </header>
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/manutencoes" element={<Manutencoes />} />
                <Route path="/manutencao/nova" element={<ManutencaoDetalhes />} />
                <Route path="/manutencao/:id" element={<ManutencaoDetalhes />} />
                <Route path="/solicitacoes" element={<Requests />} />
                <Route path="/solicitacao/nova" element={<RequestDetails />} />
                <Route path="/solicitacao/:id" element={<RequestDetails />} />
                <Route path="/categorias" element={<Categories />} />
                <Route path="/status-solicitacao" element={<RequestStatuses />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </main>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
