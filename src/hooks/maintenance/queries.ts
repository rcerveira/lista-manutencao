
import { supabase } from "@/integrations/supabase/client";

export const fetchMaintenance = async (id: string) => {
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
};
