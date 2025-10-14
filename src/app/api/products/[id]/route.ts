import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db-mysql";
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export const dynamic = "force-dynamic";

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM products WHERE id = ?", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, buying_price, selling_price, stock, category, unit_type, units_per_package, package_name } = body;

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE products 
       SET name = ?, description = ?, buying_price = ?, selling_price = ?, stock = ?, category = ?, 
           unit_type = ?, units_per_package = ?, package_name = ?
       WHERE id = ?`,
      [
        name, 
        description || null, 
        buying_price || 0, 
        selling_price, 
        stock, 
        category || null,
        unit_type || 'piece',
        units_per_package || 1,
        package_name || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const [updatedProduct] = await pool.query<RowDataPacket[]>("SELECT * FROM products WHERE id = ?", [id]);
    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
