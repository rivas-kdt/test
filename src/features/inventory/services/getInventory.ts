/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import pool from "@/lib/db";

export async function getInventory() {
    try {
        const client = await pool.connect();
        const result = await client.query(`
        SELECT p.lot_no, p.product_code, p.stock_no, p.description, p.created_at, w.warehouse, i.quantity
        FROM parts p 
        JOIN parts_location pl ON p.lot_no = pl.lot_no 
        JOIN warehouse w ON w.id = pl.warehouse_id
        JOIN inventory i ON i.lot_no = p.lot_no
    `);
        client.release();
        return result.rows;
    } catch (error: any) {
        console.error("Error fetching inventory data:", error);
        throw new Error(error.message || "Failed to fetch inventory data");
    }
}
