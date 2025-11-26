"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function addRecipient(email: string) {
  const t = await getTranslations("addRecipient");
  try {
    const client = await pool.connect();

    if (!email) {
      const errorMessage = t("errorRequired");
      return { success: false, error: errorMessage };
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const errorMessage = "Email is invalid";
      return { success: false, error: errorMessage };
      // throw new Error(errorMessage);
    }

    await client.query(
      `INSERT INTO recipients (email) VALUES ($1) RETURNING *`,
      [email]
    );

    client.release();
    return { success: true, message: "Recipient added successfully" };
  } catch (error: any) {
    const fallbackError = t("fallbackError");
    // throw new Error(error.message || fallbackError);
    return { success: false, error: error.message || fallbackError };
  }
}
