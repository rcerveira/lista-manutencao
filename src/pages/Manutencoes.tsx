
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Plus, Search, Calendar, Wrench, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToHome}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Manutenções</h1>
        </div>
        <Button 
          onClick={handleCreateNew}
          className="w-full sm:w-auto"
        >
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
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg line-clamp-1">{record.client_name}</h2>
                    <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Wrench className="h-4 w-4 shrink-0" />
                        <span>Informações do Equipamento</span>
                      </div>
                      <div className="text-sm space-y-1 pl-6">
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">Modelo:</span>
                          <span>{record.model}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">Número de Série:</span>
                          <span>{record.serial_number}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">Ano:</span>
                          <span>{record.year}</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>Data da Manutenção</span>
                      </div>
                      <p className="text-sm pl-6">
                        {format(new Date(record.maintenance_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Progresso: {record.progress}%</span>
                      </div>
                      <div className="pl-6 space-y-2">
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${record.progress}%` }}
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {record.maintenance_tasks?.filter(t => t.completed).length || 0} de {record.maintenance_tasks?.length || 0} tarefas concluídas
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
