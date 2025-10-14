"use client";

import { Product } from "@/types";
import { useState } from "react";

interface PurchaseFormProps {
  products: Product[];
  onSubmitAction: (purchase: { 
    product_id: number; 
    quantity: number; 
    buying_price: number; 
    selling_price: number; 
    supplier: string;
    unit_type: string;
    units_per_package: number;
    package_name: string;
  }) => void;
}

export default function PurchaseForm({ products, onSubmitAction }: PurchaseFormProps) {
  const [formData, setFormData] = useState({
    product_id: 0,
    quantity: 1,
    buying_price: 0,
    selling_price: 0,
    supplier: "",
    unit_type: "piece" as string,
    units_per_package: 1,
    package_name: "",
  });

  const selectedProduct = products.find((p) => p.id === formData.product_id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.product_id > 0 && formData.buying_price > 0 && formData.selling_price > 0) {
      onSubmitAction(formData);
      setFormData({ 
        product_id: 0, 
        quantity: 1, 
        buying_price: 0, 
        selling_price: 0, 
        supplier: "",
        unit_type: "piece",
        units_per_package: 1,
        package_name: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Select Product *</label>
        <select
          required
          value={formData.product_id}
          onChange={(e) => {
            const productId = parseInt(e.target.value);
            const product = products.find((p) => p.id === productId);
            setFormData({ 
              ...formData, 
              product_id: productId,
              buying_price: product?.buying_price || 0,
              selling_price: product?.selling_price || 0,
              unit_type: product?.unit_type || "piece",
              units_per_package: product?.units_per_package || 1,
              package_name: product?.package_name || "",
            });
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        >
          <option value={0}>-- Select a product --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - Current Stock: {product.stock}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Quantity *</label>
          <input
            type="number"
            required
            min="1"
            value={formData.quantity || ""}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Buying Price (per unit) *</label>
          <input
            type="number"
            step="0.01"
            required
            min="0.01"
            value={formData.buying_price || ""}
            onChange={(e) => setFormData({ ...formData, buying_price: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Selling Price (intended per unit) *</label>
        <input
          type="number"
          step="0.01"
          required
          min="0.01"
          value={formData.selling_price || ""}
          onChange={(e) => setFormData({ ...formData, selling_price: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
        <p className="text-xs text-gray-500 mt-1">
          💡 This will be the default selling price when making sales
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Supplier (Optional)</label>
        <input
          type="text"
          value={formData.supplier}
          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="Enter supplier name"
        />
      </div>

      {/* Unit Conversion Section */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">📦 Bulk Package Settings (Optional)</h3>
        <p className="text-xs text-gray-500 mb-3">
          If you buy in bulk (boxes/cartons) but sell individual pieces, set this up once and it will be remembered for this product.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Buy/Sell As</label>
            <select
              value={formData.unit_type}
              onChange={(e) => setFormData({ ...formData, unit_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="piece">Individual Pieces</option>
              <option value="package">Bulk Packages (Box/Carton)</option>
            </select>
          </div>

          {formData.unit_type === "package" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Units per Package *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.units_per_package || ""}
                  onChange={(e) => setFormData({ ...formData, units_per_package: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="e.g., 24"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">Package Name</label>
                <input
                  type="text"
                  value={formData.package_name}
                  onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="e.g., Box, Carton, Case"
                />
              </div>
            </>
          )}
        </div>

        {formData.unit_type === "package" && formData.units_per_package > 1 && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-xs text-gray-700">
              💡 <strong>Conversion:</strong> You're buying {formData.quantity} {formData.package_name || 'package'}(s) × {formData.units_per_package} pieces = <span className="font-semibold">{formData.quantity * formData.units_per_package} individual pieces</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Price per piece: ${(formData.buying_price / formData.units_per_package).toFixed(2)} buying | ${(formData.selling_price / formData.units_per_package).toFixed(2)} selling
            </p>
          </div>
        )}
      </div>

      {selectedProduct && formData.buying_price > 0 && formData.selling_price > 0 && (
        <div className={`p-4 rounded-md border ${formData.buying_price > formData.selling_price ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
          <p className="text-sm font-medium mb-2 text-gray-700">Purchase Summary:</p>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Total Cost: <span className="font-semibold">${(formData.buying_price * formData.quantity).toFixed(2)}</span></p>
            <p>New Stock: <span className="font-semibold">{selectedProduct.stock + formData.quantity}</span></p>
            <p>Current Avg. Buying Price: <span className="font-semibold">${selectedProduct.buying_price.toFixed(2)}</span></p>
            <p>Selling Price: <span className="font-semibold">${formData.selling_price.toFixed(2)}</span></p>
            <p>Expected Profit per Unit: <span className={`font-semibold ${formData.selling_price > formData.buying_price ? 'text-green-600' : 'text-red-600'}`}>
              ${(formData.selling_price - formData.buying_price).toFixed(2)} ({((formData.selling_price - formData.buying_price) / formData.selling_price * 100).toFixed(1)}%)
            </span></p>
            {formData.buying_price > formData.selling_price && (
              <p className="text-red-600 font-semibold mt-2">⚠️ Warning: Buying price is higher than selling price!</p>
            )}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={formData.product_id === 0 || formData.buying_price <= 0 || formData.selling_price <= 0}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Add Stock (Purchase)
      </button>
    </form>
  );
}
