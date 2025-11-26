"use server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { getTranslations } from "next-intl/server";

export async function addUser(
  username: string,
  email: string,
  password: string,
  role: string,
  warehouseId: string
) {
  const t = await getTranslations("addUser");

  try {
    const client = await pool.connect();

    if (!email) {
      throw new Error("Email is required");
    }

    if (!username || !email || !password || !role) {
      const errorMessage = t("allFieldsRequired");
      throw new Error(errorMessage);
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const errorMessage = t("emailInvalid");
      throw new Error(errorMessage);
    }

    const existingUser = await client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      const errorMessage = t("userExists");
      throw new Error(errorMessage);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await client.query(
      `INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *`,
      [username, email, hashedPassword, role]
    );
    const userId = result.rows[0].id;

    await client.query(
      `INSERT INTO worker_location (user_id, warehouse_id) VALUES ($1, $2)`,
      [userId, warehouseId]
    );

    client.release();
    console.log("User added successfully:", result.rows[0]);
    return result.rows[0];
  } catch (error: any) {
    console.error("Error adding user:", error);
    const fallbackError = t("fallbackError");
    throw new Error(error.message || fallbackError);
  }
}
