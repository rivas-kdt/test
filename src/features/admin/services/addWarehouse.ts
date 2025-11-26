"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function addWarehouse(warehouseName: string, location: string) {
  const t = await getTranslations("addWarehouse");

  try {
    const client = await pool.connect();

    if (!warehouseName || !location) {
      const errorMessage = t("errorRequired");
      return { success: false, error: errorMessage };
      // throw new Error(errorMessage);
    }
    const existingWarehouse = await client.query(
      `SELECT * FROM warehouse WHERE warehouse = $1`,
      [warehouseName]
    );
    if (existingWarehouse.rows.length > 0) {
      const errorMessage = t("errorExists");
      return { success: false, error: errorMessage };
      // throw new Error(errorMessage);
    }

    await client.query(
      `INSERT INTO warehouse (warehouse, location) VALUES ($1, $2) RETURNING *`,
      [warehouseName, location]
    );

    client.release();

    return { success: true, message: "Warehouse added successfully" };
    // return result.rows[0];
  } catch (error: any) {
    const fallbackError = t("fallbackError");
    return { success: false, error: error.message || fallbackError };
    // throw new Error(error.message || fallbackError);
  }
}
