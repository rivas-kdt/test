/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getRecentStocked } from "../services/getRecentStocked";
import { getStock } from "../services/getStock";
import { useTranslations } from "next-intl";

export function useStock() {
  const [stockedThisMonth, setStockedThisMonth] = useState(0);
  const [stockedLastMonth, setStockedLastMonth] = useState(0);
  const [stockedPercentageChange, setStockedPercentageChange] = useState(0);
  const [stockedLoading, setStockedLoading] = useState(true);
  const [stockedError, setStockedError] = useState<null | string>(null);
  const [recentStocked, setRecentStocked] = useState<any[]>([]);
  const [recentStockedLoading, setRecentStockedLoading] = useState(true);
  const [recentStockedError, setRecentStockedError] = useState<string | null>(
    null
  );

  const t = useTranslations("DashboardPage");

  const fetchRecentStocked = async () => {
    setRecentStockedLoading(true);
    try {
      const response = await getRecentStocked();
      setRecentStocked(response);
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      setRecentStockedError(error.message || t("failedFetchOverview"));
    } finally {
      setRecentStockedLoading(false);
    }
  };

  const fetchStocked = async () => {
    setStockedLoading(true);
    try {
      const response = await getStock();
      setStockedThisMonth(response.this_months_total);
      setStockedLastMonth(response.prev_months_total);
      setStockedPercentageChange(response.percentage_change);
    } catch (error: any) {
      setStockedError(error.message || t("failedFetchStock"));
    } finally {
      setStockedLoading(false);
    }
  };

  useEffect(() => {
    fetchStocked();
    fetchRecentStocked();
  }, []);

  return {
    stockedThisMonth,
    stockedLastMonth,
    stockedPercentageChange,
    stockedLoading,
    stockedError,
    recentStocked,
    recentStockedLoading,
    recentStockedError,
  };
}
