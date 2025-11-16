/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getWarehouse } from "../services/getWarehouse";

export function useLanding() {
  const [warehouse, setWarehouse] = useState<any>(null);
  const [warehouseLoading, setWarehouseLoading] = useState(true);

  useEffect(() => {
    fetchWarehouse();
  }, []);

  const fetchWarehouse = async () => {
    setWarehouseLoading(true);
    try {
      const response = await getWarehouse();
      setWarehouse(response);
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch warehouse data");
    } finally {
      setWarehouseLoading(false);
    }
  };

  return { warehouse, warehouseLoading };
}
