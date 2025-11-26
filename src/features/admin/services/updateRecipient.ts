/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import pool from "@/lib/db";

export async function updateRecipientStatus(id: string, isActive: boolean) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `UPDATE recipients set isactive = $2 WHERE id = $1 RETURNING *`,
      [id, isActive]
    );
    client.release();
    return { success: true, data: result.rows[0] };
  } catch (error: any) {
    console.error("Error updating recipient status:", error);
    return {
      success: false,
      message: error.message || "Failed to update recipient status",
    };
  }
}
