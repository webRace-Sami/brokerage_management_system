'use client';

import React, { useState } from 'react';
import { X, Layers, Plus, Edit2, Trash2, ShieldCheck, AlertCircle, Check, Package } from 'lucide-react';
import { StockTypeData, UserProfile } from '@/lib/types';

interface StockTypesManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  stockTypes: StockTypeData[];
  currentUser: UserProfile | null;
}

export default function StockTypesManagementModal({
  isOpen,
  onClose,
  onSuccess,
  stockTypes,
  currentUser,
}: StockTypesManagementModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Grains & Agriculture');
  const [defaultUnit, setDefaultUnit] = useState<'Bags' | 'Nugs' | 'Box' | 'Drums' | 'Bales' | 'Pcs'>('Bags');
  const [standardWeightKg, setStandardWeightKg] = useState<number | ''>(50);
  const [defaultUnitPricePkr, setDefaultUnitPricePkr] = useState<number | ''>(6000);
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.username === 'admin';

  const resetForm = () => {
    setName('');
    setNameUrdu('');
    setCode('');
    setCategory('Grains & Agriculture');
    setDefaultUnit('Bags');
    setStandardWeightKg(50);
    setDefaultUnitPricePkr(6000);
    setDescription('');
    setError(null);
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleStartEdit = (st: StockTypeData) => {
    setEditingId(st.id);
    setName(st.name);
    setNameUrdu(st.nameUrdu || '');
    setCode(st.code);
    setCategory(st.category);
    setDefaultUnit(st.defaultUnit);
    setStandardWeightKg(st.standardWeightKg);
    setDefaultUnitPricePkr(st.defaultUnitPricePkr);
    setDescription(st.description || '');
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setError('Admin permission required.');
      return;
    }

    setError(null);
    if (!name.trim()) {
      setError('Please provide Stock Type Name.');
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        const res = await fetch(`/api/stock-types/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            nameUrdu: nameUrdu || name,
            code: code || `ST-${name.slice(0, 3).toUpperCase()}`,
            category,
            defaultUnit,
            standardWeightKg: Number(standardWeightKg) || 50,
            defaultUnitPricePkr: Number(defaultUnitPricePkr) || 5000,
            description,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update stock type.');
      } else {
        const res = await fetch('/api/stock-types', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            nameUrdu: nameUrdu || name,
            code: code || `ST-${name.slice(0, 3).toUpperCase()}`,
            category,
            defaultUnit,
            standardWeightKg: Number(standardWeightKg) || 50,
            defaultUnitPricePkr: Number(defaultUnitPricePkr) || 5000,
            description,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create stock type.');
      }

      resetForm();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, typeName: string) => {
    if (!confirm(`Are you sure you want to remove stock type "${typeName}"?`)) return;

    try {
      const res = await fetch(`/api/stock-types/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onSuccess();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-['Outfit']">
                Commodity Stock Types Management (اجناس و مال کی اقسام)
              </h3>
              <p className="text-xs text-slate-400">
                Manage Stock Types (Sugar, Oil, Wheat, Rice, Cotton) & Standard Packaging Units
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
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Available Commodity Types: <strong className="text-slate-900 font-mono">{stockTypes.length}</strong>
            </span>

            {isAdmin && !showAddForm && (
              <button
                onClick={() => {
                  resetForm();
                  setShowAddForm(true);
                }}
                className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Stock Type</span>
              </button>
            )}
          </div>

          {/* Form */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                <span className="text-xs font-extrabold text-purple-900 uppercase">
                  {editingId ? 'Edit Stock Type' : 'Add New Commodity Stock Type (e.g. Sugar, Oil, Cotton)'}
                </span>
                <button type="button" onClick={resetForm} className="text-xs text-purple-600 hover:text-purple-800">
                  Cancel
                </button>
              </div>

              {error && (
                <div className="p-2.5 bg-red-100 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="stock_type_name" className="block text-xs font-bold text-slate-700 mb-1">
                    Commodity Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="stock_type_name"
                    name="stockTypeName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sugar (چینی)"
                    className="w-full px-3 py-2 text-xs border border-purple-200 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="stock_type_urdu" className="block text-xs font-bold text-slate-700 mb-1">
                    Urdu Label
                  </label>
                  <input
                    id="stock_type_urdu"
                    name="stockTypeUrdu"
                    type="text"
                    value={nameUrdu}
                    onChange={(e) => setNameUrdu(e.target.value)}
                    placeholder="e.g. چینی ریفائنڈ"
                    className="w-full px-3 py-2 text-xs border border-purple-200 rounded-xl"
                  />
                </div>

                <div>
                  <label htmlFor="stock_type_unit" className="block text-xs font-bold text-slate-700 mb-1">
                    Default Unit Type
                  </label>
                  <select
                    id="stock_type_unit"
                    name="stockTypeUnit"
                    value={defaultUnit}
                    onChange={(e: any) => setDefaultUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-purple-200 rounded-xl"
                  >
                    <option value="Bags">Bags (بوریاں)</option>
                    <option value="Box">Box / Cartons (ڈبے)</option>
                    <option value="Nugs">Nugs (نگ)</option>
                    <option value="Drums">Drums / Cans (ڈرم / کین - for Oil)</option>
                    <option value="Bales">Bales (گانٹھیں - for Cotton)</option>
                    <option value="Pcs">Pcs (پیس)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="stock_type_weight" className="block text-xs font-bold text-slate-700 mb-1">
                    Standard Weight (Kg)
                  </label>
                  <input
                    id="stock_type_weight"
                    name="stockTypeWeight"
                    type="number"
                    value={standardWeightKg}
                    onChange={(e) => setStandardWeightKg(e.target.value ? Number(e.target.value) : '')}
                    placeholder="50"
                    className="w-full px-3 py-2 text-xs border border-purple-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="stock_type_price" className="block text-xs font-bold text-slate-700 mb-1">
                    Default Unit Price (PKR)
                  </label>
                  <input
                    id="stock_type_price"
                    name="stockTypePrice"
                    type="number"
                    value={defaultUnitPricePkr}
                    onChange={(e) => setDefaultUnitPricePkr(e.target.value ? Number(e.target.value) : '')}
                    placeholder="7200"
                    className="w-full px-3 py-2 text-xs border border-purple-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="stock_type_category" className="block text-xs font-bold text-slate-700 mb-1">
                    Category Group
                  </label>
                  <input
                    id="stock_type_category"
                    name="stockTypeCategory"
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Food & Sweeteners"
                    className="w-full px-3 py-2 text-xs border border-purple-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Type' : 'Save Stock Type'}
                </button>
              </div>
            </form>
          )}

          {/* List Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3.5">Commodity Name & Urdu</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-center">Default Unit</th>
                  <th className="py-3 px-3 text-right">Std Weight</th>
                  <th className="py-3 px-3 text-right">Unit Price (PKR)</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {stockTypes.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-slate-900">{st.name}</div>
                      <div className="text-[11px] text-slate-500 font-sans">{st.nameUrdu}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{st.category}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
                        {st.defaultUnit}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold">{st.standardWeightKg} kg</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                      PKR {st.defaultUnitPricePkr.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleStartEdit(st)}
                          className="p-1.5 text-slate-600 hover:text-purple-700 bg-slate-100 hover:bg-purple-50 rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(st.id, st.name)}
                          className="p-1.5 text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Admin-only configuration for transport commodity catalog</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
