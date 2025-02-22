
import { Button } from "@/components/ui/button";
import { Printer, Trash2 } from "lucide-react";

interface MaintenanceHeaderActionsProps {
  isEditing: boolean;
  onPrint: () => void;
  onSave: () => void;
  onDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
}

export function MaintenanceHeaderActions({
  isEditing,
  onPrint,
  onSave,
  onDelete,
  isSaving,
  isDeleting
}: MaintenanceHeaderActionsProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button 
        variant="outline" 
        onClick={onPrint}
        className="w-full sm:w-auto order-2 sm:order-1"
      >
        <Printer className="h-4 w-4 mr-2" />
        Imprimir PDF
      </Button>
      
      {isEditing && (
        <Button
          variant="destructive"
          onClick={onDelete}
          disabled={isDeleting}
          className="w-full sm:w-auto order-3 sm:order-2"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? "Excluindo..." : "Excluir"}
        </Button>
      )}
      
      <Button 
        onClick={onSave} 
        disabled={isSaving}
        className="w-full sm:w-auto order-1 sm:order-3"
      >
        {isSaving ? "Salvando..." : "Salvar"}
      </Button>
    </div>
  );
}
