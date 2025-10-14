import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-mysql";
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export const dynamic = "force-dynamic";

// GET all sales
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        s.id,
        s.product_id,
        s.quantity,
        s.selling_price,
        s.total_price,
        s.profit,
        s.sale_date,
        p.name as product_name
      FROM sales s
      JOIN products p ON s.product_id = p.id
      ORDER BY s.sale_date DESC
    `);
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
  }
}

// POST new sale
export async function POST(request: NextRequest) {
  const connection = await pool.getConnection();
  
  try {
    const body = await request.json();
    const { product_id, quantity, custom_selling_price } = body;

    if (!product_id || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Valid product_id and quantity are required" },
        { status: 400 }
      );
    }

    // Get product details
    const [productRows] = await connection.query<RowDataPacket[]>("SELECT * FROM products WHERE id = ?", [product_id]);

    if (productRows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = productRows[0];

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: `Insufficient stock. Available: ${product.stock}` },
        { status: 400 }
      );
    }

    // Use custom selling price if provided, otherwise use product's default selling price
    const selling_price = custom_selling_price !== undefined && custom_selling_price !== null 
      ? custom_selling_price 
      : product.selling_price;

    const total_price = selling_price * quantity;
    const profit = (selling_price - product.buying_price) * quantity;

    // Warning flag for below-cost sales
    const isBelowCost = selling_price < product.buying_price;

    await connection.beginTransaction();

    // Insert sale
    const [saleResult] = await connection.query<ResultSetHeader>(
      `INSERT INTO sales (product_id, quantity, selling_price, total_price, profit)
       VALUES (?, ?, ?, ?, ?)`,
      [product_id, quantity, selling_price, total_price, profit]
    );

    // Update stock
    await connection.query(
      `UPDATE products 
       SET stock = stock - ?
       WHERE id = ?`,
      [quantity, product_id]
    );

    await connection.commit();

    const [newSale] = await connection.query<RowDataPacket[]>(`
      SELECT 
        s.id,
        s.product_id,
        s.quantity,
        s.selling_price,
        s.total_price,
        s.profit,
        s.sale_date,
        p.name as product_name
      FROM sales s
      JOIN products p ON s.product_id = p.id
      WHERE s.id = ?
    `, [saleResult.insertId]);

    return NextResponse.json({ 
      ...newSale[0], 
      warning: isBelowCost ? "Warning: Selling price is below buying price!" : null,
      buying_price: product.buying_price
    }, { status: 201 });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating sale:", error);
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 });
  } finally {
    connection.release();
  }
}
