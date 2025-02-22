
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Category } from "@/types/request";
import { Plus, X, List } from "lucide-react";

export default function Categories() {
  const [newCategory, setNewCategory] = useState("");
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
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

      return data as Category[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .from('item_categories')
        .insert([{ name }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Categoria criada com sucesso");
      setNewCategory("");
    },
    onError: () => {
      toast.error("Erro ao criar categoria");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('item_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Categoria removida com sucesso");
    },
    onError: () => {
      toast.error("Erro ao remover categoria");
    },
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      toast.error("Digite o nome da categoria");
      return;
    }
    createMutation.mutate(newCategory.trim());
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
          <CardTitle className="flex items-center gap-2">
            <List className="h-6 w-6" />
            Gerenciar Categorias
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleCreateCategory} className="flex gap-2">
            <Input
              placeholder="Nome da nova categoria..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={createMutation.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </form>

          <div className="grid gap-2">
            {categories?.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
              >
                <span>{category.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(category.id)}
                  disabled={deleteMutation.isPending}
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
