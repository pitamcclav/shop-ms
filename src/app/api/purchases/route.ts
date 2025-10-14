import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-mysql";
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export const dynamic = "force-dynamic";

// GET all purchases
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        pu.id,
        pu.product_id,
        pu.quantity,
        pu.buying_price,
        pu.total_cost,
        pu.supplier,
        pu.purchase_date,
        p.name as product_name
      FROM purchases pu
      JOIN products p ON pu.product_id = p.id
      ORDER BY pu.purchase_date DESC
    `);
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}

// POST new purchase (add stock)
export async function POST(request: NextRequest) {
  const connection = await pool.getConnection();
  
  try {
    const body = await request.json();
    const { product_id, quantity, buying_price, selling_price, supplier, unit_type, units_per_package, package_name } = body;

    if (!product_id || !quantity || quantity <= 0 || !buying_price || buying_price <= 0 || !selling_price || selling_price <= 0) {
      return NextResponse.json(
        { error: "Valid product_id, quantity, buying_price, and selling_price are required" },
        { status: 400 }
      );
    }

    // Get product details
    const [productRows] = await connection.query<RowDataPacket[]>("SELECT * FROM products WHERE id = ?", [product_id]);

    if (productRows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = productRows[0];

    // Calculate actual units based on unit type
    const actualUnits = unit_type === "package" && units_per_package > 1 
      ? quantity * units_per_package 
      : quantity;
    
    // Calculate price per individual piece
    const pricePerPiece = unit_type === "package" && units_per_package > 1 
      ? buying_price / units_per_package 
      : buying_price;
    
    const sellingPricePerPiece = unit_type === "package" && units_per_package > 1 
      ? selling_price / units_per_package 
      : selling_price;

    const total_cost = pricePerPiece * actualUnits;

    await connection.beginTransaction();

    // Insert purchase record
    const [purchaseResult] = await connection.query<ResultSetHeader>(
      `INSERT INTO purchases (product_id, quantity, buying_price, total_cost, supplier)
       VALUES (?, ?, ?, ?, ?)`,
      [product_id, actualUnits, pricePerPiece, total_cost, supplier || null]
    );

    // Update product stock, buying price (weighted average), selling price, and unit conversion settings
    await connection.query(
      `UPDATE products 
       SET stock = stock + ?, 
           buying_price = ((buying_price * stock) + (? * ?)) / (stock + ?),
           selling_price = ?,
           unit_type = ?,
           units_per_package = ?,
           package_name = ?
       WHERE id = ?`,
      [
        actualUnits, 
        pricePerPiece, 
        actualUnits, 
        actualUnits, 
        sellingPricePerPiece,
        unit_type || 'piece',
        units_per_package || 1,
        package_name || null,
        product_id
      ]
    );

    await connection.commit();

    const [newPurchase] = await connection.query<RowDataPacket[]>(`
      SELECT 
        pu.id,
        pu.product_id,
        pu.quantity,
        pu.buying_price,
        pu.total_cost,
        pu.supplier,
        pu.purchase_date,
        p.name as product_name
      FROM purchases pu
      JOIN products p ON pu.product_id = p.id
      WHERE pu.id = ?
    `, [purchaseResult.insertId]);

    return NextResponse.json(newPurchase[0], { status: 201 });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating purchase:", error);
    return NextResponse.json({ error: "Failed to create purchase" }, { status: 500 });
  } finally {
    connection.release();
  }
}
