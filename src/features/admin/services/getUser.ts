"use server";
import pool from "@/lib/db";

export async function getUsers() {
  try {
    const client = await pool.connect();
    const result =
      await client.query(`SELECT u.id, u.username, u.email, u.role, u.created_at, w.warehouse, w.location
        FROM users u LEFT JOIN worker_location wl ON u.id=wl.user_id
        LEFT JOIN warehouse w ON w.id=wl.warehouse_id`);
    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching ship data:", error);
    throw new Error(error.message || "Failed to fetch ship data");
  }
}
