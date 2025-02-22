
export type RequestStatus = 
  | 'em_estoque'
  | 'compra_solicitada'
  | 'necessario_fazer_compra'
  | 'compra_negada'
  | 'solicitado';

export interface Request {
  id: string;
  date: string;
  item_name: string;
  category_id: string;
  quantity: number;
  status: RequestStatus;
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
