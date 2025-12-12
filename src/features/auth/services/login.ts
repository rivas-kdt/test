"use server";

import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/jwt";
import { getTranslations } from "next-intl/server";
import { AuthUser, LoginResponse } from "@/types/auth";

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const t = await getTranslations("loginFunction");

  try {
    const client = await pool.connect();

    const result = await client.query(
      `SELECT u.*, w.id AS warehouse_id, w.warehouse AS warehouse_name, w.location
       FROM users u
       LEFT JOIN worker_location wl ON u.id = wl.user_id
       LEFT JOIN warehouse w ON wl.warehouse_id = w.id
       WHERE username = $1`,
      [username]
    );

    client.release();

    if (result.rows.length === 0) {
      throw new Error(t("userNotFound"));
    }

    const row = result.rows[0];

    const isValidPassword = await bcrypt.compare(password, row.password_hash);
    if (!isValidPassword) {
      throw new Error(t("incorrectPassword"));
    }

    const user: AuthUser = {
      userId: row.uuid,
      email: row.email,
      role: row.role,
      username: row.username,
      warehouse: row.warehouse_id
        ? {
            id: row.warehouse_id,
            name: row.warehouse_name,
            location: row.location,
          }
        : null,
    };

    const token = await encrypt({ user });

    return { token, user };
  } catch (error: any) {
    console.error("Error during login:", error);
    throw new Error(error.message || t("fallbackError"));
  }
}
