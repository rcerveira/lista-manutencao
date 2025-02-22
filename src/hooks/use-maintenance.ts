
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface MaintenanceInfo {
  clientName: string;
  serialNumber: string;
  year: string;
  model: string;
  maintenanceDate: string;
}

const initialMaintenanceInfo: MaintenanceInfo = {
  clientName: "",
  serialNumber: "",
  year: "",
  model: "",
  maintenanceDate: "",
};

export function useMaintenance(id?: string) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [tasks, setTasks] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [maintenanceInfo, setMaintenanceInfo] = useState<MaintenanceInfo>(initialMaintenanceInfo);

  const { data: maintenanceData, refetch } = useQuery({
    queryKey: ['maintenance', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data: maintenance } = await supabase
        .from('maintenances')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      const { data: maintenanceTasks } = await supabase
        .from('maintenance_tasks')
        .select('*')
        .eq('maintenance_id', id)
        .order('order_index');

      return { maintenance, tasks: maintenanceTasks };
    },
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

  // Efeito para auto-salvar quando as tarefas são modificadas
  useEffect(() => {
    if (isEditing && maintenanceData?.maintenance) {
      updateMaintenanceMutation.mutate();
    }
  }, [tasks, completedTasks]);

  const createMaintenanceMutation = useMutation({
    mutationFn: async () => {
      const formattedDate = maintenanceInfo.maintenanceDate.split('-').slice(0, 2).join('-') + '-01';

      const { data, error } = await supabase
        .from('maintenances')
        .insert([
          {
            client_name: maintenanceInfo.clientName,
            serial_number: maintenanceInfo.serialNumber,
            year: maintenanceInfo.year,
            model: maintenanceInfo.model,
            maintenance_date: formattedDate,
            progress: tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (tasks.length > 0) {
        const taskInserts = tasks.map((task, index) => ({
          maintenance_id: data.id,
          description: task,
          completed: completedTasks.includes(task),
          order_index: index,
        }));

        const { error: tasksError } = await supabase
          .from('maintenance_tasks')
          .insert(taskInserts);

        if (tasksError) throw tasksError;
      }

      return data;
    },
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
    mutationFn: async () => {
      if (!id) throw new Error('ID não encontrado');

      const formattedDate = maintenanceInfo.maintenanceDate.split('-').slice(0, 2).join('-') + '-01';

      // Atualiza os dados principais da manutenção
      const { error: maintenanceError } = await supabase
        .from('maintenances')
        .update({
          client_name: maintenanceInfo.clientName,
          serial_number: maintenanceInfo.serialNumber,
          year: maintenanceInfo.year,
          model: maintenanceInfo.model,
          maintenance_date: formattedDate,
          progress: tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0,
        })
        .eq('id', id);

      if (maintenanceError) throw maintenanceError;

      // Remove todas as tarefas antigas
      const { error: deleteError } = await supabase
        .from('maintenance_tasks')
        .delete()
        .eq('maintenance_id', id);

      if (deleteError) throw deleteError;

      // Insere todas as tarefas atualizadas
      if (tasks.length > 0) {
        const taskInserts = tasks.map((task, index) => ({
          maintenance_id: id,
          description: task,
          completed: completedTasks.includes(task),
          order_index: index,
        }));

        const { error: tasksError } = await supabase
          .from('maintenance_tasks')
          .insert(taskInserts);

        if (tasksError) throw tasksError;
      }
    },
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
    mutationFn: async () => {
      if (!id) throw new Error('ID não encontrado');

      const { error } = await supabase
        .from('maintenances')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
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
