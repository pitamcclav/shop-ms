import { NextResponse } from "next/server";
import pool from "@/lib/db-mysql";
import type { RowDataPacket } from 'mysql2';

export const dynamic = "force-dynamic";

// GET dashboard statistics
export async function GET() {
  try {
    // Total products
    const [totalProducts] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM products");
    
    // Total sales
    const [totalSales] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM sales");
    
    // Total revenue and profit
    const [revenue] = await pool.query<RowDataPacket[]>("SELECT SUM(total_price) as total, SUM(profit) as profit FROM sales");
    
    // Total cost (purchases)
    const [cost] = await pool.query<RowDataPacket[]>("SELECT SUM(total_cost) as total FROM purchases");
    
    // Low stock products (stock < 10)
    const [lowStock] = await pool.query<RowDataPacket[]>("SELECT * FROM products WHERE stock < 10 ORDER BY stock ASC");
    
    // Recent sales
    const [recentSales] = await pool.query<RowDataPacket[]>(`
      SELECT 
        s.id,
        s.quantity,
        s.selling_price,
        s.total_price,
        s.profit,
        s.sale_date,
        p.name as product_name
      FROM sales s
      JOIN products p ON s.product_id = p.id
      ORDER BY s.sale_date DESC
      LIMIT 10
    `);

    // Recent purchases
    const [recentPurchases] = await pool.query<RowDataPacket[]>(`
      SELECT 
        pu.id,
        pu.quantity,
        pu.buying_price,
        pu.total_cost,
        pu.supplier,
        pu.purchase_date,
        p.name as product_name
      FROM purchases pu
      JOIN products p ON pu.product_id = p.id
      ORDER BY pu.purchase_date DESC
      LIMIT 10
    `);

    // Sales by category
    const [salesByCategory] = await pool.query<RowDataPacket[]>(`
      SELECT 
        p.category,
        SUM(s.quantity) as total_quantity,
        SUM(s.total_price) as total_revenue,
        SUM(s.profit) as total_profit
      FROM sales s
      JOIN products p ON s.product_id = p.id
      WHERE p.category IS NOT NULL
      GROUP BY p.category
      ORDER BY total_revenue DESC
    `);

    return NextResponse.json({
      totalProducts: totalProducts[0].count,
      totalSales: totalSales[0].count,
      totalRevenue: revenue[0].total || 0,
      totalProfit: revenue[0].profit || 0,
      totalCost: cost[0].total || 0,
      lowStockProducts: lowStock,
      recentSales,
      recentPurchases,
      salesByCategory,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
  }
}
