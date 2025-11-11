/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { getMonthlyTransaction } from "../services/getMonthlyInventory";

export function useTransaction() {
  const [monthly, setMonthly] = useState<any>(null);
  const [transactionLoading, setTLoading] = useState(true);
  const [monthlyError, setMonthlyError] = useState<string | null>(null);
  useEffect(() => {
    fetchMonthlyInventory();
  }, []);

  const fetchMonthlyInventory = async () => {
    setTLoading(true);
    try {
      const response = await getMonthlyTransaction();
      setMonthly(response);
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      setMonthlyError(error.message || "Failed to fetch overview data");
    } finally {
      setTLoading(false);
    }
  };

  return {
    transactionLoading,
    monthly,
    monthlyError,
    refetchMonthlyInventory: fetchMonthlyInventory,
  };
}
