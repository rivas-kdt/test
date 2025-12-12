import { useState, useEffect } from "react";
import { getWarehouseWorkers } from "../services/getWarehouseWorker";
import { getWarehouse } from "../services/getWarehouse";
import { Warehouse } from "@/types/admin";

export function useWarehouseHooks() {
  const [warehouseWorker, setWarehouseWorker] = useState<Warehouse[]>([]);
  const [warehouse, setWarehouse] = useState<Warehouse[]>([]);
  const [warehouseLoading, setWarehouseLoading] = useState(true);

  const fetchWarehouseWorkers = async () => {
    const data = await getWarehouseWorkers();
    setWarehouseWorker(data);
  };

  const fetchWarehouse = async () => {
    const data = await getWarehouse();
    setWarehouse(data);
  };

  useEffect(() => {
    fetchWarehouseWorkers();
    fetchWarehouse();
    setWarehouseLoading(false);
  }, []);

  return {
    warehouseWorker,
    warehouse,
    warehouseLoading,
    refetchwarehouse: fetchWarehouseWorkers,
  };
}
