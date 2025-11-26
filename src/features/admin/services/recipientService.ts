/* eslint-disable @typescript-eslint/no-explicit-any */
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

export async function addRecipient(email: string) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO recipients (email) VALUES ($1) RETURNING *`,
      [email]
    );
    client.release();
    return result.rows[0];
  } catch (error: any) {
    console.error("Error adding recipient:", error);
    throw new Error(error.message || "Failed to add recipient");
  }
}