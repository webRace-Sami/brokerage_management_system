'use client';

import React, { useState, useEffect } from 'react';
import { X, Users, Plus, ShieldCheck, Check, Edit2, Trash2, Building, AlertCircle, Link2, Unlink, Coins, Layers } from 'lucide-react';
import { BrokerData, StockTypeData, UserProfile } from '@/lib/types';

interface BrokerManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  brokers: BrokerData[];
  stockTypes: StockTypeData[];
  currentUser: UserProfile | null;
}

export default function BrokerManagementModal({
  isOpen,
  onClose,
  onSuccess,
  brokers,
  stockTypes,
  currentUser,
}: BrokerManagementModalProps) {
  const [localBrokers, setLocalBrokers] = useState<BrokerData[]>(brokers || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBrokerId, setEditingBrokerId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<'MAIN_BROKER' | 'CO_BROKER'>('CO_BROKER');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Chiniot');
  const [selectedStockTypes, setSelectedStockTypes] = useState<string[]>(['Sugar (چینی)', 'Wheat (گندم)']);
  const [ownAvailableBags, setOwnAvailableBags] = useState<number | ''>(500);
  const [manualStockValuationPkr, setManualStockValuationPkr] = useState<number | ''>('');
  const [isAttachedToMainBroker, setIsAttachedToMainBroker] = useState(true);
  const [attachedToMainBrokerId, setAttachedToMainBrokerId] = useState('');
  const [allocatedQuotaBags, setAllocatedQuotaBags] = useState<number | ''>(600);
  const [commissionRate, setCommissionRate] = useState<number | ''>(2.0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delete confirmation state
  const [brokerToDelete, setBrokerToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchLocalBrokers = async () => {
    try {
      const res = await fetch('/api/brokers');
      if (res.ok) {
        const data = await res.json();
        if (data.brokers) setLocalBrokers(data.brokers);
      }
    } catch (e) {
      console.error('Failed to reload local brokers', e);
    }
  };

  useEffect(() => {
    if (brokers && brokers.length > 0) {
      setLocalBrokers(brokers);
    }
  }, [brokers]);

  useEffect(() => {
    if (isOpen) {
      fetchLocalBrokers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.username === 'admin';
  const mainBrokers = localBrokers.filter((b) => b.type === 'MAIN_BROKER');

  const resetForm = () => {
    setName('');
    setType('CO_BROKER');
    setPhone('');
    setCity('Chiniot');
    setSelectedStockTypes(['Sugar (چینی)', 'Wheat (گندم)']);
    setOwnAvailableBags(500);
    setManualStockValuationPkr('');
    setIsAttachedToMainBroker(true);
    setAttachedToMainBrokerId(mainBrokers[0]?.id || '');
    setAllocatedQuotaBags(600);
    setCommissionRate(2.0);
    setError(null);
    setShowAddForm(false);
    setEditingBrokerId(null);
  };

  const handleStartEdit = (b: BrokerData) => {
    setEditingBrokerId(b.id);
    setName(b.name);
    setType(b.type);
    setPhone(b.phone);
    setCity(b.city);
    setSelectedStockTypes(b.stockTypes || ['Sugar (چینی)']);
    setOwnAvailableBags(b.ownAvailableBags || 0);
    setManualStockValuationPkr(b.manualStockValuationPkr !== undefined ? b.manualStockValuationPkr : '');
    setIsAttachedToMainBroker(b.isAttachedToMainBroker !== undefined ? b.isAttachedToMainBroker : true);
    setAttachedToMainBrokerId(b.attachedToMainBrokerId || '');
    setAllocatedQuotaBags(b.allocatedQuotaBags || 0);
    setCommissionRate(b.commissionRate || (b.type === 'MAIN_BROKER' ? 0 : 2.0));
    setShowAddForm(true);
  };

  const toggleStockType = (stName: string) => {
    if (selectedStockTypes.includes(stName)) {
      setSelectedStockTypes(selectedStockTypes.filter((t) => t !== stName));
    } else {
      setSelectedStockTypes([...selectedStockTypes, stName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setError('Admin permission required.');
      return;
    }

    setError(null);
    if (!name.trim() || !phone.trim()) {
      setError('Please provide Broker Name and Phone.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        type,
        phone,
        city,
        stockTypes: selectedStockTypes,
        ownAvailableBags: Number(ownAvailableBags) || 0,
        manualStockValuationPkr: manualStockValuationPkr !== '' ? Number(manualStockValuationPkr) : undefined,
        isAttachedToMainBroker: type === 'MAIN_BROKER' ? true : isAttachedToMainBroker,
        attachedToMainBrokerId: type === 'MAIN_BROKER' ? undefined : attachedToMainBrokerId,
        allocatedQuotaBags: type === 'MAIN_BROKER' ? 0 : (Number(allocatedQuotaBags) || 0),
        commissionRate: type === 'MAIN_BROKER' ? 0 : (Number(commissionRate) || 0),
      };

      let res: Response;
      if (editingBrokerId) {
        res = await fetch(`/api/brokers/${editingBrokerId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/brokers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = { error: text || 'Server response error' };
      }

      if (!res.ok) throw new Error(data.error || `Failed to save broker (Status ${res.status}).`);

      resetForm();
      await fetchLocalBrokers();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error saving broker.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteBroker = async () => {
    if (!brokerToDelete) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/brokers/${brokerToDelete.id}`, { method: 'DELETE' });
      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {}

      if (!res.ok) throw new Error(data.error || 'Failed to delete broker.');
      setBrokerToDelete(null);
      await fetchLocalBrokers();
      onSuccess();
    } catch (e: any) {
      alert(e.message || 'Error removing broker.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-['Outfit']">
                Manage Brokers, Stock Types & Valuations (بروکرز اور اسٹاک مینیجمنٹ)
              </h3>
              <p className="text-xs text-slate-400">
                Admin Panel: Unlimited Main-Brokers & Co-Brokers, Manual PKR Valuation, and Stock Types
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
              Total Registered Brokers: <strong className="text-slate-900 font-mono text-sm">{brokers.length}</strong>
              {' '}(Main-Brokers: {brokers.filter((b) => b.type === 'MAIN_BROKER').length}, Co-Brokers: {brokers.filter((b) => b.type === 'CO_BROKER').length})
            </div>

            {isAdmin && !showAddForm && (
              <button
                onClick={() => {
                  resetForm();
                  setShowAddForm(true);
                }}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Broker (Main or Co-Broker)</span>
              </button>
            )}
          </div>

          {/* Add / Edit Form */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <span className="text-xs font-extrabold text-indigo-900 uppercase">
                  {editingBrokerId ? 'Edit Broker, Stock Types & Manual Valuation' : 'Register New Broker (Main-Broker or Co-Broker)'}
                </span>
                <button type="button" onClick={resetForm} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                  Cancel
                </button>
              </div>

              {error && (
                <div className="p-2.5 bg-red-100 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Broker Type Selector */}
                <div>
                  <label htmlFor="broker_type" className="block text-xs font-bold text-slate-700 mb-1">
                    Broker Classification <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="broker_type"
                    name="brokerType"
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold border border-indigo-200 rounded-xl bg-white"
                  >
                    <option value="MAIN_BROKER">👑 Main-Broker (Primary Inventory Owner)</option>
                    <option value="CO_BROKER">🤝 Co-Broker (Associate / Regional Broker)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="broker_name" className="block text-xs font-bold text-slate-700 mb-1">
                    Broker Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="broker_name"
                    name="brokerName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Haji Rasheed & Sons"
                    className="w-full px-3 py-2 text-xs border border-indigo-200 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="broker_phone" className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / Mobile <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="broker_phone"
                    name="brokerPhone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full px-3 py-2 text-xs border border-indigo-200 rounded-xl font-mono"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="broker_city" className="block text-xs font-bold text-slate-700 mb-1">
                    Base City / Market
                  </label>
                  <input
                    id="broker_city"
                    name="brokerCity"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Chiniot, Lahore, Faisalabad"
                    className="w-full px-3 py-2 text-xs border border-indigo-200 rounded-xl"
                  />
                </div>

                {/* Own Stock Quantity */}
                <div>
                  <label htmlFor="broker_own_bags" className="block text-xs font-bold text-slate-700 mb-1">
                    Registered Stock Quantity (Bags / Nugs)
                  </label>
                  <input
                    id="broker_own_bags"
                    name="ownAvailableBags"
                    type="number"
                    value={ownAvailableBags}
                    onChange={(e) => setOwnAvailableBags(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 1500"
                    className="w-full px-3 py-2 text-xs border border-indigo-200 rounded-xl font-mono font-bold"
                  />
                </div>

                {/* Manual Stock Valuation in PKR */}
                <div>
                  <label htmlFor="broker_manual_valuation" className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Manual Stock Valuation (PKR)</span>
                    <Coins className="w-3 h-3 text-amber-500" />
                  </label>
                  <input
                    id="broker_manual_valuation"
                    name="manualStockValuationPkr"
                    type="number"
                    value={manualStockValuationPkr}
                    onChange={(e) => setManualStockValuationPkr(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 12500000 (Optional Manual Price)"
                    className="w-full px-3 py-2 text-xs border border-amber-300 rounded-xl font-mono font-bold text-amber-800 bg-amber-50/50"
                  />
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Leave blank to auto-calculate from standard commodity rates.
                  </span>
                </div>

                {/* Co-Broker Specific Settings */}
                {type === 'CO_BROKER' && (
                  <>
                    <div>
                      <label htmlFor="broker_quota_bags" className="block text-xs font-bold text-slate-700 mb-1">
                        Main-Broker Quota (Bags)
                      </label>
                      <input
                        id="broker_quota_bags"
                        name="allocatedQuotaBags"
                        type="number"
                        value={allocatedQuotaBags}
                        onChange={(e) => setAllocatedQuotaBags(e.target.value ? Number(e.target.value) : '')}
                        placeholder="e.g. 800"
                        className="w-full px-3 py-2 text-xs border border-indigo-200 rounded-xl font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label htmlFor="broker_attached_main" className="block text-xs font-bold text-slate-700 mb-1">
                        Attach to which Main-Broker?
                      </label>
                      <select
                        id="broker_attached_main"
                        name="attachedToMainBrokerId"
                        value={attachedToMainBrokerId}
                        onChange={(e) => setAttachedToMainBrokerId(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-indigo-200 rounded-xl bg-white"
                      >
                        <option value="">-- Select Main-Broker --</option>
                        {mainBrokers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="broker_commission_rate" className="block text-xs font-bold text-slate-700 mb-1">
                        Commission Rate (%)
                      </label>
                      <input
                        id="broker_commission_rate"
                        name="commissionRate"
                        type="number"
                        step="0.1"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(e.target.value ? Number(e.target.value) : '')}
                        placeholder="2.0"
                        className="w-full px-3 py-2 text-xs border border-indigo-200 rounded-xl font-mono"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Stock Types Multi-Select Badges */}
              <div className="bg-white p-3.5 rounded-xl border border-indigo-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>Assign Stock Commodity Types Handled (اجناس کی اقسام):</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {stockTypes.map((st) => {
                    const isSelected = selectedStockTypes.includes(st.name);
                    return (
                      <button
                        type="button"
                        key={st.id}
                        onClick={() => toggleStockType(st.name)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{st.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Co-broker Attachment Switch */}
              {type === 'CO_BROKER' && (
                <div className="bg-white p-3.5 rounded-xl border border-indigo-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="attachCheck"
                      checked={isAttachedToMainBroker}
                      onChange={(e) => setIsAttachedToMainBroker(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <label htmlFor="attachCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                      Authorize to sell Main-Broker Stock (میئن بروکر اسٹاک سیلنگ مجاز)
                    </label>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {isAttachedToMainBroker ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Link2 className="w-3.5 h-3.5" /> Can sell Main-Broker inventory
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <Unlink className="w-3.5 h-3.5" /> Own Stock Only
                      </span>
                    )}
                  </span>
                </div>
              )}

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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingBrokerId ? 'Update Broker' : 'Save Broker'}
                </button>
              </div>
            </form>
          )}

          {/* Broker Cards Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3.5">Broker & Type</th>
                  <th className="py-3 px-3">Stock Types</th>
                  <th className="py-3 px-3 text-right">Available Stock</th>
                  <th className="py-3 px-3 text-right">Valuation (PKR)</th>
                  <th className="py-3 px-3 text-center">Attachment</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {localBrokers.map((b) => {
                  const isMain = b.type === 'MAIN_BROKER';
                  return (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900 text-sm">{b.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{b.phone} ({b.city})</div>
                        <span
                          className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase mt-1 ${
                            isMain
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                          }`}
                        >
                          {isMain ? '👑 Main-Broker' : '🤝 Co-Broker'}
                        </span>
                      </td>

                      {/* Stock Types */}
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(b.stockTypes || ['General']).map((st, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold bg-purple-50 text-purple-800 px-1.5 py-0.5 rounded border border-purple-200"
                            >
                              {st}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Available Stock */}
                      <td className="py-3 px-3 text-right font-mono">
                        <div className="font-bold text-slate-900 text-sm">
                          {(b.ownAvailableBags || 0).toLocaleString()} Bags
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {((b.ownAvailableBags || 0) * 50 / 40).toFixed(1)} Maunds
                        </div>
                      </td>

                      {/* Valuation */}
                      <td className="py-3 px-3 text-right font-mono">
                        <div className="font-bold text-amber-700 text-sm">
                          PKR {(b.manualStockValuationPkr || (b.ownAvailableBags || 0) * 8000).toLocaleString()}
                        </div>
                        {b.manualStockValuationPkr ? (
                          <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded">
                            Manual Set
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-400">Auto Calc</span>
                        )}
                      </td>

                      {/* Attachment */}
                      <td className="py-3 px-3 text-center">
                        {isMain ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Master Owner
                          </span>
                        ) : b.isAttachedToMainBroker ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center justify-center gap-1">
                            <Link2 className="w-3 h-3" /> Attached
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            Own Only
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleStartEdit(b)}
                            className="p-1.5 text-slate-700 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 rounded-lg"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setBrokerToDelete({ id: b.id, name: b.name })}
                            className="p-1.5 text-slate-700 hover:text-red-700 bg-slate-100 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Broker"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Styled Delete Confirmation Popup */}
        {brokerToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl shadow-2xl border border-red-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
              <div className="bg-red-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-5 h-5" />
                  <h4 className="font-bold text-sm sm:text-base font-['Outfit']">Delete Broker Profile</h4>
                </div>
                <button onClick={() => setBrokerToDelete(null)} className="text-white/80 hover:text-white p-1 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-3">
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  Are you sure you want to permanently remove broker:
                </p>
                <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-xs space-y-1">
                  <div><strong>Broker Name:</strong> {brokerToDelete.name}</div>
                </div>
                <p className="text-[11px] text-slate-500">
                  This broker will be removed from future dispatches and quota management.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setBrokerToDelete(null)}
                  disabled={deleteLoading}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteBroker}
                  disabled={deleteLoading}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{deleteLoading ? 'Deleting...' : 'Confirm Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Admin-only broker and stock management permissions</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
}
