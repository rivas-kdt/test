"use server";
import pool from "@/lib/db";

export async function getMonthlyTransaction() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      WITH
        last_5_months AS (
          SELECT DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' * i AS month
          FROM generate_series(0, 11) AS i
        ),
        monthly_totals AS (
          SELECT DATE_TRUNC('month', created_at) AS month,
                 status,
                 SUM(quantity) AS total_quantity
          FROM transaction_history
          WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
          GROUP BY DATE_TRUNC('month', created_at), status
        )
      SELECT
        TO_CHAR(m.month, 'MONTH') AS month_name,
        COALESCE(stocked.total_quantity, 0) AS stocked,
        COALESCE(shipped.total_quantity, 0) AS shipped
      FROM last_5_months m
      LEFT JOIN monthly_totals stocked
        ON m.month = stocked.month AND stocked.status = 'stocked'
      LEFT JOIN monthly_totals shipped
        ON m.month = shipped.month AND shipped.status = 'shipped'
      ORDER BY m.month ASC
    `);
    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching overview data:", error);
    throw new Error(error.message || "Failed to fetch overview data");
  }
}