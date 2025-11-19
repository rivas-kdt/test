"use server";
import pool from "@/lib/db";

export async function stockParts(
  lot_no: any,
  stock_no: any,
  product_code: any,
  description: any,
  quantity: any,
  warehouse_id: any
  //   receipt_url: any
) {
    console.log(lot_no)
  try {
    const client = await pool.connect();
    const partsResult = await client.query(
      `SELECT * FROM parts WHERE lot_no = $1`,
      [lot_no]
    );

    if (!partsResult.rows) {
      const insertNewPart = await client.query(
        `INSERT INTO parts (lot_no, stock_no, product_code, description) VALUES ($1, $2, $3, $4) RETURNING *`,
        [lot_no, stock_no, product_code, description]
      );

      if (!insertNewPart.rows) {
        throw new Error("Failed to insert new part");
      }

      const insertLocation = await client.query(
        `INSERT INTO parts_location VALUES ($1, $2) RETURNING *`,
        [lot_no, warehouse_id]
      );

      if (!insertLocation.rows) {
        throw new Error("Failed to insert part location");
      }

      const insertInventory = await client.query(
        `INSERT INTO inventory (lot_no, quantity) VALUES ($1, $2) RETURNING *`,
        [lot_no, quantity]
      );

      if (!insertInventory.rows) {
        throw new Error("Failed to insert inventory");
      }

      return { message: "New part added and stocked." };
    }

    const checkInventory = await client.query(
      `SELECT * FROM inventory WHERE lot_no = $1`,
      [lot_no]
    );

    if (checkInventory.rows.length > 0) {
      const newQty =
        parseInt(checkInventory.rows[0].quantity) + parseInt(quantity);
      const updateInventory = await client.query(
        `UPDATE inventory SET quantity = $1 WHERE lot_no = $2 RETURNING *`,
        [newQty, lot_no]
      );
      if (!updateInventory.rows) {
        throw new Error("Failed to update inventory");
      }
    }

    const insertTransaction = await client.query(
      `INSERT INTO transaction_history (lot_no, status, quantity) VALUES ($1, $2, $3) RETURNING *`,
      [lot_no, "stocked", quantity]
    );

    if (!insertTransaction.rows) {
      throw new Error("Failed to insert transaction history");
    }

    client.release();
    return { message: "Part stocked successfully." };
  } catch (error) {
    throw new Error("Database error: " + (error as Error).message);
  }
}
