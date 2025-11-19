/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getWarehouse } from "../services/getWarehouse";
import { useAuth } from "@/features/auth/hooks/auth-context";

export function useLanding() {
  const [warehouse, setWarehouse] = useState<any[]>([]);
  const [warehouseLoading, setWarehouseLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const { session } = useAuth();
  const selectedWarehouseId = session?.user?.warehouse?.id ?? null;

  useEffect(() => {
    if (session?.isAuthenticated) {
      fetchWarehouse();
    }
  }, [session]);

  const fetchWarehouse = async () => {
    setWarehouseLoading(true);
    try {
      let response;

      if (session?.user?.role === "admin") {
        response = await getWarehouse(null);
      } else if (session?.user) {
        response = await getWarehouse(selectedWarehouseId);
        setSelectedLocation(response[0].location);
      }
      setWarehouse(response || []);
      if (response && response.length > 0) {
        setSelectedWarehouse(response[0]);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setWarehouseLoading(false);
    }
  };

  const handleWarehouseChange = (warehouseId: string) => {
    const selected = warehouse.find((w: any) => String(w.id) === warehouseId);
    if (selected) {
      setSelectedWarehouse(selected);
      sessionStorage.setItem("selectedWarehouseId", selected.id);
      sessionStorage.setItem("selectedWarehouse", JSON.stringify(selected));
    } else {
      setSelectedWarehouse(null);
      sessionStorage.removeItem("selectedWarehouseId");
      sessionStorage.removeItem("selectedWarehouse");
    }
  };

  return {
    warehouse,
    warehouseLoading,
    selectedWarehouse,
    handleWarehouseChange,
    selectedLocation,
  };
}
