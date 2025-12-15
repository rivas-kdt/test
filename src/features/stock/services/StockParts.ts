"use server";

import pool from "@/lib/db";
import { StockItemPayload } from "@/types/stock";

/**
 * Stock (Add/Update) inventory for a scanned part.
 *
 * Logic:
 * - If part doesn't exist → create new part, assign location, create inventory
 * - If part exists → update inventory quantity
 * - Always record transaction history & image
 */
export async function stockParts(payload: StockItemPayload) {
  const {
    lotNo,
    stockNo,
    productCode,
    description,
    quantity,
    warehouseId,
    receiptUrl,
  } = payload;

  const client = await pool.connect();

  try {
    // ---------------------------
    // 1. Check if part exists
    // ---------------------------
    const partResult = await client.query(
      `SELECT lot_no FROM parts WHERE lot_no = $1`,
      [lotNo]
    );

    const isNewPart = partResult.rowCount === 0;

    // ---------------------------
    // 2. Insert NEW part + mapping + inventory
    // ---------------------------
    if (isNewPart) {
      await client.query(
        `
        INSERT INTO parts (lot_no, stock_no, product_code, description)
        VALUES ($1, $2, $3, $4)
      `,
        [lotNo, stockNo, productCode, description]
      );

      await client.query(
        `
        INSERT INTO parts_location (lot_no, warehouse_id)
        VALUES ($1, $2)
      `,
        [lotNo, warehouseId]
      );

      await client.query(
        `
        INSERT INTO inventory (lot_no, quantity)
        VALUES ($1, $2)
      `,
        [lotNo, quantity]
      );
    }

    // ---------------------------
    // 3. Update inventory for existing part
    // ---------------------------
    if (!isNewPart) {
      const inv = await client.query(
        `SELECT quantity FROM inventory WHERE lot_no = $1`,
        [lotNo]
      );

      if (inv.rowCount > 0) {
        const newQty = Number(inv.rows[0].quantity) + Number(quantity);

        await client.query(
          `UPDATE inventory SET quantity = $1 WHERE lot_no = $2`,
          [newQty, lotNo]
        );
      } else {
        // part exists but no inventory record — create one
        await client.query(
          `INSERT INTO inventory (lot_no, quantity) VALUES ($1, $2)`,
          [lotNo, quantity]
        );
      }
    }

    // ---------------------------
    // 4. Add transaction history + image
    // ---------------------------
    const history = await client.query(
      `
      INSERT INTO transaction_history (lot_no, status, quantity)
      VALUES ($1, 'stocked', $2)
      RETURNING id
    `,
      [lotNo, quantity]
    );

    await client.query(
      `
      INSERT INTO transaction_image (id, "imgUrl")
      VALUES ($1, $2)
    `,
      [history.rows[0].id, receiptUrl]
    );

    return {
      message: isNewPart
        ? "New part added and stocked."
        : "Part stocked successfully.",
      error: null,
    };
  } catch (err: any) {
    console.error("StockParts error:", err);
    return { message: null, error: err.message };
  } finally {
    client.release();
  }
}
