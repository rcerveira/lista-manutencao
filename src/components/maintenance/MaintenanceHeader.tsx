
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MaintenanceHeader() {
  const navigate = useNavigate();
  
  return (
    <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Voltar
    </Button>
  );
}
