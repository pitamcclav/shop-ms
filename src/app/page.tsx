"use client";

import { useEffect, useState } from "react";
import ProductForm from "@/components/ProductForm";
import SaleForm from "@/components/SaleForm";
import PurchaseForm from "@/components/PurchaseForm";
import { Product, Sale, Purchase, Stats } from "@/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "stock" | "sales">("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const fetchSales = async () => {
    const res = await fetch("/api/sales");
    const data = await res.json();
    setSales(data);
  };

  const fetchPurchases = async () => {
    const res = await fetch("/api/purchases");
    const data = await res.json();
    setPurchases(data);
  };

  const fetchStats = async () => {
    const res = await fetch("/api/stats");
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchSales();
    fetchPurchases();
    fetchStats();
  }, []);

  const handleAddProduct = async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      fetchProducts();
      fetchStats();
      setShowProductForm(false);
    }
  };

  const handleUpdateProduct = async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
    if (!editingProduct) return;

    const res = await fetch(`/api/products/${editingProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      fetchProducts();
      fetchStats();
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchProducts();
      fetchStats();
    }
  };

  const handleAddSale = async (sale: { product_id: number; quantity: number; custom_selling_price?: number }) => {
    const res = await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sale),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.warning) {
        alert(result.warning);
      }
      fetchSales();
      fetchProducts();
      fetchStats();
    } else {
      const error = await res.json();
      alert(error.error || "Failed to record sale");
    }
  };

  const handleAddPurchase = async (purchase: { 
    product_id: number; 
    quantity: number; 
    buying_price: number; 
    selling_price: number; 
    supplier: string;
    unit_type: string;
    units_per_package: number;
    package_name: string;
  }) => {
    const res = await fetch("/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(purchase),
    });

    if (res.ok) {
      fetchPurchases();
      fetchProducts();
      fetchStats();
    } else {
      const error = await res.json();
      alert(error.error || "Failed to record purchase");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Shop Management System</h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "dashboard"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "products"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("stock")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "stock"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Stock Management
            </button>
            <button
              onClick={() => setActiveTab("sales")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "sales"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Sales
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalSales}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  UGX {Math.round(stats.totalRevenue)}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg shadow p-6 border border-green-200">
                <h3 className="text-green-700 text-sm font-medium">Total Profit</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  UGX {Math.round(stats.totalProfit)}
                </p>
              </div>
            </div>

            {/* Low Stock Alert */}
            {stats.lowStockProducts.length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Low Stock Alert</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc list-inside space-y-1">
                        {stats.lowStockProducts.map((product) => (
                          <li key={product.id}>
                            {product.name} - Only {product.stock} left
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Sales */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Recent Sales</h2>
              </div>
              <div className="p-6">
                {stats.recentSales.length === 0 ? (
                  <p className="text-gray-500">No sales yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Selling Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Profit
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {stats.recentSales.map((sale) => (
                          <tr key={sale.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{sale.product_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{sale.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              UGX {Math.round(sale.selling_price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              UGX {Math.round(sale.total_price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={sale.profit < 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                                UGX {Math.round(sale.profit)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {new Date(sale.sale_date).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-700">Products</h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Add Product
              </button>
            </div>

            {/* Add/Edit Product Form */}
            {(showProductForm || editingProduct) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <ProductForm
                  onSubmitAction={editingProduct ? handleUpdateProduct : handleAddProduct}
                  initialData={editingProduct || undefined}
                  onCancelAction={() => {
                    setEditingProduct(null);
                    setShowProductForm(false);
                  }}
                />
              </div>
            )}

            {/* Products List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Buying Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Selling Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Margin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Unit Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => {
                      const margin = ((product.selling_price - product.buying_price) / product.selling_price * 100).toFixed(1);
                      const isProfit = product.selling_price > product.buying_price;
                      return (
                      <tr key={product.id}>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            {product.description && (
                              <div className="text-sm text-gray-500">{product.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.category || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          UGX {Math.round(product.buying_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          UGX {Math.round(product.selling_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={isProfit ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                            {isProfit ? margin + '%' : 'LOSS'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              product.stock < 10
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {product.unit_type === "package" && product.units_per_package > 1 ? (
                            <span className="text-xs">
                              📦 {product.package_name || "Package"} <br/>
                              ({product.units_per_package} pieces)
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Individual</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Stock Management Tab */}
        {activeTab === "stock" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Stock Management</h2>

            {/* Add Stock Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Add Stock (Purchase)</h3>
              <PurchaseForm products={products} onSubmitAction={handleAddPurchase} />
            </div>

            {/* Purchase History */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-xl font-semibold">Purchase History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Buying Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Supplier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchases.map((purchase) => (
                      <tr key={purchase.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{purchase.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{purchase.product_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{purchase.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          UGX {Math.round(purchase.buying_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold">
                          UGX {Math.round(purchase.total_cost)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {purchase.supplier || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(purchase.purchase_date).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Sales</h2>

            {/* Record Sale Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Record New Sale</h3>
              <SaleForm products={products} onSubmitAction={handleAddSale} />
            </div>

            {/* Sales History */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-xl font-semibold">Sales History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Selling Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Profit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sales.map((sale) => (
                      <tr key={sale.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{sale.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{sale.product_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{sale.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          UGX {Math.round(sale.selling_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold">
                          UGX {Math.round(sale.total_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={sale.profit < 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                            UGX {Math.round(sale.profit)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(sale.sale_date).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
