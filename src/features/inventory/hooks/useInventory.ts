import { useEffect, useState } from "react";
import { getInventory } from "../services/getInventory";
import { getWarehouse } from "../services/getWarehouse";
import { InventoryRow, WarehouseRow } from "@/types/inventory";

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState<boolean>(false);
  const [inventoryError, setInventoryError] = useState<string | null>(null);

  const [warehouse, setWarehouse] = useState<WarehouseRow[]>([]);
  const [warehouseLoading, setWarehouseLoading] = useState<boolean>(false);
  const [warehouseError, setWarehouseError] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
    fetchWarehouse();
  }, []);

  async function fetchInventory() {
    setInventoryLoading(true);
    try {
      const data = await getInventory();
      setInventory(data);
    } catch (error: any) {
      setInventoryError(error.message);
    } finally {
      setInventoryLoading(false);
    }
  }

  async function fetchWarehouse() {
    setWarehouseLoading(true);
    try {
      const data = await getWarehouse();
      setWarehouse(data);
    } catch (error: any) {
      setWarehouseError(error.message);
    } finally {
      setWarehouseLoading(false);
    }
  }

  return {
    inventory,
    inventoryLoading,
    inventoryError,
    refetchInventory: fetchInventory,

    warehouse,
    warehouseLoading,
    warehouseError,
  };
}
