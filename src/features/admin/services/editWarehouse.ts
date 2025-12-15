"use server";

import pool from "@/lib/db";

export async function editWarehouse(
  warehouseId: string,
  payload: Partial<{ warehouse: string; location: string }>
) {
  try {
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in payload) {
      if (payload[key as keyof typeof payload]) {
        fields.push(`${key} = $${index}`);
        values.push(payload[key as keyof typeof payload]);
        index++;
      }
    }

    if (fields.length === 0) {
      return { success: false, message: "No changes provided" };
    }

    values.push(warehouseId);

    const query = `
      UPDATE warehouse
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *;
    `;

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    return { success: true, data: result.rows[0] };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
