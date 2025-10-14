"use client";

import { Product } from "@/types";
import { useState } from "react";

interface ProductFormProps {
  onSubmitAction: (product: Omit<Product, "id" | "created_at" | "updated_at">) => void;
  initialData?: Product;
  onCancelAction?: () => void;
}

export default function ProductForm({ onSubmitAction, initialData, onCancelAction }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // When creating/editing product, set minimal defaults
    onSubmitAction({
      ...formData,
      buying_price: initialData?.buying_price || 0,
      selling_price: initialData?.selling_price || 0,
      stock: initialData?.stock || 0,
      unit_type: initialData?.unit_type || "piece",
      units_per_package: initialData?.units_per_package || 1,
      package_name: initialData?.package_name || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Product Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="e.g., Electronics, Groceries, Clothing"
        />
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>💡 Note:</strong> After creating the product, use the <strong>"Stock Management"</strong> tab to add inventory with buying and selling prices.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          {initialData ? "Update Product" : "Add Product"}
        </button>
        {onCancelAction && (
          <button
            type="button"
            onClick={onCancelAction}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
