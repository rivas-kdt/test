/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { getInventory } from "../services/getInventory";
import { getWarehouse } from "../services/getWarehouse";

export type Inventory = {
    lot_no: string;
    product_code: string;
    stock_no: string;
    description: string;
    warehouse: string;
    created_at: string;
    quantity: number;
} | null;

export function useInventory() {
    const [inventory, setInventory] = useState<Inventory[]>([]);
    const [inventoryLoading, setInventoryLoading] = useState(false)
    const [inventoryError, setInventoryError] = useState(false)
    const [warehouse, setWarehouse] = useState<any>(null);
    const [warehouseLoading, setWarehouseLoading] = useState(true);
    const [warehouseError, setWarehouseError] = useState<string | null>(null);

    useEffect(() => {
        fetchInventory();
        fetchWarehouse();
    }, []);

    const fetchInventory = async () => {
        setInventoryLoading(true);
        try {
            const response = await getInventory();
            setInventory(response);
        } catch (error: any) {
            console.error("Error fetching metrics:", error);
            setInventoryError(error.message || "Failed to fetch overview data");
        } finally {
            setInventoryLoading(false);
        }
    };

    const fetchWarehouse = async () => {
        setWarehouseLoading(true);
        try {
            const response = await getWarehouse();
            console.log("Fetched warehouse:", response);
            setWarehouse(response);
        } catch (error: any) {
            console.error("Error fetching metrics:", error);
            setWarehouseError(error.message || "Failed to fetch shipped data");
        } finally {
            setWarehouseLoading(false);
        }
    };

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
