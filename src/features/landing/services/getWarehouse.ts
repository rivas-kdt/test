/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import pool from "@/lib/db";

export async function getWarehouse(warehouseId: string | null) {
  try {
    const client = await pool.connect();
    if (warehouseId) {
      const result = await client.query(
        `SELECT id, warehouse, location FROM warehouse WHERE id=$1`,
        [warehouseId]
      );
      client.release();
      return result.rows;
    }
    const result = await client.query(
      `SELECT id, warehouse, location FROM warehouse`
    );
    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching ship data:", error);
    throw new Error(error.message || "Failed to fetch ship data");
  }
}
