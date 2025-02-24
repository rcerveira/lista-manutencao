
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MaintenanceHeaderActions } from "./MaintenanceHeaderActions";
import { MaintenanceInfo } from "./MaintenanceInfo";
import { MaintenanceProgress } from "./MaintenanceProgress";
import { MaintenanceTaskList } from "./MaintenanceTaskList";
import type { MaintenanceInfo as MaintenanceInfoType } from "@/hooks/use-maintenance";

interface MaintenanceFormContainerProps {
  isEditing: boolean;
  maintenanceInfo: MaintenanceInfoType;
  tasks: string[];
  completedTasks: string[];
  progress: number;
  isSaving: boolean;
  isDeleting: boolean;
  onInfoChange: (field: keyof MaintenanceInfoType, value: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onPrint: () => void;
  onAddTask: (task: string) => void;
  onToggleTask: (task: string, completed: boolean) => void;
  onDeleteTask: (task: string) => void;
  onEditTask: (oldTask: string, newText: string) => void;
  onReorderTasks: (dragIndex: number, dropIndex: number) => void;
}

export function MaintenanceFormContainer({
  isEditing,
  maintenanceInfo,
  tasks,
  completedTasks,
  progress,
  isSaving,
  isDeleting,
  onInfoChange,
  onSave,
  onDelete,
  onPrint,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onReorderTasks,
}: MaintenanceFormContainerProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-center text-2xl font-bold">
            {isEditing ? 'Editar Manutenção' : 'Nova Manutenção'}
          </CardTitle>
          <MaintenanceHeaderActions
            isEditing={isEditing}
            onPrint={onPrint}
            onSave={onSave}
            onDelete={onDelete}
            isSaving={isSaving}
            isDeleting={isDeleting}
          />
        </div>
        
        <MaintenanceInfo 
          maintenanceInfo={maintenanceInfo}
          onInfoChange={onInfoChange}
        />
        
        <MaintenanceProgress progress={progress} />
        
        <MaintenanceTaskList
          tasks={tasks}
          completedTasks={completedTasks}
          onAddTask={onAddTask}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onReorderTasks={onReorderTasks}
        />
      </CardHeader>
    </Card>
  );
}
