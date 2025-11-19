"use server"
import pool from "@/lib/db";

export async function shipParts(lot_no: string, quantity: number) {
  try {
    const client = await pool.connect();
    const partsExist = await client.query(
      ` SELECT * FROM parts WHERE lot_no = $1`,
      [lot_no]
    );
    if (partsExist.rowCount === 0) {
      throw new Error("Part not found");
    }
    const inventory = await client.query(
      `SELECT * FROM inventory WHERE lot_no = $1`,
      [lot_no]
    );
    if (inventory.rowCount === 0) {
      throw new Error("Inventory record not found");
    }
    if (inventory.rows[0].quantity < quantity) {
      throw new Error("Insufficient inventory quantity");
    }
    const newQuantity = inventory.rows[0].quantity - quantity;
    const updateInventory = await client.query(
      `UPDATE inventory SET quantity = $1 WHERE lot_no = $2`,
      [newQuantity, lot_no]
    );
    if (updateInventory.rowCount === 0) {
      throw new Error("Failed to update inventory");
    }
    const logHistory = await client.query(
      `INSERT INTO transaction_history (lot_no, status, quantity) VALUES ($1, 'shipped', $2)`,
      [lot_no, quantity]
    );
    if (logHistory.rowCount === 0) {
      throw new Error("Failed to log transaction history");
    }
    client.release();
    return { message: "Shipped out successfully", lot_no };
  } catch (error: any) {
    console.error("Error in shipping process:", error);
    throw new Error(error.message || "Failed to ship out the part");
  }
}
