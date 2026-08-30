'use client';

import React, { useState } from 'react';
import { X, Truck, Building, Package, User, MapPin, Banknote, ShieldAlert, Check, Layers, FileCheck, Calendar } from 'lucide-react';
import { BrokerData, StockItemData, StockTypeData } from '@/lib/types';

interface NewDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  brokers: BrokerData[];
  stockItems: StockItemData[];
  stockTypes?: StockTypeData[];
}

export default function NewDispatchModal({
  isOpen,
  onClose,
  onSuccess,
  brokers,
  stockItems,
  stockTypes = [],
}: NewDispatchModalProps) {
  const [brokerId, setBrokerId] = useState('');
  const [stockSource, setStockSource] = useState<'MAIN_BROKER_STOCK' | 'OWN_STOCK'>('MAIN_BROKER_STOCK');
  const [stockItemId, setStockItemId] = useState('');
  const [stockType, setStockType] = useState('Sugar (چینی)');
  const [biltyNo, setBiltyNo] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [quantityBags, setQuantityBags] = useState<number | ''>('');
  const [quantityUnit, setQuantityUnit] = useState<'Bags' | 'Nugs' | 'Box' | 'Drums' | 'Bales' | 'Pcs'>('Bags');
  const [weightKg, setWeightKg] = useState<number | ''>('');
  const [weightSlipNo, setWeightSlipNo] = useState(`xdk-${Math.floor(1000 + Math.random() * 9000)} / ${Math.floor(100000 + Math.random() * 900000)}`);
  const [truckNo, setTruckNo] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverCnic, setDriverCnic] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopkeeperName, setShopkeeperName] = useState('');
  const [shopkeeperPhone, setShopkeeperPhone] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [destinationCity, setDestinationCity] = useState('Faisalabad');
  const [rentAmountPkr, setRentAmountPkr] = useState<number | ''>('');
  const [rentStatus, setRentStatus] = useState<'PAID' | 'PENDING'>('PENDING');
  const [advancePaidPkr, setAdvancePaidPkr] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [dispatchDate, setDispatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedBroker = brokers.find((b) => b.id === brokerId);
  const selectedItem = stockItems.find((s) => s.id === stockItemId);

  const handleCnicChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 13);
    let formatted = raw;
    if (raw.length > 5 && raw.length <= 12) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    } else if (raw.length > 12) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw.slice(12, 13)}`;
    }
    setDriverCnic(formatted);
  };

  const handleStockItemSelect = (id: string) => {
    setStockItemId(id);
    const item = stockItems.find((s) => s.id === id);
    if (item) {
      setMaterialDescription(item.name);
      setStockType(item.category || item.name);
      if (quantityBags) {
        setWeightKg(Number(quantityBags) * item.standardBagWeightKg);
      }
    }
  };

  const handleQuantityChange = (qty: number | '') => {
    setQuantityBags(qty);
    if (qty && selectedItem) {
      setWeightKg(Number(qty) * selectedItem.standardBagWeightKg);
    }
  };

  const totalRent = Number(rentAmountPkr) || 0;
  const advance = Number(advancePaidPkr) || (rentStatus === 'PAID' ? totalRent : 0);
  const remainingRentDue = Math.max(0, totalRent - advance);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!brokerId) {
      setError('Please select a Broker.');
      return;
    }
    if (!quantityBags || Number(quantityBags) <= 0) {
      setError('Please enter a valid quantity.');
      return;
    }
    if (!truckNo.trim() || !driverName.trim() || !driverCnic.trim()) {
      setError('Please fill Truck Number, Driver Name, and Driver CNIC.');
      return;
    }
    if (!shopName.trim() || !shopkeeperName.trim() || !destinationCity.trim()) {
      setError('Please fill Destination Shop, Shopkeeper, and City.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        brokerId,
        biltyNo: biltyNo.trim() || undefined,
        stockSource: selectedBroker?.type === 'MAIN_BROKER' ? 'MAIN_BROKER_STOCK' : stockSource,
        stockItemId: stockItemId || undefined,
        stockType,
        materialDescription: materialDescription || selectedItem?.name || 'Commercial Goods',
        quantityBags: Number(quantityBags),
        quantityUnit,
        weightKg: Number(weightKg) || Number(quantityBags) * 50,
        weightSlipNo: weightSlipNo.trim(),
        truckNo,
        driverName,
        driverCnic,
        driverPhone,
        shopName,
        shopkeeperName,
        shopkeeperPhone,
        destinationAddress,
        destinationCity,
        rentAmountPkr: totalRent,
        rentStatus: remainingRentDue === 0 ? 'PAID' : 'PENDING',
        advancePaidPkr: advance,
        paymentMethod,
        dispatchDate,
        paymentDate,
        remarks,
      };

      const res = await fetch('/api/dispatches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit dispatch entry.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-['Outfit']">
                New Outward Dispatch Entry (نئی گاڑی روانگی بلٹی)
              </h3>
              <p className="text-xs text-slate-400">
                Inspection Receipt (IRN) Generation & Live Dual-Stock Deduction
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Broker & Stock Source */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-emerald-600" />
              1. Broker & Stock Ownership Source (سیلنگ موڈ)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Selling Broker <span className="text-red-500">*</span>
                </label>
                <select
                  value={brokerId}
                  onChange={(e) => {
                    setBrokerId(e.target.value);
                    const b = brokers.find((x) => x.id === e.target.value);
                    if (b?.type === 'MAIN_BROKER') {
                      setStockSource('MAIN_BROKER_STOCK');
                    }
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  required
                >
                  <option value="">-- Choose Broker --</option>
                  {brokers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.type === 'MAIN_BROKER' ? '👑 Main-Broker' : `🤝 Co-Broker - Own: ${b.ownAvailableBags || 0}`})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Which Stock is Being Sold? <span className="text-red-500">*</span>
                </label>
                {selectedBroker?.type === 'MAIN_BROKER' ? (
                  <div className="px-3 py-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Selling Directly from Main-Broker Master Stock</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setStockSource('MAIN_BROKER_STOCK')}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        stockSource === 'MAIN_BROKER_STOCK'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Main-Broker Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockSource('OWN_STOCK')}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        stockSource === 'OWN_STOCK'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Co-Broker Own Stock
                    </button>
                  </div>
                )}
              </div>

              {/* Commodity Stock Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Commodity Stock Type (جنس کی قسم)
                </label>
                <select
                  value={stockType}
                  onChange={(e) => setStockType(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800"
                >
                  <option value="Sugar (چینی)">Sugar (چینی)</option>
                  <option value="Edible Oil & Ghee (تیل و گھی)">Edible Oil & Ghee (تیل و گھی)</option>
                  <option value="Wheat (گندم)">Wheat (گندم)</option>
                  <option value="Basmati Rice (چاول)">Basmati Rice (چاول)</option>
                  <option value="Raw Cotton & Bales (روئی و پھٹی)">Raw Cotton & Bales (روئی و پھٹی)</option>
                  <option value="Fertilizer & DAP (کھاد سونا یوریا)">Fertilizer & DAP (کھاد سونا یوریا)</option>
                  {stockTypes.map((st) => (
                    <option key={st.id} value={st.name}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bilty Number (Manual / Auto) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Bilty Number (بلٹی نمبر)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Optional / Auto if empty</span>
                </label>
                <input
                  type="text"
                  value={biltyNo}
                  onChange={(e) => setBiltyNo(e.target.value)}
                  placeholder="e.g. MGT-2026-1008 (or manual number)"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                />
              </div>

              {/* Goods Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Material / Goods Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={materialDescription}
                  onChange={(e) => setMaterialDescription(e.target.value)}
                  placeholder="e.g. Refined Sugar Grade-A"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Quantity & Unit Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantity & Packaging Unit <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={quantityBags}
                    onChange={(e) => handleQuantityChange(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 150"
                    className="w-2/3 px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                    required
                  />
                  <select
                    value={quantityUnit}
                    onChange={(e: any) => setQuantityUnit(e.target.value)}
                    className="w-1/3 px-2 py-2 text-xs font-bold border border-slate-300 rounded-xl bg-slate-50"
                  >
                    <option value="Bags">Bags (بوریاں)</option>
                    <option value="Box">Box (ڈبے)</option>
                    <option value="Nugs">Nugs (نگ)</option>
                    <option value="Drums">Drums (ڈرم)</option>
                    <option value="Bales">Bales (گانٹھیں)</option>
                    <option value="Pcs">Pcs (پیس)</option>
                  </select>
                </div>
              </div>

              {/* Weight & Weight Slip */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Weight (Kg) & Weight Slip No. <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 7500"
                    className="w-1/2 px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <input
                    type="text"
                    value={weightSlipNo}
                    onChange={(e) => setWeightSlipNo(e.target.value)}
                    placeholder="Slip: xdk-2983 / 232444"
                    className="w-1/2 px-2.5 py-2 text-xs border border-amber-300 bg-amber-50/50 rounded-xl font-mono font-bold text-amber-900"
                    required
                  />
                </div>
                <div className="text-[11px] text-sky-600 mt-1 font-mono">
                  ≈ {weightKg ? (Number(weightKg) / 40).toFixed(2) : 0} Maunds (من)
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Vehicle & Driver */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-sky-600" />
              2. Vehicle & Driver Identification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Truck Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={truckNo}
                  onChange={(e) => setTruckNo(e.target.value)}
                  placeholder="e.g. FD-4512"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl uppercase font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Driver Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. Muhammad Ramzan"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Driver CNIC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={driverCnic}
                  onChange={(e) => handleCnicChange(e.target.value)}
                  placeholder="33202-1234567-1"
                  maxLength={15}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Destination & Consignee */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-600" />
              3. Destination & Shopkeeper
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Shop Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Al-Rehman Flour Mills"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Shopkeeper Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={shopkeeperName}
                  onChange={(e) => setShopkeeperName(e.target.value)}
                  placeholder="e.g. Sheikh Farooq Ahmed"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  placeholder="e.g. Faisalabad"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 4: Freight Rent, Remaining Balance & Dates */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-amber-600" />
              4. Freight Rent, Remaining Balance & Payment Dates
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Freight (PKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={rentAmountPkr}
                  onChange={(e) => setRentAmountPkr(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 35000"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Advance Paid (PKR)
                </label>
                <input
                  type="number"
                  value={advancePaidPkr}
                  onChange={(e) => setAdvancePaidPkr(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 15000"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono"
                />
              </div>

              {/* Dispatch Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dispatch Date (روانگی تاریخ)
                </label>
                <input
                  type="date"
                  value={dispatchDate}
                  onChange={(e) => setDispatchDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
                />
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment / Due Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
                />
              </div>
            </div>

            {/* Remaining Alert Bar */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between mt-3">
              <span className="text-xs font-bold text-slate-700">Remaining Balance Due (بقایا کرایہ):</span>
              <span
                className={`font-mono text-sm font-black ${
                  remainingRentDue === 0 ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                PKR {remainingRentDue.toLocaleString()} {remainingRentDue === 0 ? '(CLEARED)' : '(PENDING)'}
              </span>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Recording Dispatch...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Confirm & Dispatch Outward</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
