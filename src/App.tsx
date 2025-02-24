
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/manutencoes" element={<Manutencoes />} />
            <Route path="/manutencoes/:id" element={<ManutencaoDetalhes />} />
            <Route path="/solicitacoes" element={<Requests />} />
            <Route path="/solicitacoes/nova" element={<RequestDetails />} />
            <Route path="/solicitacoes/:id" element={<RequestDetails />} />
            <Route path="/categorias" element={<Categories />} />
            <Route path="/status-solicitacao" element={<RequestStatuses />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
