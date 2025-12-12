"use server";
import pool from "@/lib/db";
import { StockedPart } from "@/types/ship";

export async function getStockedParts(
  warehouseId: string
): Promise<StockedPart[]> {
  try {
    const client = await pool.connect();

    const result = await client.query(
      `
      SELECT
        p.lot_no,
        p.product_code,
        p.stock_no,
        p.description,
        i.quantity
      FROM parts p
      JOIN parts_location pl ON p.lot_no = pl.lot_no
      JOIN inventory i ON p.lot_no = i.lot_no
      WHERE pl.warehouse_id = $1
      `,
      [warehouseId]
    );

    client.release();
    return result.rows;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch stocked parts");
  }
}
