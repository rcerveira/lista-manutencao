
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Request } from "@/types/request";

export default function RequestDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNewRequest = id === 'nova';

  const { data: request, isLoading } = useQuery({
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
        .single();

      if (error) {
        toast.error("Erro ao carregar solicitação");
        throw error;
      }

      return data as Request & { item_categories: { name: string } };
    },
    enabled: !isNewRequest,
  });

  useEffect(() => {
    // Temporary placeholder - will implement full form in next iteration
    toast.info("Página em desenvolvimento");
  }, []);

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
          <CardTitle>
            {isNewRequest ? "Nova Solicitação" : "Detalhes da Solicitação"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Formulário em desenvolvimento. Em breve você poderá{" "}
            {isNewRequest ? "criar novas solicitações" : "ver os detalhes da solicitação"}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
