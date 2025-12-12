"use server";
import pool from "@/lib/db";

export async function shipParts(lot_no: string, qty: number) {
  try {
    const client = await pool.connect();

    // Validate
    const exists = await client.query(`SELECT 1 FROM parts WHERE lot_no = $1`, [
      lot_no,
    ]);
    if (exists.rowCount === 0) throw new Error("Part not found");

    const inv = await client.query(
      `SELECT quantity FROM inventory WHERE lot_no = $1`,
      [lot_no]
    );

    if (inv.rowCount === 0) throw new Error("Inventory record not found");

    if (inv.rows[0].quantity < qty)
      throw new Error("Insufficient inventory quantity");

    // Update inventory
    await client.query(
      `UPDATE inventory SET quantity = quantity - $1 WHERE lot_no = $2`,
      [qty, lot_no]
    );

    // Log history
    await client.query(
      `
      INSERT INTO transaction_history (lot_no, status, quantity)
      VALUES ($1, 'shipped', $2)
      `,
      [lot_no, qty]
    );

    client.release();
    return { success: true, lot_no };
  } catch (error: any) {
    throw new Error(error.message || "Failed to ship part");
  }
}
