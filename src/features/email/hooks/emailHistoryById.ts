"use client";

import { useEffect, useState, useCallback } from "react";
import { getHistory as getHistoryById } from "../services/getHistoryById";

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

export function useEmailHistoryById(id: string) {
  const [data, setData] = useState<EmailTransaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSingle = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const rows = await getHistoryById(id); // server action call

      if (!rows.length) {
        setData(null);
        return;
      }

      const block: EmailTransaction = {
        email_id: rows[0].id,
        date: rows[0].created_at,
        email_transaction: rows.map((row: any) => ({
          lot_no: row.lot_no,
          stock_no: row.stock_no,
          description: row.description,
          product_code: row.product_code,
          status: row.status,
          quantity: row.quantity,
        })),
      };

      setData(block);
    } catch (err: any) {
      setError(err.message || "Failed to load transaction");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSingle();
  }, [fetchSingle]);

  return { data, loading, error, refetch: fetchSingle };
}
