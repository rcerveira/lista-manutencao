
import { useState } from "react";
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

export default function Index() {
  const [tasks, setTasks] = useState(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");
  const { toast } = useToast();

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

  const progress = (completedTasks.length / tasks.length) * 100;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Lista de Manutenção
          </CardTitle>
          <div className="mt-2 space-y-1">
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
          {tasks.map((task) => (
            <TaskItem
              key={task}
              task={task}
              isCompleted={completedTasks.includes(task)}
              onToggle={(completed) => handleToggleTask(task, completed)}
              onDelete={() => handleDeleteTask(task)}
              onEdit={(newText) => handleEditTask(task, newText)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
