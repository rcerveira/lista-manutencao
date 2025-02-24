
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Request } from "@/types/request";

interface FormData {
  item_name: string;
  category_id: string;
  quantity: string;
  requester: string;
  observations: string;
  date: string;
}

export function useRequestForm(id: string | undefined, request: Request | null) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNewRequest = !id || id === 'nova';

  const [formData, setFormData] = useState<FormData>({
    item_name: "",
    category_id: "",
    quantity: "",
    requester: "",
    observations: "",
    date: new Date().toISOString().split('T')[0],
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
    mutationFn: async (defaultStatusId: string) => {
      if (!isNewRequest) return null;

      const { error } = await supabase
        .from('requests')
        .insert({
          item_name: formData.item_name,
          category_id: formData.category_id,
          quantity: parseInt(formData.quantity),
          requester: formData.requester,
          observations: formData.observations,
          date: formData.date,
          status: defaultStatusId
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

  return {
    formData,
    setFormData,
    updateRequestMutation,
    createRequestMutation,
    deleteRequestMutation,
    isNewRequest
  };
}
