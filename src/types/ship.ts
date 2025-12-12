// src/types/ship.ts

export interface StockedPart {
  lot_no: string;
  product_code: string;
  stock_no: string;
  description: string;
  quantity: number;
  added?: boolean;
  selected?: boolean;
  ship_quantity?: number | "";
}

export interface ShipScanResult {
  lot_no: string;
}

export interface ShipHookConfig {
  t: (key: string, opts?: any) => string;
  setScanning: (value: boolean) => void;
  setHighlightedItem: (lotNo: string | null) => void;
}
