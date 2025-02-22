import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { MaintenanceHeader } from "@/components/maintenance/MaintenanceHeader";
import { MaintenanceInfo } from "@/components/maintenance/MaintenanceInfo";
import { MaintenanceProgress } from "@/components/maintenance/MaintenanceProgress";
import { MaintenanceTaskList } from "@/components/maintenance/MaintenanceTaskList";
import { Printer } from "lucide-react";

const initialTasks = [
  "Desmontagem e Jateamento",
  "Desmontagem do queixo",
  "Silo",
  "Caixa vibratória (revisar)",
  "Cambão",
  "Patolamento",
  "Kit Mangueiras",
  "Passarela (reformar)",
  "Esteira Nova + Cavaletes",
  "Roletes carga",
  "Redutor + Ajuste eixo rolete tração",
  "Tremonha",
  "Tanque (limpeza + troca visores)",
  "Mandíbulas",
  "Recuperar abanadeira",
  "02 Canaletas Novas",
  "Escada",
  "Mola do tirante",
  "Chapa do morto",
  "Óleos (ccm fornece)",
  "Embreagem + Eixo piloto",
  "Bica",
  "Suporte do radiador",
  "02 Pé do silo",
  "Mancal Revisar",
  "Descarga (somente tubo saida)",
  "Painel Novo",
  "Motor + Polias Caixa Vibratória",
  "Caixa Bateria",
  "Usinar polia do motor",
  "Pintura",
  "Teste"
];

interface MaintenanceInfo {
  clientName: string;
  serialNumber: string;
  year: string;
  model: string;
  maintenanceDate: string;
}

export default function ManutencaoDetalhes() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [maintenanceInfo, setMaintenanceInfo] = useState<MaintenanceInfo>({
    clientName: "",
    serialNumber: "",
    year: "",
    model: "",
    maintenanceDate: "",
  });
  const { toast } = useToast();

  const createMaintenanceMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('maintenances')
        .insert([
          {
            client_name: maintenanceInfo.clientName,
            serial_number: maintenanceInfo.serialNumber,
            year: maintenanceInfo.year,
            model: maintenanceInfo.model,
            maintenance_date: maintenanceInfo.maintenanceDate,
            progress: (completedTasks.length / tasks.length) * 100,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      const taskInserts = tasks.map((task, index) => ({
        maintenance_id: data.id,
        description: task,
        completed: completedTasks.includes(task),
        order_index: index,
      }));

      await supabase.from('maintenance_tasks').insert(taskInserts);
      
      navigate('/');
      toast({
        title: "Manutenção criada",
        description: "Nova manutenção foi criada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar manutenção",
        description: "Ocorreu um erro ao criar a manutenção.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (
      !maintenanceInfo.clientName ||
      !maintenanceInfo.serialNumber ||
      !maintenanceInfo.year ||
      !maintenanceInfo.model ||
      !maintenanceInfo.maintenanceDate
    ) {
      toast({
        title: "Erro ao salvar",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    createMaintenanceMutation.mutate();
  };

  const handlePrintPDF = () => {
    window.print();
    toast({
      title: "Gerando PDF",
      description: "O PDF está sendo gerado para impressão.",
    });
  };

  const handleToggleTask = (task: string, completed: boolean) => {
    setCompletedTasks((prev) =>
      completed ? [...prev, task] : prev.filter((t) => t !== task)
    );
  };

  const handleAddTask = (task: string) => {
    setTasks((prev) => [...prev, task]);
    toast({
      title: "Tarefa adicionada",
      description: "Nova tarefa foi adicionada com sucesso.",
    });
  };

  const handleDeleteTask = (taskToDelete: string) => {
    setTasks((prev) => prev.filter((task) => task !== taskToDelete));
    setCompletedTasks((prev) => prev.filter((task) => task !== taskToDelete));
    toast({
      title: "Tarefa removida",
      description: "A tarefa foi removida com sucesso.",
    });
  };

  const handleEditTask = (oldTask: string, newText: string) => {
    setTasks((prev) =>
      prev.map((task) => (task === oldTask ? newText : task))
    );
    if (completedTasks.includes(oldTask)) {
      setCompletedTasks((prev) =>
        prev.map((task) => (task === oldTask ? newText : task))
      );
    }
    toast({
      title: "Tarefa atualizada",
      description: "A tarefa foi atualizada com sucesso.",
    });
  };

  const handleInfoChange = (field: keyof MaintenanceInfo, value: string) => {
    setMaintenanceInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReorderTasks = (dragIndex: number, dropIndex: number) => {
    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(dragIndex, 1);
    newTasks.splice(dropIndex, 0, draggedTask);
    setTasks(newTasks);
    toast({
      title: "Tarefa movida",
      description: "A ordem das tarefas foi atualizada.",
    });
  };

  const progress = (completedTasks.length / tasks.length) * 100;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <MaintenanceHeader />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-center text-2xl font-bold">
                Nova Manutenção
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handlePrintPDF}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir PDF
                </Button>
                <Button onClick={handleSave} disabled={createMaintenanceMutation.isPending}>
                  {createMaintenanceMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
            
            <MaintenanceInfo 
              maintenanceInfo={maintenanceInfo}
              onInfoChange={handleInfoChange}
            />
            
            <MaintenanceProgress progress={progress} />
            
            <MaintenanceTaskList
              tasks={tasks}
              completedTasks={completedTasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              onReorderTasks={handleReorderTasks}
            />
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
