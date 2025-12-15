"use server";
import pool from "@/lib/db";
import { Recipient } from "@/types/admin";

export async function updateRecipientStatus(id: string, isActive: boolean) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE recipients
       SET isactive = $2
       WHERE id = $1
       RETURNING id, email, isactive, created_at`,
      [id, isActive]
    );

    return {
      success: true,
      data: result.rows[0] as Recipient,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message ?? "Failed to update recipient status",
    };
  } finally {
    client.release();
  }
}
