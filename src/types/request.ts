
export interface RequestStatusType {
  id: string;
  name: string;
  label: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Request {
  id: string;
  date: string;
  item_name: string;
  category_id: string;
  quantity: number;
  status: string;
  requester: string;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
