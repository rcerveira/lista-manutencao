
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Trash2 } from "lucide-react";

interface RequestHeaderProps {
  isNewRequest: boolean;
  id?: string;
  onCancel: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function RequestHeader({ isNewRequest, id, onCancel, onDelete, isDeleting }: RequestHeaderProps) {
  return (
    <CardHeader>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Lista
          </Button>
          {!isNewRequest && id && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          )}
        </div>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          {isNewRequest ? "Nova Solicitação" : "Detalhes da Solicitação"}
        </CardTitle>
      </div>
    </CardHeader>
  );
}
