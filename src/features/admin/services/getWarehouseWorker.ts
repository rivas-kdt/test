"use server";
import pool from "@/lib/db";

export async function getWarehouseWorkers() {
  try {
    const client = await pool.connect();
    const result =
      await client.query(`SELECT w.id, w.warehouse, w.location, COUNT(wl.user_id) AS workers, w.created_at
        FROM warehouse w LEFT JOIN worker_location wl ON w.id=wl.warehouse_id GROUP BY w.id`);
    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching ship data:", error);
    throw new Error(error.message || "Failed to fetch ship data");
  }
}
