
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, CheckCircle2, Circle, ListTodo, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Maintenance } from "@/types/maintenance";
import { toast } from "sonner";

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: maintenances, isLoading } = useQuery({
    queryKey: ['maintenances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Erro ao carregar manutenções");
        throw error;
      }

      return data as Maintenance[];
    },
  });

  const handleCreateNew = () => {
    navigate("/manutencao/nova");
  };

  const handleViewDetails = (id: string) => {
    navigate(`/manutencao/${id}`);
  };

  // Calculate statistics
  const totalMaintenances = maintenances?.length ?? 0;
  const completedMaintenances = maintenances?.filter(record => record.status === 'completed').length ?? 0;
  const inProgressMaintenances = maintenances?.filter(record => record.status === 'in_progress').length ?? 0;

  // Filter records based on search query
  const filteredRecords = maintenances?.filter(record => 
    record.status === 'in_progress' && // Only in progress
    (record.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     record.serial_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
     record.model.toLowerCase().includes(searchQuery.toLowerCase()))
  ) ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manutenções</h1>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Manutenção
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Manutenções</CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMaintenances}</div>
              <p className="text-xs text-muted-foreground">
                Manutenções cadastradas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedMaintenances}</div>
              <p className="text-xs text-muted-foreground">
                Manutenções finalizadas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Circle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressMaintenances}</div>
              <p className="text-xs text-muted-foreground">
                Manutenções em execução
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar manutenções em andamento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <Card
              key={record.id}
              className="hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => handleViewDetails(record.id)}
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <h2 className="font-semibold">{record.client_name}</h2>
                  <div className="text-sm text-muted-foreground space-x-4">
                    <span>Série: {record.serial_number}</span>
                    <span>•</span>
                    <span>Modelo: {record.model}</span>
                    <span>•</span>
                    <span>Ano: {record.year}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{record.progress}%</div>
                    <Progress value={record.progress} className="w-24 h-2" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
