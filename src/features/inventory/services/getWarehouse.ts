"use server";
import pool from "@/lib/db";
import { WarehouseRow } from "@/types/inventory";

export async function getWarehouse(): Promise<WarehouseRow[]> {
  try {
    const client = await pool.connect();
    const result = await client.query<WarehouseRow>(`
      SELECT id, warehouse, location FROM warehouse
    `);

    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching warehouse:", error);
    throw new Error(error.message || "Failed to fetch warehouse list");
  }
}
