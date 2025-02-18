
import { useState } from "react";
import { TaskItem } from "@/components/TaskItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const maintenanceTasks = [
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
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const handleToggleTask = (task: string, completed: boolean) => {
    setCompletedTasks((prev) =>
      completed
        ? [...prev, task]
        : prev.filter((t) => t !== task)
    );
  };

  const progress = (completedTasks.length / maintenanceTasks.length) * 100;

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
        </CardHeader>
        <CardContent className="space-y-4">
          {maintenanceTasks.map((task) => (
            <TaskItem
              key={task}
              task={task}
              isCompleted={completedTasks.includes(task)}
              onToggle={(completed) => handleToggleTask(task, completed)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
