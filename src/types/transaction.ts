export interface Transaction {
  id?: string; // mobile uses ID, desktop doesn't — optional
  lot_no: string;
  stock_no?: string;
  description?: string;
  quantity: number;
  warehouse: string;
  warehouse_id: string;
  status: string;
  created_at?: string;
  date?: string;
  imgUrl?: string | null;
}
