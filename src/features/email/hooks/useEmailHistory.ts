"use client";

import { useEffect, useState, useCallback } from "react";
import { getHistory } from "../services/getHistory";

export type TransactionHistory = {
  lot_no: string;
  stock_no: string;
  description: string;
  product_code: string;
  status: string;
  quantity: number;
};

export type EmailTransaction = {
  email_id: string;
  date: string;
  email_transaction: TransactionHistory[];
};

export function useEmailHistory() {
  const [data, setData] = useState<EmailTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const rows = await getHistory(); // server action call

      // transform rows → grouped email blocks
      const grouped: Record<string, EmailTransaction> = {};

      rows.forEach((row: any) => {
        if (!grouped[row.id]) {
          grouped[row.id] = {
            email_id: row.id,
            date: row.created_at,
            email_transaction: [],
          };
        }

        grouped[row.id].email_transaction.push({
          lot_no: row.lot_no,
          stock_no: row.stock_no,
          description: row.description,
          product_code: row.product_code,
          status: row.status,
          quantity: row.quantity,
        });
      });

      setData(Object.values(grouped));
    } catch (err: any) {
      setError(err.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { data, loading, error, refetch: fetchHistory };
}
