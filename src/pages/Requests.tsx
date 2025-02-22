
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ArrowRight, Search, ListChecks, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Request, RequestStatusType } from "@/types/request";

export default function Requests() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          item_categories (
            name
          ),
          request_status_types (
            id,
            label,
            color
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Erro ao carregar solicitações");
        throw error;
      }

      return data as (Request & { 
        item_categories: { name: string },
        request_status_types: { id: string; label: string; color: string }
      })[];
    },
  });

  const { data: statusTypes } = useQuery({
    queryKey: ['status-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('request_status_types')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        toast.error("Erro ao carregar tipos de status");
        throw error;
      }

      return data as RequestStatusType[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ requestId, statusId }: { requestId: string; statusId: string }) => {
      const { error } = await supabase
        .from('requests')
        .update({ status: statusId })
        .eq('id', requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success("Status atualizado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar status");
    },
  });

  const handleCreateNew = () => {
    navigate("/solicitacao/nova");
  };

  const handleViewDetails = (id: string) => {
    navigate(`/solicitacao/${id}`);
  };

  const handleManageCategories = () => {
    navigate("/categorias");
  };

  const handleManageStatuses = () => {
    navigate("/status");
  };

  const handleUpdateStatus = (requestId: string, statusId: string) => {
    updateStatusMutation.mutate({ requestId, statusId });
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
          <Button variant="outline" size="sm" onClick={handleBackToHome}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Solicitações</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button 
            variant="outline" 
            onClick={handleManageCategories}
            className="w-full sm:w-auto"
          >
            Gerenciar Categorias
          </Button>
          <Button 
            variant="outline" 
            onClick={handleManageStatuses}
            className="w-full sm:w-auto"
          >
            <ListChecks className="h-4 w-4 mr-2" />
            Gerenciar Status
          </Button>
          <Button 
            onClick={handleCreateNew}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Solicitação
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar solicitações..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="grid gap-4">
        {requests
          ?.filter(
            (record) =>
              record.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              record.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
              record.item_categories.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((record) => (
            <Card
              key={record.id}
              className="hover:bg-accent/50 transition-colors"
            >
              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                <div 
                  className="space-y-1 flex-1 cursor-pointer w-full"
                  onClick={() => handleViewDetails(record.id)}
                >
                  <h2 className="font-semibold">{record.item_name}</h2>
                  <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span>Categoria: {record.item_categories.name}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Quantidade: {record.quantity}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Solicitante: {record.requester}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Select
                    value={record.status}
                    onValueChange={(value) => handleUpdateStatus(record.id, value)}
                  >
                    <SelectTrigger className={`${record.request_status_types.color} w-full sm:w-[180px]`}>
                      <SelectValue>{record.request_status_types.label}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statusTypes?.map((status) => (
                        <SelectItem
                          key={status.id}
                          value={status.id}
                          className={status.color}
                        >
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
