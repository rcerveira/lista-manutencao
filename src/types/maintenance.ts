
export interface Maintenance {
  id: string;
  client_name: string;
  serial_number: string;
  model: string;
  year: string;
  maintenance_date: string;
  progress: number;
  status: 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface MaintenanceTask {
  id: string;
  maintenance_id: string;
  description: string;
  completed: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}
