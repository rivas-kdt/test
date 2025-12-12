// src/types/inventory.ts
export interface InventoryRow {
  lot_no: string;
  product_code: string;
  stock_no: string;
  description: string;
  created_at: string;
  warehouse: string;
  quantity: number;
}

export interface WarehouseRow {
  id: string;
  warehouse: string;
  location: string;
}
