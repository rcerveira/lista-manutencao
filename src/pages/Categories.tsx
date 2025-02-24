
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Category } from "@/types/request";
import { Plus, X, List, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";

export default function Categories() {
  const navigate = useNavigate();
  const [newCategory, setNewCategory] = useState("");
  const queryClient = useQueryClient();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

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
      setIsConfirmOpen(false);
      setCategoryToDelete(null);
    },
    onError: () => {
      toast.error("Erro ao remover categoria");
      setIsConfirmOpen(false);
      setCategoryToDelete(null);
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

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    deleteMutation.mutate(categoryToDelete.id);
  };

  const handleBack = () => {
    navigate("/solicitacoes");
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
    <>
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <List className="h-6 w-6" />
                Gerenciar Categorias
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
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
                    onClick={() => handleDeleteCategory(category)}
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

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
          </DialogDescription>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
