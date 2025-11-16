"use server";
import pool from "@/lib/db";
import { encrypt } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { getTranslations } from "next-intl/server";

export async function login(username: string, password: string) {
  const t = await getTranslations("loginFunction");
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM users u LEFT JOIN worker_location wl ON u.id = wl.user_id LEFT JOIN warehouse w ON wl.warehouse_id=w.id WHERE username = $1",
      [username]
    );
    client.release();
    if (result.rows.length === 0) {
      const errorMessage = t("userNotFound");
      throw new Error(errorMessage);
    }
    const isValidPassword = await bcrypt.compare(
      password,
      result.rows[0].password_hash
    );
    if (!isValidPassword) {
      const errorMessage = t("incorrectPassword");
      throw new Error(errorMessage);
    }

    const user = {
      userId: result.rows[0].uuid,
      email: result.rows[0].email,
      role: result.rows[0].role,
      location: result.rows[0].location,
      username: result.rows[0].username,
    };
    // const expires = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const token = await encrypt({ user });

    return { token, user };
  } catch (error: any) {
    console.error("Error during login:", error);
    const fallbackError = t("fallbackError");
    throw new Error(error.message || fallbackError);
  }
}
