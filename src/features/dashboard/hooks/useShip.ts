/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getRecentShipped } from "../services/getRecentShipped";
import { getShip } from "../services/getShip";
import { useTranslations } from "next-intl";

export function useShip() {
  const [shippedThisMonth, setShippedThisMonth] = useState(0);
  const [shippedLastMonth, setShippedLastMonth] = useState(0);
  const [shippedPercentageChange, setShippedPercentageChange] = useState(0);
  const [shippedLoading, setShippedLoading] = useState(true);
  const [shippedError, setShippedError] = useState<null | string>(null);
  const [recentShipped, setRecentShipped] = useState<any[]>([]);
  const [recentShippedLoading, setRecentShippedLoading] = useState(true);
  const [recentShippedError, setRecentShippedError] = useState<string | null>(
    null
  );

  const t = useTranslations("DashboardPage");

  const fetchRecentShipped = async () => {
    setRecentShippedLoading(true);
    try {
      const response = await getRecentShipped();
      setRecentShipped(response);
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      setRecentShippedError(error.message || t("failedFetchOverview"));
    } finally {
      setRecentShippedLoading(false);
    }
  };

  const fetchShipped = async () => {
    setShippedLoading(true);
    try {
      const response = await getShip();
      setShippedThisMonth(response.this_months_total);
      setShippedLastMonth(response.prev_months_total);
      setShippedPercentageChange(response.percentage_change);
    } catch (error: any) {
      setShippedError(error.message || t("failedFetchShip"));
    } finally {
      setShippedLoading(false);
    }
  };

  useEffect(() => {
    fetchShipped();
    fetchRecentShipped();
  }, []);

  return {
    shippedThisMonth,
    shippedLastMonth,
    shippedPercentageChange,
    shippedLoading,
    shippedError,
    recentShipped,
    recentShippedLoading,
    recentShippedError,
  };
}
