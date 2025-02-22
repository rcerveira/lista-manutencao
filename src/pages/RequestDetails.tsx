import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Request } from "@/types/request";
import { FileText, Calendar, Package2, Hash, User, MessageSquare, ArrowLeft, Trash2 } from "lucide-react";

export default function RequestDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isNewRequest = id === 'nova';
  
  const [formData, setFormData] = useState({
    item_name: "",
    category_id: "",
    quantity: "",
    requester: "",
    observations: "",
    date: new Date().toISOString().split('T')[0],
  });

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('item_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        toast.error("Erro ao carregar categorias");
        throw error;
      }

      return data;
    },
  });

  const { data: request } = useQuery({
    queryKey: ['request', id],
    queryFn: async () => {
      if (isNewRequest) return null;

      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          item_categories (
            name
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        toast.error("Erro ao carregar solicitação");
        throw error;
      }

      return data;
    },
    enabled: !isNewRequest,
  });

  useEffect(() => {
    if (request) {
      setFormData({
        item_name: request.item_name,
        category_id: request.category_id || "",
        quantity: request.quantity.toString(),
        requester: request.requester,
        observations: request.observations || "",
        date: request.date,
      });
    }
  }, [request]);

  const updateRequestMutation = useMutation({
    mutationFn: async () => {
      if (isNewRequest) return null;

      const { error } = await supabase
        .from('requests')
        .update({
          item_name: formData.item_name,
          category_id: formData.category_id,
          quantity: parseInt(formData.quantity),
          requester: formData.requester,
          observations: formData.observations,
          date: formData.date,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success("Solicitação atualizada com sucesso");
      navigate("/solicitacoes");
    },
    onError: () => {
      toast.error("Erro ao atualizar solicitação");
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async () => {
      if (!isNewRequest) return null;
      if (!defaultStatus) throw new Error("Status padrão não encontrado");

      const { error } = await supabase
        .from('requests')
        .insert({
          item_name: formData.item_name,
          category_id: formData.category_id,
          quantity: parseInt(formData.quantity),
          requester: formData.requester,
          observations: formData.observations,
          date: formData.date,
          status: defaultStatus.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success("Solicitação criada com sucesso");
      navigate("/solicitacoes");
    },
    onError: () => {
      toast.error("Erro ao criar solicitação");
    },
  });

  const { data: defaultStatus } = useQuery({
    queryKey: ['default-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('request_status_types')
        .select('*')
        .eq('name', 'solicitado')
        .maybeSingle();

      if (error) {
        toast.error("Erro ao carregar status padrão");
        throw error;
      }

      if (!data) {
        const { data: firstStatus, error: firstStatusError } = await supabase
          .from('request_status_types')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (firstStatusError) throw firstStatusError;
        if (!firstStatus) throw new Error("Nenhum status cadastrado");
        
        return firstStatus;
      }

      return data;
    },
  });

  const deleteRequestMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success("Solicitação excluída com sucesso");
      navigate("/solicitacoes");
    },
    onError: () => {
      toast.error("Erro ao excluir solicitação");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.item_name.trim()) {
      toast.error("Digite o nome do item");
      return;
    }
    if (!formData.category_id) {
      toast.error("Selecione uma categoria");
      return;
    }
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      toast.error("Digite uma quantidade válida");
      return;
    }
    if (!formData.requester.trim()) {
      toast.error("Digite o nome do solicitante");
      return;
    }

    if (isNewRequest) {
      if (!defaultStatus) {
        toast.error("Erro: Status padrão não encontrado");
        return;
      }
      createRequestMutation.mutate();
    } else {
      updateRequestMutation.mutate();
    }
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta solicitação?')) {
      deleteRequestMutation.mutate();
    }
  };

  const handleCancel = () => {
    navigate("/solicitacoes");
  };

  if (loadingCategories || !request && !isNewRequest) {
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
              <FileText className="h-6 w-6" />
              {isNewRequest ? "Nova Solicitação" : "Detalhes da Solicitação"}
            </CardTitle>
            <div className="flex items-center gap-2">
              {!isNewRequest && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteRequestMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Lista
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Package2 className="h-4 w-4" />
                Nome do Item
              </label>
              <Input
                placeholder="Ex: Parafuso M8"
                value={formData.item_name}
                onChange={(e) => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Quantidade
              </label>
              <Input
                type="number"
                min="1"
                placeholder="Ex: 10"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Solicitante
              </label>
              <Input
                placeholder="Seu nome"
                value={formData.requester}
                onChange={(e) => setFormData(prev => ({ ...prev, requester: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Observações
              </label>
              <Textarea
                placeholder="Observações adicionais (opcional)"
                value={formData.observations}
                onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createRequestMutation.isPending}>
                {isNewRequest ? "Criar Solicitação" : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
