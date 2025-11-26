import { useState, useEffect } from "react";
import { getWarehouseWorkers } from "../services/getWarehouseWorker";
import { getWarehouse } from "../services/getWarehouse";
import { addWarehouse } from "../services/addWarehouse";

export function useWarehouseHooks() {
  const [warehouseWorker, setWarehouseWorker] = useState<any[]>([]);
  const [warehouse, setWarehouse] = useState<any[]>([]);
  const [warehouseLoading, setWarehouseLoading] = useState(true);
  const [warehouseError, setWarehouseError] = useState<string | null>(null);
  const [addWarehouseError, setAddWarehouseError] = useState<string | null>(null);

  useEffect(() => {
    fetchWarehouseWorkers();
    fetchWarehouse();
  }, []);

  const fetchWarehouseWorkers = async () => {
    setWarehouseLoading(true);
    try {
      const response = await getWarehouseWorkers();
      setWarehouseWorker(response);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setWarehouseError(error.message || "Failed to fetch stocked data");
    } finally {
      setWarehouseLoading(false);
    }
  };

  const fetchWarehouse = async () => {
    setWarehouseLoading(true);
    try {
      const response = await getWarehouse();
      setWarehouse(response);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setWarehouseError(error.message || "Failed to fetch stocked data");
    } finally {
      setWarehouseLoading(false);
    }
  };

  const handleAddWarehouse = async (name: string, location: string) => {
    try {
      const response = await addWarehouse(name, location);
      if(response) {
        fetchWarehouse();
        fetchWarehouseWorkers();
      }
    } catch (error: any) {
      console.error("Error adding warehouse:", error);
      setAddWarehouseError(error.message || "Failed to add warehouse");
    }
  };

  return {
    warehouse,
    warehouseWorker,
    warehouseLoading,
    warehouseError,
    addWarehouseError,
    addWarehouse: handleAddWarehouse,
    refetchwarehouse: fetchWarehouseWorkers,
  };
}
