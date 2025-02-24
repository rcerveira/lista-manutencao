
import React, { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { MaintenanceHeader } from "@/components/maintenance/MaintenanceHeader";
import { MaintenanceFormContainer } from "@/components/maintenance/MaintenanceFormContainer";
import { useMaintenance } from "@/hooks/use-maintenance";
import { useMaintenanceTasks } from "@/hooks/maintenance/use-maintenance-tasks";

export default function ManutencaoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isEditing,
    maintenanceInfo,
    tasks: maintenanceTasks,
    completedTasks: maintenanceCompletedTasks,
    setMaintenanceInfo,
    createMaintenanceMutation,
    updateMaintenanceMutation,
    deleteMaintenanceMutation
  } = useMaintenance(id);

  const {
    tasks,
    completedTasks,
    handleToggleTask,
    handleAddTask,
    handleDeleteTask,
    handleEditTask,
    handleReorderTasks,
    setTasks,
    setCompletedTasks
  } = useMaintenanceTasks(maintenanceTasks);

  // Sincroniza as tasks quando elas são carregadas do backend
  useEffect(() => {
    if (maintenanceTasks && maintenanceCompletedTasks) {
      setTasks(maintenanceTasks);
      setCompletedTasks(maintenanceCompletedTasks);
    }
  }, [maintenanceTasks, maintenanceCompletedTasks]);

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

    if (isEditing) {
      updateMaintenanceMutation.mutate();
    } else {
      createMaintenanceMutation.mutate();
    }
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta manutenção?')) {
      deleteMaintenanceMutation.mutate();
    }
  };

  const handlePrintPDF = () => {
    window.print();
    toast({
      title: "Gerando PDF",
      description: "O PDF está sendo gerado para impressão.",
    });
  };

  const handleInfoChange = (field: keyof typeof maintenanceInfo, value: string) => {
    setMaintenanceInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const progress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <MaintenanceHeader />
        <MaintenanceFormContainer
          isEditing={isEditing}
          maintenanceInfo={maintenanceInfo}
          tasks={tasks}
          completedTasks={completedTasks}
          progress={progress}
          isSaving={createMaintenanceMutation.isPending || updateMaintenanceMutation.isPending}
          isDeleting={deleteMaintenanceMutation.isPending}
          onInfoChange={handleInfoChange}
          onSave={handleSave}
          onDelete={handleDelete}
          onPrint={handlePrintPDF}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onReorderTasks={handleReorderTasks}
        />
      </div>
    </div>
  );
}
