
import { Calendar, Hash, MessageSquare, Package2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/request";

interface RequestFormProps {
  formData: {
    item_name: string;
    category_id: string;
    quantity: string;
    requester: string;
    observations: string;
    date: string;
  };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  categories?: Category[];
  isNewRequest: boolean;
  isSubmitting: boolean;
}

export function RequestForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  categories,
  isNewRequest,
  isSubmitting
}: RequestFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
          <SelectTrigger className="w-full">
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

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isNewRequest ? "Criar Solicitação" : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
