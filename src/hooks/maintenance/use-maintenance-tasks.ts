
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export function useMaintenanceTasks(initialTasks: string[] = []) {
  const [tasks, setTasks] = useState<string[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

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

  const handleReorderTasks = (dragIndex: number, dropIndex: number) => {
    setTasks(prev => {
      const newTasks = [...prev];
      const [draggedTask] = newTasks.splice(dragIndex, 1);
      newTasks.splice(dropIndex, 0, draggedTask);
      return newTasks;
    });
    toast({
      title: "Tarefa movida",
      description: "A ordem das tarefas foi atualizada.",
    });
  };

  return {
    tasks,
    setTasks,
    completedTasks,
    setCompletedTasks,
    handleToggleTask,
    handleAddTask,
    handleDeleteTask,
    handleEditTask,
    handleReorderTasks
  };
}
