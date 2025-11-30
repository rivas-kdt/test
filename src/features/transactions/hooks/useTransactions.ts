import { useEffect, useState } from "react";
import { getTransactions } from "../services/getTransactions";

export function useTransactionHooks() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await getTransactions();
      setTransactions(response);
      setLoading(false);
    } catch (error) {
      setError((error as Error).message || "Failed to fetch transactions");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
  };
}
