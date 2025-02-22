
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

export function useMaintenance(id?: string) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [tasks, setTasks] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [maintenanceInfo, setMaintenanceInfo] = useState<MaintenanceInfo>({
    clientName: "",
    serialNumber: "",
    year: "",
    model: "",
    maintenanceDate: "",
  });

  const { data: maintenanceData } = useQuery({
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
    }

    if (maintenanceData?.tasks) {
      setTasks(maintenanceData.tasks.map(t => t.description));
      setCompletedTasks(maintenanceData.tasks.filter(t => t.completed).map(t => t.description));
    }
  }, [maintenanceData]);

  const createMaintenanceMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('maintenances')
        .insert([
          {
            client_name: maintenanceInfo.clientName,
            serial_number: maintenanceInfo.serialNumber,
            year: maintenanceInfo.year,
            model: maintenanceInfo.model,
            maintenance_date: maintenanceInfo.maintenanceDate,
            progress: (completedTasks.length / tasks.length) * 100,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      const taskInserts = tasks.map((task, index) => ({
        maintenance_id: data.id,
        description: task,
        completed: completedTasks.includes(task),
        order_index: index,
      }));

      await supabase.from('maintenance_tasks').insert(taskInserts);
      
      navigate('/');
      toast({
        title: "Manutenção criada",
        description: "Nova manutenção foi criada com sucesso.",
      });
    },
    onError: () => {
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

      const { error: maintenanceError } = await supabase
        .from('maintenances')
        .update({
          client_name: maintenanceInfo.clientName,
          serial_number: maintenanceInfo.serialNumber,
          year: maintenanceInfo.year,
          model: maintenanceInfo.model,
          maintenance_date: maintenanceInfo.maintenanceDate,
          progress: (completedTasks.length / tasks.length) * 100,
        })
        .eq('id', id);

      if (maintenanceError) throw maintenanceError;

      const { error: deleteError } = await supabase
        .from('maintenance_tasks')
        .delete()
        .eq('maintenance_id', id);

      if (deleteError) throw deleteError;

      const { error: tasksError } = await supabase
        .from('maintenance_tasks')
        .insert(
          tasks.map((task, index) => ({
            maintenance_id: id,
            description: task,
            completed: completedTasks.includes(task),
            order_index: index,
          }))
        );

      if (tasksError) throw tasksError;
    },
    onSuccess: () => {
      navigate('/');
      toast({
        title: "Manutenção atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar a manutenção.",
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
