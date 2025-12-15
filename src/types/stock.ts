export interface ScannedItem {
  id: string;
  lotNo: string;
  productCode: string;
  stockNo: string;
  description: string;
  quantity: number;
}

export interface ReceiptUploadResult {
  base64?: string;
  file: File | null;
  url?: string;
}

export interface StockItemPayload {
  lotNo: string;
  stockNo: string;
  productCode: string;
  description: string;
  quantity: number;
  warehouseId: string;
  receiptUrl: string;
}
