
import { MaintenanceListModal } from "@/components/MaintenanceListModal";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MaintenanceActionsProps {
  tasks: string[];
  completedTasks: string[];
  maintenanceInfo: {
    clientName: string;
    serialNumber: string;
    year: string;
    model: string;
    maintenanceDate: string;
  };
}

export function MaintenanceActions({ tasks, completedTasks, maintenanceInfo }: MaintenanceActionsProps) {
  const { toast } = useToast();

  const handlePrintPDF = () => {
    window.print();
    toast({
      title: "Gerando PDF",
      description: "O PDF está sendo gerado para impressão.",
    });
  };

  return (
    <div className="space-y-2">
      <MaintenanceListModal 
        tasks={tasks}
        completedTasks={completedTasks}
        maintenanceInfo={maintenanceInfo}
      />
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handlePrintPDF}
      >
        <Printer className="h-4 w-4 mr-2" />
        Imprimir PDF
      </Button>
    </div>
  );
}
