"use server"
import pool from "@/lib/db";

export async function stockParts(
  lot_no: any,
  stock_no: any,
  product_code: any,
  description: any,
  quantity: any,
  warehouse_id: any
) {
  const client = await pool.connect();

  try {
    const partsResult = await client.query(
      `SELECT * FROM parts WHERE lot_no = $1`,
      [lot_no]
    );

    const isNew = partsResult.rows.length === 0;

    if (isNew) {
      const newPart = await client.query(
        `INSERT INTO parts (lot_no, stock_no, product_code, description)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [lot_no, stock_no, product_code, description]
      );

      await client.query(
        `INSERT INTO parts_location (lot_no, warehouse_id)
         VALUES ($1, $2)`,
        [lot_no, warehouse_id]
      );

      await client.query(
        `INSERT INTO inventory (lot_no, quantity)
         VALUES ($1, $2)`,
        [lot_no, quantity]
      );

      await client.query(
        `INSERT INTO transaction_history (lot_no, status, quantity)
         VALUES ($1, $2, $3)`,
        [lot_no, "stocked", quantity]
      );

      return { message: "New part added and stocked.", error: null };
    }

    const inventory = await client.query(
      `SELECT quantity FROM inventory WHERE lot_no = $1`,
      [lot_no]
    );

    if (inventory.rows.length > 0) {
      const newQty =
        Number(inventory.rows[0].quantity) + Number(quantity);

      await client.query(
        `UPDATE inventory SET quantity = $1 WHERE lot_no = $2`,
        [newQty, lot_no]
      );
    } else {
      await client.query(
        `INSERT INTO inventory (lot_no, quantity)
        VALUES ($1, $2)`,
        [lot_no, quantity]
      );
    }

    await client.query(
      `INSERT INTO transaction_history (lot_no, status, quantity)
       VALUES ($1, $2, $3)`,
      [lot_no, "stocked", quantity]
    );

    return { message: "Part stocked successfully.", error: null };
  } catch (err: any) {
    return { message: null, error: err.message };
  } finally {
    client.release();
  }
}
