"use server";

import pool from "@/lib/db";

export const fetchParts = async () => {
  const response = await fetch(
    "https://xmon-sys.vercel.app/api/v2/inventory/test"
  );
  const data2 = await response.json();
  return data2;
};

export async function getTransactions() {
  const client = await pool.connect();
  try {
    const query = `SELECT th.lot_no, th.quantity, th.status, th.created_at as date, p.description, p.stock_no, w.warehouse, ti."imgUrl"
    FROM transaction_history th 
    JOIN parts p ON th.lot_no = p.lot_no 
    JOIN parts_location pl ON p.lot_no = pl.lot_no 
    JOIN warehouse w ON pl.warehouse_id = w.id
    LEFT JOIN transaction_image ti ON th.id = ti.id
    ORDER BY th.created_at DESC`;
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  } finally {
    client.release();
  }
} 
