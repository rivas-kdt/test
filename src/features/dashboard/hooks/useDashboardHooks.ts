/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { getMonthlyTransaction } from "../services/getMonthlyInventory";
import { getTotal } from "../services/getTotal";

export function useTransaction() {
  const [monthly, setMonthly] = useState<any>(null);
  const [transactionLoading, setTLoading] = useState(true);
  const [monthlyError, setMonthlyError] = useState<string | null>(null);
  const [total, setTotal] = useState<any>(null);
  const [totalPctChange, setTotalPctChange] = useState();
  const [totalLoading, setTotalLoading] = useState(true);
  const [totalError, setTotalError] = useState(null);

  useEffect(() => {
    fetchMonthlyInventory();
    fetchTotal();
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

  const fetchTotal = async () => {
    setTotalLoading(true);
    try {
      const response = await getTotal();
      setTotal(response.current_total);
      setTotalPctChange(response.percentage_change);
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      setTotalError(error.message || "Failed to fetch overview data");
    } finally {
      setTotalLoading(false);
    }
  };

  return {
    transactionLoading,
    monthly,
    monthlyError,
    refetchMonthlyInventory: fetchMonthlyInventory,
    total,
    totalPctChange,
    totalLoading,
    totalError,
    refetchTotal: fetchTotal,
  };
}
