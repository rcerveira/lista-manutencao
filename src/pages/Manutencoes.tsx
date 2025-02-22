
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Plus, Search } from "lucide-react";
import { toast } from "sonner";

export default function Manutencoes() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: maintenances, isLoading } = useQuery({
    queryKey: ['maintenances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenances')
        .select(`
          *,
          maintenance_tasks (
            id,
            description,
            completed
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Erro ao carregar manutenções");
        throw error;
      }

      return data;
    },
  });

  const handleCreateNew = () => {
    navigate("/manutencao/nova");
  };

  const handleViewDetails = (id: string) => {
    navigate(`/manutencao/${id}`);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBackToHome}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Manutenções</h1>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Manutenção
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar manutenções..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="grid gap-4">
        {maintenances
          ?.filter(
            (record) =>
              record.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              record.serial_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
              record.model.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((record) => (
            <Card
              key={record.id}
              className="hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => handleViewDetails(record.id)}
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1 flex-1">
                  <h2 className="font-semibold">{record.model}</h2>
                  <div className="text-sm text-muted-foreground space-x-4">
                    <span>Cliente: {record.client_name}</span>
                    <span>•</span>
                    <span>Número de Série: {record.serial_number}</span>
                    <span>•</span>
                    <span>Ano: {record.year}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    <span>Progresso: {record.progress}%</span>
                    <div className="w-full bg-secondary h-2 rounded-full mt-1">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${record.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
