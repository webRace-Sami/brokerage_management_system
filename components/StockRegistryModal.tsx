'use client';

import React, { useState } from 'react';
import { X, Settings2, Plus, Package, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { StockItemData, UserProfile } from '@/lib/types';

interface StockRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  stockItems: StockItemData[];
  currentUser: UserProfile | null;
}

export default function StockRegistryModal({
  isOpen,
  onClose,
  onSuccess,
  stockItems,
  currentUser,
}: StockRegistryModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [standardBagWeightKg, setStandardBagWeightKg] = useState<number | ''>(50);
  const [unitPricePkr, setUnitPricePkr] = useState<number | ''>('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'ADMIN';

  const handleCreateStockItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code || !name || !unitPricePkr) {
      setError('Please provide IRN Code, Item Name, and Base Unit Price.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/stock-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name,
          category,
          standardBagWeightKg: Number(standardBagWeightKg) || 50,
          unitPricePkr: Number(unitPricePkr),
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create Master Stock IRN item.');
      }

      setShowAddForm(false);
      setCode('');
      setName('');
      setCategory('');
      setUnitPricePkr('');
      setDescription('');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-['Outfit']">
                Posting IRN & Stock Master Registry (سٹاک رجسٹر)
              </h3>
              <p className="text-xs text-slate-400">
                Pre-configured standard commodities & prices for fast Munshi dispatching
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Active Commodities in Registry:{' '}
              <strong className="text-slate-800 font-mono text-sm">{stockItems.length}</strong>
            </div>

            {isAdmin && !showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New IRN Commodity</span>
              </button>
            )}
          </div>

          {/* Add Form (Admin only) */}
          {showAddForm && (
            <form
              onSubmit={handleCreateStockItem}
              className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <span className="text-xs font-extrabold text-indigo-900 uppercase">
                  Register New Standard IRN Item
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Cancel
                </button>
              </div>

              {error && (
                <div className="p-2.5 bg-red-100 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    IRN Code (e.g. IRN-OIL-06)
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="IRN-..."
                    className="w-full px-2.5 py-1.5 text-xs border border-indigo-200 rounded-lg uppercase font-mono"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    Commodity Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cooking Oil / Ghee Drums"
                    className="w-full px-2.5 py-1.5 text-xs border border-indigo-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Edible Oils"
                    className="w-full px-2.5 py-1.5 text-xs border border-indigo-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    Std Bag/Pack Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={standardBagWeightKg}
                    onChange={(e) => setStandardBagWeightKg(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-2.5 py-1.5 text-xs border border-indigo-200 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    Base Rate (PKR / Bag)
                  </label>
                  <input
                    type="number"
                    value={unitPricePkr}
                    onChange={(e) => setUnitPricePkr(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 6500"
                    className="w-full px-2.5 py-1.5 text-xs border border-indigo-200 rounded-lg font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                  Description / Specifications
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Standard packing details..."
                  className="w-full px-2.5 py-1.5 text-xs border border-indigo-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm transition-all"
                >
                  {loading ? 'Saving...' : 'Save IRN Commodity'}
                </button>
              </div>
            </form>
          )}

          {/* List of Registered Stock Items */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">IRN Code</th>
                  <th className="py-2.5 px-4">Commodity / Material</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Standard Weight</th>
                  <th className="py-2.5 px-3 text-right">Base Price (PKR)</th>
                  <th className="py-2.5 px-3 text-right">Current Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {stockItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">
                      {item.code}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {item.category}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      {item.standardBagWeightKg} kg
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      PKR {item.unitPricePkr.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {item.availableBags} Bags
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {isAdmin ? (
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Admin Authorized to add & update IRN items
              </span>
            ) : (
              <span>* Read-only view for Munshi Staff</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
