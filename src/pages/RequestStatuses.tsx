
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ListChecks, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { RequestStatusType } from "@/types/request";

export default function RequestStatuses() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState("");

  const { data: statuses, isLoading } = useQuery({
    queryKey: ['request-statuses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('request_status_types')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        toast.error("Erro ao carregar status");
        throw error;
      }

      return data as RequestStatusType[];
    },
  });

  const createStatusMutation = useMutation({
    mutationFn: async (data: { name: string; label: string; color: string }) => {
      const { error } = await supabase
        .from('request_status_types')
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['request-statuses'] });
      toast.success("Status criado com sucesso");
      setNewStatus("");
    },
    onError: () => {
      toast.error("Erro ao criar status");
    },
  });

  const deleteStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('request_status_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['request-statuses'] });
      toast.success("Status removido com sucesso");
    },
    onError: () => {
      toast.error("Erro ao remover status");
    },
  });

  const handleBack = () => {
    navigate("/solicitacoes");
  };

  const handleCreateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus.trim()) {
      toast.error("Digite o nome do status");
      return;
    }

    const statusData = {
      name: newStatus.toLowerCase().replace(/\s+/g, '_'),
      label: newStatus,
      color: 'bg-gray-100 text-gray-700', // Default color for new statuses
    };

    createStatusMutation.mutate(statusData);
  };

  const handleDeleteStatus = async (status: RequestStatusType) => {
    // Check if the status is being used by any requests
    const { count, error } = await supabase
      .from('requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', status.id);

    if (error) {
      toast.error("Erro ao verificar uso do status");
      return;
    }

    if (count && count > 0) {
      toast.error("Não é possível remover um status que está em uso");
      return;
    }

    deleteStatusMutation.mutate(status.id);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-6 w-6" />
              Gerenciar Status
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleCreateStatus} className="flex gap-2">
            <Input
              placeholder="Nome do novo status..."
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={createStatusMutation.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </form>

          <div className="grid gap-3">
            {statuses?.map((status) => (
              <div
                key={status.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-md text-sm font-medium ${status.color}`}>
                    {status.label}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteStatus(status)}
                  disabled={deleteStatusMutation.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
