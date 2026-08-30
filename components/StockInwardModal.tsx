'use client';

import React, { useState } from 'react';
import { X, PackagePlus, Building2, Check, ShieldAlert } from 'lucide-react';
import { StockItemData } from '@/lib/types';

interface StockInwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  stockItems: StockItemData[];
}

export default function StockInwardModal({
  isOpen,
  onClose,
  onSuccess,
  stockItems,
}: StockInwardModalProps) {
  const [stockItemId, setStockItemId] = useState('');
  const [quantityBags, setQuantityBags] = useState<number | ''>('');
  const [supplierName, setSupplierName] = useState('Punjab Agro Corp & Chiniot Farmers');
  const [vehicleNo, setVehicleNo] = useState('');
  const [warehouseLocation, setWarehouseLocation] = useState('Sargodha Road Main Godown #1, Chiniot');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedItem = stockItems.find((s) => s.id === stockItemId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stockItemId) {
      setError('Please select a Stock Item to restock.');
      return;
    }
    if (!quantityBags || Number(quantityBags) <= 0) {
      setError('Please enter a valid bag quantity.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/stock-inward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockItemId,
          quantityBags: Number(quantityBags),
          supplierName,
          vehicleNo,
          warehouseLocation,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to record stock inward.');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-['Outfit']">
                Stock Inward / Restock (مال آمد گودام)
              </h3>
              <p className="text-xs text-slate-400">Add fresh inventory to Main-Broker godowns</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Material / Commodity <span className="text-red-500">*</span>
            </label>
            <select
              value={stockItemId}
              onChange={(e) => setStockItemId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              required
            >
              <option value="">-- Select Master Stock Item --</option>
              {stockItems.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.code}] {s.name} (Current: {s.availableBags} Bags)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Fresh Quantity (Bags / Nugs / Pcs) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={quantityBags}
              onChange={(e) => setQuantityBags(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 500"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
              required
            />
            {selectedItem && quantityBags && (
              <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                <span>Weight: ~{(Number(quantityBags) * selectedItem.standardBagWeightKg) / 40} Maunds</span>
                <span className="font-semibold text-emerald-600">
                  Value: PKR {(Number(quantityBags) * selectedItem.unitPricePkr).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Supplier / Source Name
            </label>
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="e.g. Punjab Agro Corp, Chiniot Sugar Mills"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Inward Vehicle No.
              </label>
              <input
                type="text"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                placeholder="e.g. TLA-9912"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Godown Location
              </label>
              <input
                type="text"
                value={warehouseLocation}
                onChange={(e) => setWarehouseLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {loading ? 'Adding Stock...' : (
              <>
                <Check className="w-4 h-4" />
                <span>Add Inward Stock</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
