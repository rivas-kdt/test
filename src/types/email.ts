export interface TransactionData {
  warehouse: string;
  status: string;
  productCode: string;
  stockNo: string;
  lotNo: string;
  description: string;
  quantity: number;
}

export interface EmailTemplateProps {
  firstName: string;
  transactionData: TransactionData[];
  isMultipleEntries: boolean;
}

export type Transaction = {
  id: string;
  lot_no: string;
  quantity: number;
  warehouse: string;
  status: "Shipped" | "Stocked" | string;
  created_at: string;
  product_code: string;
  stock_no: string;
  description: string;
};
