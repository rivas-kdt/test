/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getWarehouse } from "../services/getWarehouse";
import { getWarehouseInvnentory } from "../services/getWarehouseInventory";

interface WarehouseInventory {
  warehouse: string;
  stocked: number;
  shipped: number;
}

interface Warehouse {
  id: string;
  warehouse: string;
  location: string;
}

export function useWarehouse() {
  const [warehouseInventory, setWarehouseInventory] = useState<
    WarehouseInventory[]
  >([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [warehouse, setWarehouse] = useState<Warehouse[] | null>(null);
  const [warehouseLoading, setWarehouseLoading] = useState(true);
  const [warehouseError, setWarehouseError] = useState<string | null>(null);

  const fetchWarehouseInventory = async () => {
    setInventoryLoading(true);
    try {
      const response = await getWarehouseInvnentory();
      setWarehouseInventory(response);
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      setInventoryError(error.message || "Failed to fetch shipped data");
    } finally {
      setInventoryLoading(false);
    }
  };

  const fetchWarehouse = async () => {
    setWarehouseLoading(true);
    try {
      const response = await getWarehouse();
      setWarehouse(response);
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      setWarehouseError(error.message || "Failed to fetch shipped data");
    } finally {
      setWarehouseLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouseInventory();
    fetchWarehouse();
  }, []);

  return {
    warehouseInventory,
    inventoryLoading,
    inventoryError,
    warehouse,
    warehouseLoading,
    warehouseError,
  };
}
