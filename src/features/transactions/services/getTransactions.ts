"use server";

import pool from "@/lib/db";
import { Transaction } from "@/types/transaction";

export async function getTransactions(): Promise<Transaction[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT
        th.id,
        th.lot_no,
        th.quantity,
        th.status,
        th.created_at AS created_at,
        p.description,
        p.stock_no,
        w.warehouse,
        w.id as warehouse_id,
        ti."imgUrl"
      FROM transaction_history th
      JOIN parts p ON th.lot_no = p.lot_no
      JOIN parts_location pl ON p.lot_no = pl.lot_no
      JOIN warehouse w ON pl.warehouse_id = w.id
      LEFT JOIN transaction_image ti ON th.id = ti.id
      ORDER BY th.created_at DESC
    `;

    const result = await client.query(query);
    return result.rows as Transaction[];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  } finally {
    client.release();
  }
}
