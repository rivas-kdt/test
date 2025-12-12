"use server";
import pool from "@/lib/db";
import { User } from "@/types/admin";

export async function getUsers(): Promise<User[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT
        u.id,
        u.username,
        u.email,
        u.role,
        u.created_at,
        w.warehouse,
        w.id as warehouse_id,
        w.location
      FROM users u
      LEFT JOIN worker_location wl ON u.id = wl.user_id
      LEFT JOIN warehouse w ON w.id = wl.warehouse_id
      ORDER BY u.created_at DESC
    `);

    return result.rows as User[];
  } finally {
    client.release();
  }
}
