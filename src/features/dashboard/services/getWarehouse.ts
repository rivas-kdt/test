"use server";
import pool from "@/lib/db";

export async function getWarehouse() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT id, warehouse, location FROM warehouse`
    );
    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching ship data:", error);
    throw new Error(error.message || "Failed to fetch ship data");
  }
}
