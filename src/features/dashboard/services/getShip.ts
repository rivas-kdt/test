"use server";
import pool from "@/lib/db";

export async function getShip() {
  try {
    const client = await pool.connect();
    const result = await client.query(`WITH
        tb2 AS ( SELECT COALESCE(SUM(quantity), 0) AS prev_months_total
                FROM transaction_history
                WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND status = 'shipped'),
        tb1 AS ( SELECT COALESCE(SUM(quantity), 0) AS this_months_total
                FROM transaction_history
                WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE) AND status = 'shipped')
        SELECT prev_months_total, this_months_total,
        ROUND(((this_months_total - prev_months_total)::numeric / NULLIF(((this_months_total + prev_months_total)::numeric / 2), 0)) * 100, 2) AS percentage_change
        FROM tb1 CROSS JOIN tb2`);
    client.release();
    return result.rows[0];
  } catch (error: any) {
    console.error("Error fetching ship data:", error);
    throw new Error(error.message || "Failed to fetch ship data");
  }
}
