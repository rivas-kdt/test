"use server";
import pool from "@/lib/db";

export async function getRecentStocked() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
        SELECT p.lot_no, p.product_code, p.stock_no, p.description, t.quantity, t.created_at 
        FROM transaction_history t 
        JOIN parts p ON t.lot_no=p.lot_no 
        WHERE status = 'stocked' 
        ORDER BY created_at DESC limit 10
    `);
    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching recent stocked data:", error);
    throw new Error(error.message || "Failed to fetch recent stocked data");
  }
}