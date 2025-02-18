
import { useState, useEffect } from "react";
import { TaskItem } from "@/components/TaskItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  maintenanceDate: string;
}

export default function Index() {
  const [tasks, setTasks] = useState(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");
  const [maintenanceInfo, setMaintenanceInfo] = useState<MaintenanceInfo>({
    clientName: "",
    serialNumber: "",
    year: "",
    maintenanceDate: "",
  });
  const { toast } = useToast();

  // Effect to sort tasks whenever completedTasks changes
  useEffect(() => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const aCompleted = completedTasks.includes(a);
      const bCompleted = completedTasks.includes(b);
      if (aCompleted === bCompleted) return 0;
      return aCompleted ? 1 : -1;
    });
    setTasks(sortedTasks);
  }, [completedTasks]);

  const handleToggleTask = (task: string, completed: boolean) => {
    setCompletedTasks((prev) =>
      completed
        ? [...prev, task]
        : prev.filter((t) => t !== task)
    );
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks((prev) => [...prev, newTask.trim()]);
      setNewTask("");
      toast({
        title: "Tarefa adicionada",
        description: "Nova tarefa foi adicionada com sucesso.",
      });
    }
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
    
    toast({
      title: "Tarefa movida",
      description: "A ordem das tarefas foi atualizada.",
    });
  };

  const progress = (completedTasks.length / tasks.length) * 100;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Lista de Manutenção
          </CardTitle>
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
              <label htmlFor="maintenanceDate" className="text-sm font-medium">
                Data da Manutenção
              </label>
              <Input
                id="maintenanceDate"
                type="date"
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
  );
}
