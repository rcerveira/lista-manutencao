import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";
import { MaintenanceHeader } from "@/components/maintenance/MaintenanceHeader";
import { MaintenanceInfo } from "@/components/maintenance/MaintenanceInfo";
import { MaintenanceProgress } from "@/components/maintenance/MaintenanceProgress";
import { MaintenanceTaskList } from "@/components/maintenance/MaintenanceTaskList";
import { MaintenanceHeaderActions } from "@/components/maintenance/MaintenanceHeaderActions";
import { useMaintenance } from "@/hooks/use-maintenance";
import type { MaintenanceInfo as MaintenanceInfoType } from "@/hooks/use-maintenance";
import { useNavigate } from "react-router-dom";

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

export default function ManutencaoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isEditing,
    maintenanceInfo,
    tasks,
    completedTasks,
    setMaintenanceInfo,
    setTasks,
    setCompletedTasks,
    createMaintenanceMutation,
    updateMaintenanceMutation,
    deleteMaintenanceMutation
  } = useMaintenance(id);

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

  const handleInfoChange = (field: keyof MaintenanceInfoType, value: string) => {
    setMaintenanceInfo(prev => ({
      ...prev,
      [field]: value
    }));
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

  const handleCancel = () => {
    navigate("/manutencoes");
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
                {isEditing ? 'Editar Manutenção' : 'Nova Manutenção'}
              </CardTitle>
              <MaintenanceHeaderActions
                isEditing={isEditing}
                onPrint={handlePrintPDF}
                onSave={handleSave}
                onDelete={handleDelete}
                isSaving={createMaintenanceMutation.isPending || updateMaintenanceMutation.isPending}
                isDeleting={deleteMaintenanceMutation.isPending}
              />
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
