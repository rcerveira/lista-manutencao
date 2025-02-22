import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Search } from "lucide-react";
import { toast } from "sonner";
import { Request } from "@/types/request";

export default function Requests() {
  const navigate = useNavigate();
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
            label
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Erro ao carregar solicitações");
        throw error;
      }

      return data as (Request & { 
        item_categories: { name: string },
        request_status_types: { label: string }
      })[];
    },
  });

  const handleCreateNew = () => {
    navigate("/solicitacao/nova");
  };

  const handleViewDetails = (id: string) => {
    navigate(`/solicitacao/${id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-4"></div>
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
        <h1 className="text-3xl font-bold">Solicitações</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Solicitação
        </Button>
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
              className="hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => handleViewDetails(record.id)}
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <h2 className="font-semibold">{record.item_name}</h2>
                  <div className="text-sm text-muted-foreground space-x-4">
                    <span>Categoria: {record.item_categories.name}</span>
                    <span>•</span>
                    <span>Quantidade: {record.quantity}</span>
                    <span>•</span>
                    <span>Solicitante: {record.requester}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {record.request_status_types.label}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
