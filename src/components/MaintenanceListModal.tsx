
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ListCheck, Printer } from "lucide-react";
import { useState } from "react";

interface MaintenanceListModalProps {
  tasks: string[];
  completedTasks: string[];
  maintenanceInfo: {
    clientName: string;
    serialNumber: string;
    year: string;
    maintenanceDate: string;
  };
}

export function MaintenanceListModal({ tasks, completedTasks, maintenanceInfo }: MaintenanceListModalProps) {
  const [open, setOpen] = useState(false);

  const handlePrint = () => {
    const printContent = document.getElementById('printable-content')?.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
      <div style="padding: 20px;">
        ${printContent}
      </div>
    `;

    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ListCheck className="h-4 w-4" />
          Ver Manutenções Concluídas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Lista de Manutenção</DialogTitle>
        </DialogHeader>
        <div id="printable-content" className="mt-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cliente</p>
              <p className="text-sm">{maintenanceInfo.clientName || "Não informado"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número de Série</p>
              <p className="text-sm">{maintenanceInfo.serialNumber || "Não informado"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ano</p>
              <p className="text-sm">{maintenanceInfo.year || "Não informado"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data da Manutenção</p>
              <p className="text-sm">{maintenanceInfo.maintenanceDate || "Não informado"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Tarefas Concluídas ({completedTasks.length})</h3>
              <ul className="space-y-2">
                {tasks.filter(task => completedTasks.includes(task)).map((task) => (
                  <li key={task} className="text-sm p-2 bg-secondary rounded-lg">
                    {task}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Tarefas Pendentes ({tasks.length - completedTasks.length})</h3>
              <ul className="space-y-2">
                {tasks.filter(task => !completedTasks.includes(task)).map((task) => (
                  <li key={task} className="text-sm p-2 bg-secondary/50 rounded-lg">
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Imprimir Lista
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
