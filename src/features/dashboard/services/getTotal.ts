/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import pool from "@/lib/db";

export async function getTotal() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      WITH totals AS (
  SELECT
    SUM(CASE WHEN created_at < DATE_TRUNC('month', CURRENT_DATE)
             THEN quantity ELSE 0 END) AS previous_total,

    SUM(CASE WHEN created_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
             THEN quantity ELSE 0 END) AS current_total
  FROM transaction_history
)

SELECT
  previous_total,
  current_total,
  (current_total - previous_total) AS difference,
  CASE
    WHEN previous_total = 0 THEN 0
    ELSE ROUND((current_total - previous_total) * 100.0 / previous_total, 2)
  END AS percentage_change
FROM totals;
    `);
    client.release();
    return result.rows[0];
  } catch (error: any) {
    console.error("Error fetching overview data:", error);
    throw new Error(error.message || "Failed to fetch overview data");
  }
}
