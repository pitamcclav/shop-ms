import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-mysql";
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export const dynamic = "force-dynamic";

// GET all products
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM products ORDER BY created_at DESC");
    const products = rows.map(row => ({
      ...row,
      buying_price: parseFloat(row.buying_price as string),
      selling_price: parseFloat(row.selling_price as string),
    }));
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, buying_price, selling_price, stock, category, unit_type, units_per_package, package_name } = body;

    if (!name || selling_price === undefined) {
      return NextResponse.json(
        { error: "Name and selling_price are required" },
        { status: 400 }
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO products (name, description, buying_price, selling_price, stock, category, unit_type, units_per_package, package_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        description || null, 
        buying_price || 0, 
        selling_price, 
        stock || 0, 
        category || null,
        unit_type || 'piece',
        units_per_package || 1,
        package_name || null
      ]
    );

    const [newProduct] = await pool.query<RowDataPacket[]>("SELECT * FROM products WHERE id = ?", [result.insertId]);

    const product = {
      ...newProduct[0],
      buying_price: parseFloat(newProduct[0].buying_price as string),
      selling_price: parseFloat(newProduct[0].selling_price as string),
    };

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
