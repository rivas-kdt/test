/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/email/services/getHistory.ts
"use server";
import pool from "@/lib/db";

export async function getHistory() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
        SELECT eh.id, eh.created_at, th.status, p.lot_no, p.stock_no, p.description, p.product_code, th.quantity
        FROM email_history eh
		JOIN email_transaction et ON et.email_id=eh.id
        JOIN transaction_history th ON et.transaction_id = th.id
		JOIN parts p ON p.lot_no=th.lot_no
    `);
    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching email history data:", error);
    throw new Error(error.message || "Failed to fetch email history data");
  }
}
