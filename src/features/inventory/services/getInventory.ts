"use server";
import pool from "@/lib/db";
import { InventoryRow } from "@/types/inventory";

export async function getInventory(): Promise<InventoryRow[]> {
  try {
    const client = await pool.connect();

    const result = await client.query<InventoryRow>(`
      SELECT
        p.lot_no,
        p.product_code,
        p.stock_no,
        p.description,
        p.created_at,
        w.warehouse,
        i.quantity
      FROM parts p
      JOIN parts_location pl ON p.lot_no = pl.lot_no
      JOIN warehouse w ON w.id = pl.warehouse_id
      JOIN inventory i ON i.lot_no = p.lot_no
      ORDER BY p.created_at DESC
    `);

    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching inventory:", error);
    throw new Error(error.message || "Failed to fetch inventory data");
  }
}
