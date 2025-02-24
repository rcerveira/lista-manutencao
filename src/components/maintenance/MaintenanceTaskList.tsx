
import { TaskItem } from "@/components/TaskItem";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface MaintenanceTaskListProps {
  tasks: string[];
  completedTasks: string[];
  onAddTask: (task: string) => void;
  onToggleTask: (task: string, completed: boolean) => void;
  onDeleteTask: (task: string) => void;
  onEditTask: (oldTask: string, newTask: string) => void;
  onReorderTasks: (dragIndex: number, dropIndex: number) => void;
}

export function MaintenanceTaskList({
  tasks,
  completedTasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onReorderTasks,
}: MaintenanceTaskListProps) {
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim()) {
      onAddTask(newTask.trim());
      setNewTask("");
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
    onReorderTasks(dragIndex, dropIndex);
  };

  return (
    <>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Adicionar nova tarefa..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          className="flex-1"
        />
        <Button 
          onClick={handleAddTask}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
      <div className="space-y-4 mt-4">
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
              onToggle={(completed) => onToggleTask(task, completed)}
              onDelete={() => onDeleteTask(task)}
              onEdit={(newText) => onEditTask(task, newText)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
