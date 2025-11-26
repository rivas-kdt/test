"use server"
import pool from "@/lib/db";

export async function getRecipients() {
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM recipients ORDER BY created_at DESC`);
    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching ship data:", error);
    throw new Error(error.message || "Failed to fetch ship data");
  }
}