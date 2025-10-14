export interface Product {
  id: number;
  name: string;
  description: string | null;
  buying_price: number;
  selling_price: number;
  stock: number;
  category: string | null;
  unit_type: string;
  units_per_package: number;
  package_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: number;
  product_id: number;
  quantity: number;
  buying_price: number;
  total_cost: number;
  supplier: string | null;
  purchase_date: string;
  product_name?: string;
}

export interface Sale {
  id: number;
  product_id: number;
  quantity: number;
  selling_price: number;
  total_price: number;
  profit: number;
  sale_date: string;
  product_name?: string;
}

export interface Stats {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  totalCost: number;
  lowStockProducts: Product[];
  recentSales: Sale[];
  recentPurchases: Purchase[];
  salesByCategory: {
    category: string;
    total_quantity: number;
    total_revenue: number;
    total_profit: number;
  }[];
}
