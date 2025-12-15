"use server";
import pool from "@/lib/db";
import { Recipient } from "@/types/admin";

export async function getRecipients(): Promise<Recipient[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT id, email, isactive, created_at
      FROM recipients
      ORDER BY created_at DESC
    `);

    return result.rows as Recipient[];
  } finally {
    client.release();
  }
}
