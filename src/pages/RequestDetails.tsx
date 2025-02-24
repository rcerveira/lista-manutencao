
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRequestForm } from "@/hooks/useRequestForm";
import { RequestHeader } from "@/components/request/RequestHeader";
import { RequestForm } from "@/components/request/RequestForm";

export default function RequestDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

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
      if (id === 'nova') return null;

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
    enabled: Boolean(id),
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

  const {
    formData,
    setFormData,
    updateRequestMutation,
    createRequestMutation,
    deleteRequestMutation,
    isNewRequest
  } = useRequestForm(id, request);

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
      createRequestMutation.mutate(defaultStatus.id);
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

  if (loadingCategories || (!request && !isNewRequest)) {
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
        <RequestHeader
          isNewRequest={isNewRequest}
          id={id}
          onCancel={handleCancel}
          onDelete={handleDelete}
          isDeleting={deleteRequestMutation.isPending}
        />
        <CardContent>
          <RequestForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            categories={categories}
            isNewRequest={isNewRequest}
            isSubmitting={createRequestMutation.isPending || updateRequestMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
