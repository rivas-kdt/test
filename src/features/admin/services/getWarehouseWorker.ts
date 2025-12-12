"use server";
import pool from "@/lib/db";
import { Warehouse } from "@/types/admin";

export async function getWarehouseWorkers(): Promise<Warehouse[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT
        w.id,
        w.warehouse,
        w.location,
        COUNT(wl.user_id)::int AS workers,
        w.created_at
      FROM warehouse w
      LEFT JOIN worker_location wl ON w.id = wl.warehouse_id
      GROUP BY w.id
      ORDER BY w.created_at DESC
    `);

    return result.rows as Warehouse[];
  } finally {
    client.release();
  }
}
