
import { supabase } from "@/integrations/supabase/client";
import { MaintenanceInfo } from "./types";
import { toast } from "@/components/ui/use-toast";

export const createMaintenance = async (
  maintenanceInfo: MaintenanceInfo,
  tasks: string[],
  completedTasks: string[]
) => {
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
        progress: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
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
};

export const updateMaintenance = async (
  id: string,
  maintenanceInfo: MaintenanceInfo,
  tasks: string[],
  completedTasks: string[]
) => {
  const formattedDate = maintenanceInfo.maintenanceDate.split('-').slice(0, 2).join('-') + '-01';

  const { error: maintenanceError } = await supabase
    .from('maintenances')
    .update({
      client_name: maintenanceInfo.clientName,
      serial_number: maintenanceInfo.serialNumber,
      year: maintenanceInfo.year,
      model: maintenanceInfo.model,
      maintenance_date: formattedDate,
      progress: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
    })
    .eq('id', id);

  if (maintenanceError) throw maintenanceError;

  const { error: deleteError } = await supabase
    .from('maintenance_tasks')
    .delete()
    .eq('maintenance_id', id);

  if (deleteError) throw deleteError;

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
};

export const deleteMaintenance = async (id: string) => {
  const { error } = await supabase
    .from('maintenances')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
