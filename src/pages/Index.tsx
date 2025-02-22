
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  const handleCreateMaintenance = () => {
    navigate("/manutencao/nova");
  };

  const handleCreateRequest = () => {
    navigate("/solicitacao/nova");
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">Início</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate("/solicitacoes")}>
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <h2 className="font-semibold">Solicitações de Materiais</h2>
              <p className="text-sm text-muted-foreground">
                Gerencie solicitações de materiais e acompanhe seus status
              </p>
            </div>
            <Button onClick={(e) => {
              e.stopPropagation();
              handleCreateRequest();
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Solicitação
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate("/manutencoes")}>
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <h2 className="font-semibold">Manutenções</h2>
              <p className="text-sm text-muted-foreground">
                Acompanhe e gerencie as manutenções em andamento
              </p>
            </div>
            <Button onClick={(e) => {
              e.stopPropagation();
              handleCreateMaintenance();
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Manutenção
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
