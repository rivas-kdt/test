"use server";
import pool from "@/lib/db";
import { Warehouse } from "@/types/admin";

export async function getWarehouse(): Promise<Warehouse[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT
        id,
        warehouse,
        location,
        0::int AS workers,
        created_at
      FROM warehouse
      ORDER BY created_at DESC
    `);

    return result.rows as Warehouse[];
  } finally {
    client.release();
  }
}
