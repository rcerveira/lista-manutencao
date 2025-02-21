import { useState, useEffect } from "react";
import { TaskItem } from "@/components/TaskItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MaintenanceListModal } from "@/components/MaintenanceListModal";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MaintenanceTask } from "@/types/maintenance";

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
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [tasks, setTasks] = useState(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");
  const [maintenanceInfo, setMaintenanceInfo] = useState<MaintenanceInfo>({
    clientName: "",
    serialNumber: "",
    year: "",
    model: "",
    maintenanceDate: "",
  });
  const { toast } = useToast();

  const { data: maintenance } = useQuery({
    queryKey: ['maintenance', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data: maintenance, error } = await supabase
        .from('maintenances')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Erro ao carregar manutenção",
          description: error.message,
        });
        throw error;
      }

      setMaintenanceInfo({
        clientName: maintenance.client_name,
        serialNumber: maintenance.serial_number,
        year: maintenance.year,
        model: maintenance.model,
        maintenanceDate: maintenance.maintenance_date,
      });

      return maintenance;
    },
    enabled: !!id,
  });

  const { data: maintenanceTasks } = useQuery({
    queryKey: ['maintenance_tasks', id],
    queryFn: async () => {
      if (!id) return [];

      const { data, error } = await supabase
        .from('maintenance_tasks')
        .select('*')
        .eq('maintenance_id', id)
        .order('order_index');

      if (error) {
        toast({
          title: "Erro ao carregar tarefas",
          description: error.message,
        });
        throw error;
      }

      return data as MaintenanceTask[];
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (maintenanceTasks) {
      setTasks(maintenanceTasks.map(task => task.description));
      setCompletedTasks(maintenanceTasks.filter(task => task.completed).map(task => task.description));
    }
  }, [maintenanceTasks]);

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
      
      navigate(`/manutencao/${data.id}`);
      toast({
        title: "Manutenção criada",
        description: "Nova manutenção foi criada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar manutenção",
        description: "Ocorreu um erro ao criar a manutenção.",
      });
    },
  });

  const updateMaintenanceMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("ID não encontrado");

      const { error } = await supabase
        .from('maintenances')
        .update({
          client_name: maintenanceInfo.clientName,
          serial_number: maintenanceInfo.serialNumber,
          year: maintenanceInfo.year,
          model: maintenanceInfo.model,
          maintenance_date: maintenanceInfo.maintenanceDate,
          progress: (completedTasks.length / tasks.length) * 100,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', id] });
      toast({
        title: "Manutenção atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    },
  });

  const updateTasksMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("ID não encontrado");

      await supabase
        .from('maintenance_tasks')
        .delete()
        .eq('maintenance_id', id);

      const taskInserts = tasks.map((task, index) => ({
        maintenance_id: id,
        description: task,
        completed: completedTasks.includes(task),
        order_index: index,
      }));

      const { error } = await supabase
        .from('maintenance_tasks')
        .insert(taskInserts);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks', id] });
      toast({
        title: "Tarefas atualizadas",
        description: "As tarefas foram atualizadas com sucesso.",
      });
    },
  });

  const handleToggleTask = (task: string, completed: boolean) => {
    setCompletedTasks((prev) =>
      completed
        ? [...prev, task]
        : prev.filter((t) => t !== task)
    );
    
    if (id) {
      updateTasksMutation.mutate();
      updateMaintenanceMutation.mutate();
    }
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks((prev) => [...prev, newTask.trim()]);
      setNewTask("");
      
      if (id) {
        updateTasksMutation.mutate();
      }
      
      toast({
        title: "Tarefa adicionada",
        description: "Nova tarefa foi adicionada com sucesso.",
      });
    }
  };

  const handleDeleteTask = (taskToDelete: string) => {
    setTasks((prev) => prev.filter((task) => task !== taskToDelete));
    setCompletedTasks((prev) => prev.filter((task) => task !== taskToDelete));
    
    if (id) {
      updateTasksMutation.mutate();
      updateMaintenanceMutation.mutate();
    }
    
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
    
    if (id) {
      updateTasksMutation.mutate();
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
    
    if (id) {
      updateMaintenanceMutation.mutate();
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(dragIndex, 1);
    newTasks.splice(dropIndex, 0, draggedTask);
    setTasks(newTasks);
    
    if (id) {
      updateTasksMutation.mutate();
    }
    
    toast({
      title: "Tarefa movida",
      description: "A ordem das tarefas foi atualizada.",
    });
  };

  const handlePrintPDF = () => {
    window.print();
    toast({
      title: "Gerando PDF",
      description: "O PDF está sendo gerado para impressão.",
    });
  };

  const progress = (completedTasks.length / tasks.length) * 100;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-center text-2xl font-bold">
                Lista de Manutenção
              </CardTitle>
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="clientName" className="text-sm font-medium">
                  Nome do Cliente
                </label>
                <Input
                  id="clientName"
                  placeholder="Nome do cliente"
                  value={maintenanceInfo.clientName}
                  onChange={(e) => handleInfoChange("clientName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="serialNumber" className="text-sm font-medium">
                  Número de Série
                </label>
                <Input
                  id="serialNumber"
                  placeholder="Número de série"
                  value={maintenanceInfo.serialNumber}
                  onChange={(e) => handleInfoChange("serialNumber", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="year" className="text-sm font-medium">
                    Ano
                  </label>
                  <Input
                    id="year"
                    placeholder="Ano"
                    value={maintenanceInfo.year}
                    onChange={(e) => handleInfoChange("year", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="model" className="text-sm font-medium">
                    Modelo
                  </label>
                  <Input
                    id="model"
                    placeholder="Modelo"
                    value={maintenanceInfo.model}
                    onChange={(e) => handleInfoChange("model", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="maintenanceDate" className="text-sm font-medium">
                  Data da Manutenção
                </label>
                <Input
                  id="maintenanceDate"
                  type="month"
                  value={maintenanceInfo.maintenanceDate}
                  onChange={(e) => handleInfoChange("maintenanceDate", e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 space-y-1">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progresso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Adicionar nova tarefa..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                className="flex-1"
              />
              <Button onClick={handleAddTask}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map((task, index) => (
              <div
                key={task}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <TaskItem
                  task={task}
                  isCompleted={completedTasks.includes(task)}
                  onToggle={(completed) => handleToggleTask(task, completed)}
                  onDelete={() => handleDeleteTask(task)}
                  onEdit={(newText) => handleEditTask(task, newText)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
