'use client';

import React, { useState } from 'react';
import { X, Truck, Building, Package, User, MapPin, Banknote, ShieldAlert, Check } from 'lucide-react';
import { BrokerData, StockItemData } from '@/lib/types';

interface NewDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  brokers: BrokerData[];
  stockItems: StockItemData[];
}

export default function NewDispatchModal({
  isOpen,
  onClose,
  onSuccess,
  brokers,
  stockItems,
}: NewDispatchModalProps) {
  const [brokerId, setBrokerId] = useState('');
  const [stockItemId, setStockItemId] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [quantityBags, setQuantityBags] = useState<number | ''>('');
  const [weightKg, setWeightKg] = useState<number | ''>('');
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
  const [remarks, setRemarks] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Selected Stock Item details
  const selectedItem = stockItems.find((s) => s.id === stockItemId);

  // Auto-format Pakistani CNIC (XXXXX-XXXXXXX-X)
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

  // When stock item is picked, pre-fill description & calculate weights
  const handleStockItemSelect = (id: string) => {
    setStockItemId(id);
    const item = stockItems.find((s) => s.id === id);
    if (item) {
      setMaterialDescription(item.name);
      if (quantityBags) {
        setWeightKg(Number(quantityBags) * item.standardBagWeightKg);
      }
    }
  };

  // When bags quantity changes, calculate weight
  const handleQuantityChange = (qty: number | '') => {
    setQuantityBags(qty);
    if (qty && selectedItem) {
      setWeightKg(Number(qty) * selectedItem.standardBagWeightKg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!brokerId) {
      setError('Please select a Broker (Main or Co-Broker).');
      return;
    }
    if (!quantityBags || Number(quantityBags) <= 0) {
      setError('Please enter a valid quantity of Bags/Nugs.');
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
        stockItemId: stockItemId || undefined,
        materialDescription: materialDescription || selectedItem?.name || 'Commercial Goods',
        quantityBags: Number(quantityBags),
        weightKg: Number(weightKg) || Number(quantityBags) * 50,
        truckNo,
        driverName,
        driverCnic,
        driverPhone,
        shopName,
        shopkeeperName,
        shopkeeperPhone,
        destinationAddress,
        destinationCity,
        rentAmountPkr: Number(rentAmountPkr) || 0,
        rentStatus,
        advancePaidPkr: Number(advancePaidPkr) || 0,
        paymentMethod,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-['Outfit']">
                New Outward Dispatch Entry (نئی گاڑی روانگی)
              </h3>
              <p className="text-xs text-slate-400">
                Madina Goods Transport Company, Chiniot - Automatic Stock Deduction
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

          {/* Section 1: Broker & Stock IRN selection */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-emerald-600" />
              1. Broker & Stock Selection (Shared Live Inventory)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Select Broker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Broker <span className="text-red-500">*</span>
                </label>
                <select
                  value={brokerId}
                  onChange={(e) => setBrokerId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  required
                >
                  <option value="">-- Choose Main or Co-Broker --</option>
                  {brokers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.type === 'MAIN_BROKER' ? 'Main-Broker' : `Co-Broker - Quota: ${b.allocatedQuotaBags} Bags`})
                    </option>
                  ))}
                </select>
              </div>

              {/* Master IRN Item Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Master Stock Item (Posting IRN)
                </label>
                <select
                  value={stockItemId}
                  onChange={(e) => handleStockItemSelect(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="">-- Select Master Stock Material --</option>
                  {stockItems.map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.code}] {s.name} (Avail: {s.availableBags} Bags @ PKR {s.unitPricePkr})
                    </option>
                  ))}
                </select>
              </div>

              {/* Material Goods Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Goods / Material Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={materialDescription}
                  onChange={(e) => setMaterialDescription(e.target.value)}
                  placeholder="e.g. Basmati Rice Super Kernel 50kg Bags"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Quantity Bags & Weight */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantity (Bags / Nugs / Pcs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantityBags}
                  onChange={(e) => handleQuantityChange(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 150"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
                {selectedItem && (
                  <div className="text-[11px] text-emerald-600 mt-1 font-medium">
                    Available in Godown: <strong>{selectedItem.availableBags} Bags</strong>
                  </div>
                )}
              </div>

              {/* Total Weight */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Weight (Kg) <span className="text-slate-400 font-normal">(Auto-calculated)</span>
                </label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 7500"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                />
                <div className="text-[11px] text-sky-600 mt-1 font-mono">
                  ≈ {weightKg ? (Number(weightKg) / 40).toFixed(2) : 0} Maunds (من)
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Vehicle & Driver Details */}
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
                  placeholder="e.g. FD-4512 or CHT-786"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 uppercase font-mono font-bold"
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
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Driver Contact / Phone (Optional)
                </label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Destination & Consignee */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-600" />
              3. Destination & Consignee (Shopkeeper)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination Shop / Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Al-Rehman Flour Mills & Depo"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Shopkeeper Phone
                </label>
                <input
                  type="text"
                  value={shopkeeperPhone}
                  onChange={(e) => setShopkeeperPhone(e.target.value)}
                  placeholder="0321-9876543"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
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
                  placeholder="e.g. Faisalabad, Lahore, Sargodha, Karachi"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Shop Address / Location
                </label>
                <input
                  type="text"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  placeholder="e.g. Gole Karyana Market, Shop #14, Badami Bagh"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Freight Rent & Payment */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-amber-600" />
              4. Freight / Rent Collection
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Rent Amount (PKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={rentAmountPkr}
                  onChange={(e) => setRentAmountPkr(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 35000"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rent Collection Status
                </label>
                <select
                  value={rentStatus}
                  onChange={(e) => setRentStatus(e.target.value as 'PAID' | 'PENDING')}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  <option value="PENDING">PENDING (وصولی باقی)</option>
                  <option value="PAID">PAID (مکمل وصول شدہ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Advance Paid (PKR)
                </label>
                <input
                  type="number"
                  value={advancePaidPkr}
                  onChange={(e) => setAdvancePaidPkr(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 10000"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-all"
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
