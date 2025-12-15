import { useEffect, useState } from "react";
import { getTransactions } from "../services/getTransactions";
import { Transaction } from "@/types/transaction";

export function useTransactionHooks() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return { transactions, loading, error };
}
