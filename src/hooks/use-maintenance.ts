
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MaintenanceInfo, initialMaintenanceInfo } from "./maintenance/types";
import { createMaintenance, updateMaintenance, deleteMaintenance } from "./maintenance/mutations";
import { fetchMaintenance } from "./maintenance/queries";

export type { MaintenanceInfo };

export function useMaintenance(id?: string) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [tasks, setTasks] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [maintenanceInfo, setMaintenanceInfo] = useState<MaintenanceInfo>(initialMaintenanceInfo);

  const { data: maintenanceData } = useQuery({
    queryKey: ['maintenance', id],
    queryFn: () => fetchMaintenance(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (maintenanceData?.maintenance) {
      setMaintenanceInfo({
        clientName: maintenanceData.maintenance.client_name,
        serialNumber: maintenanceData.maintenance.serial_number,
        year: maintenanceData.maintenance.year,
        model: maintenanceData.maintenance.model,
        maintenanceDate: maintenanceData.maintenance.maintenance_date,
      });

      if (maintenanceData.tasks) {
        setTasks(maintenanceData.tasks.map(t => t.description));
        setCompletedTasks(maintenanceData.tasks.filter(t => t.completed).map(t => t.description));
      }
    } else if (!isEditing) {
      setMaintenanceInfo(initialMaintenanceInfo);
      setTasks([]);
      setCompletedTasks([]);
    }
  }, [maintenanceData, isEditing]);

  useEffect(() => {
    if (isEditing && maintenanceData?.maintenance) {
      updateMaintenanceMutation.mutate();
    }
  }, [tasks, completedTasks]);

  const createMaintenanceMutation = useMutation({
    mutationFn: () => createMaintenance(maintenanceInfo, tasks, completedTasks),
    onSuccess: () => {
      navigate('/');
      toast({
        title: "Manutenção criada",
        description: "Nova manutenção foi criada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar:', error);
      toast({
        title: "Erro ao criar manutenção",
        description: "Ocorreu um erro ao criar a manutenção.",
        variant: "destructive",
      });
    },
  });

  const updateMaintenanceMutation = useMutation({
    mutationFn: () => updateMaintenance(id!, maintenanceInfo, tasks, completedTasks),
    onSuccess: () => {
      toast({
        title: "Alterações salvas",
        description: "As alterações foram salvas automaticamente.",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar:', error);
      toast({
        title: "Erro ao salvar alterações",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive",
      });
    },
  });

  const deleteMaintenanceMutation = useMutation({
    mutationFn: () => deleteMaintenance(id!),
    onSuccess: () => {
      navigate('/');
      toast({
        title: "Manutenção excluída",
        description: "A manutenção foi excluída com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir a manutenção.",
        variant: "destructive",
      });
    },
  });

  return {
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
  };
}
