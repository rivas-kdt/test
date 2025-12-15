// src/features/landing/services/getWarehouse.ts
"use server";

import pool from "@/lib/db";
import { Warehouse } from "@/types/warehouse";

export async function getWarehouse(
  warehouseId?: string | null
): Promise<Warehouse[]> {
  try {
    const client = await pool.connect();

    let result;
    if (warehouseId) {
      result = await client.query(
        `SELECT id, warehouse, location FROM warehouse WHERE id=$1`,
        [warehouseId]
      );
    } else {
      result = await client.query(
        `SELECT id, warehouse, location FROM warehouse`
      );
    }

    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching warehouse data:", error);
    throw new Error(error.message ?? "Failed to fetch warehouse data");
  }
}
