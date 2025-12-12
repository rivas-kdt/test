"use server";

import pool from "@/lib/db";

export interface EditUserPayload {
  username?: string;
  role?: "admin" | "worker";
  warehouse_id?: string;
}

export async function editUser(userId: string, payload: EditUserPayload) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // -------------------------------
    // 1️⃣ Update user main fields
    // -------------------------------
    const { username, role, warehouse_id } = payload;

    const userFields: string[] = [];
    const userValues: any[] = [];
    let index = 1;

    if (username) {
      userFields.push(`username = $${index}`);
      userValues.push(username);
      index++;
    }

    if (role) {
      userFields.push(`role = $${index}`);
      userValues.push(role);
      index++;
    }

    if (userFields.length > 0) {
      userValues.push(userId); // last parameter
      const userQuery = `
        UPDATE users
        SET ${userFields.join(", ")}
        WHERE id = $${index}
      `;
      await client.query(userQuery, userValues);
    }

    // -------------------------------
    // 2️⃣ Update warehouse using worker_location
    // -------------------------------
    if (warehouse_id) {
      const locationRes = await client.query(
        `SELECT id FROM worker_location WHERE user_id = $1`,
        [userId]
      );

      if (locationRes.rows.length > 0) {
        // UPDATE existing mapping
        await client.query(
          `
          UPDATE worker_location
          SET warehouse_id = $1, updated_at = NOW()
          WHERE user_id = $2
        `,
          [warehouse_id, userId]
        );
      } else {
        // INSERT new mapping
        await client.query(
          `
          INSERT INTO worker_location (user_id, warehouse_id)
          VALUES ($1, $2)
        `,
          [userId, warehouse_id]
        );
      }
    }

    await client.query("COMMIT");

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("editUser failed:", err);
    return {
      success: false,
      message: err.message || "Failed to update user",
    };
  } finally {
    client.release();
  }
}
