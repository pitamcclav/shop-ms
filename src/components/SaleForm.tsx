"use client";

import { Product } from "@/types";
import { useState } from "react";

interface SaleFormProps {
  products: Product[];
  onSubmitAction: (sale: { product_id: number; quantity: number; custom_selling_price?: number }) => void;
}

export default function SaleForm({ products, onSubmitAction }: SaleFormProps) {
  const [formData, setFormData] = useState({
    product_id: 0,
    quantity: 1,
    custom_selling_price: 0,
  });

  const selectedProduct = products.find((p) => p.id === formData.product_id);
  const sellingPrice = formData.custom_selling_price || selectedProduct?.selling_price || 0;
  const isBelowCost = selectedProduct && sellingPrice < selectedProduct.buying_price;
  const profit = selectedProduct ? (sellingPrice - selectedProduct.buying_price) * formData.quantity : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.product_id > 0) {
      if (isBelowCost) {
        const confirmed = confirm(
          `⚠️ WARNING: You're selling below cost!\n\n` +
          `Buying Price: $${selectedProduct.buying_price.toFixed(2)}\n` +
          `Selling Price: $${sellingPrice.toFixed(2)}\n` +
          `Loss per unit: $${(selectedProduct.buying_price - sellingPrice).toFixed(2)}\n` +
          `Total Loss: $${((selectedProduct.buying_price - sellingPrice) * formData.quantity).toFixed(2)}\n\n` +
          `Do you want to continue?`
        );
        if (!confirmed) return;
      }

      onSubmitAction({
        product_id: formData.product_id,
        quantity: formData.quantity,
        custom_selling_price: formData.custom_selling_price || undefined,
      });
      setFormData({ product_id: 0, quantity: 1, custom_selling_price: 0 });
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
              custom_selling_price: product?.selling_price || 0,
            });
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        >
          <option value={0}>-- Select a product --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - ${product.selling_price.toFixed(2)} (Stock: {product.stock})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Quantity *</label>
        <input
          type="number"
          required
          min="1"
          max={selectedProduct?.stock || 999}
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
      </div>

      {selectedProduct && (
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Selling Price (per unit) * 
            <span className="text-xs text-gray-500 ml-2">
              (Recommended: ${selectedProduct.selling_price.toFixed(2)})
            </span>
          </label>
          <input
            type="number"
            step="0.01"
            required
            min="0"
            value={formData.custom_selling_price || selectedProduct.selling_price}
            onChange={(e) => setFormData({ ...formData, custom_selling_price: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 You can adjust the price for discounts or special customers
          </p>
        </div>
      )}

      {selectedProduct && (
        <div className={`p-4 rounded-md border ${isBelowCost ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}>
          <p className="text-sm font-medium text-gray-700 mb-2">Sale Summary:</p>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Buying Price: <span className="font-semibold">${selectedProduct.buying_price.toFixed(2)}</span></p>
            <p>Selling Price: <span className="font-semibold">${sellingPrice.toFixed(2)}</span></p>
            <p>Profit per Unit: <span className={`font-semibold ${profit < 0 ? 'text-red-600' : 'text-green-600'}`}>
              ${((sellingPrice - selectedProduct.buying_price)).toFixed(2)}
            </span></p>
            <p className="pt-2 border-t border-gray-300">Total Sale: <span className="font-semibold">${(sellingPrice * formData.quantity).toFixed(2)}</span></p>
            <p className={profit < 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
              Total {profit < 0 ? 'Loss' : 'Profit'}: ${Math.abs(profit).toFixed(2)}
            </p>
            <p>Remaining Stock: <span className="font-semibold">{selectedProduct.stock - formData.quantity}</span></p>
          </div>
          {isBelowCost && (
            <div className="mt-3 p-2 bg-red-100 rounded border border-red-400">
              <p className="text-red-800 font-bold text-sm">⚠️ WARNING: SELLING BELOW COST!</p>
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={formData.product_id === 0}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Record Sale
      </button>
    </form>
  );
}
