"use server";
import pool from "@/lib/db";

export async function getWarehouseInvnentory() {
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT 
    w.warehouse,
    SUM(CASE WHEN th.status = 'shipped' THEN th.quantity ELSE 0 END) AS shipped,
    ((SUM(CASE WHEN th.status = 'stocked' THEN th.quantity ELSE 0 END))-(SUM(CASE WHEN th.status = 'shipped' THEN th.quantity ELSE 0 END))) AS stocked
    FROM public.warehouse w
    LEFT JOIN public.parts_location pl ON w.id = pl.warehouse_id
    LEFT JOIN public.transaction_history th ON pl.lot_no = th.lot_no
    GROUP BY 
    w.warehouse`);
    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching warehouse data:", error);
    throw new Error(error.message || "Failed to fetch warehouse data");
  }
}
