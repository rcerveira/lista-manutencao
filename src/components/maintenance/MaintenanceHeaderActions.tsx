
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
    <div className="flex items-center gap-2">
      {isEditing && (
        <Button
          variant="destructive"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? "Excluindo..." : "Excluir"}
        </Button>
      )}
      <Button variant="outline" onClick={onPrint}>
        <Printer className="h-4 w-4 mr-2" />
        Imprimir PDF
      </Button>
      <Button onClick={onSave} disabled={isSaving}>
        {isSaving ? "Salvando..." : "Salvar"}
      </Button>
    </div>
  );
}
