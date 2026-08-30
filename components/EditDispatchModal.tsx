'use client';

import React, { useState, useEffect } from 'react';
import { X, Edit3, Check, ShieldAlert } from 'lucide-react';
import { DispatchData } from '@/lib/types';

interface EditDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dispatch: DispatchData | null;
}

export default function EditDispatchModal({
  isOpen,
  onClose,
  onSuccess,
  dispatch,
}: EditDispatchModalProps) {
  const [materialDescription, setMaterialDescription] = useState('');
  const [quantityUnit, setQuantityUnit] = useState<'Bags' | 'Nugs' | 'Box' | 'Drums' | 'Bales' | 'Pcs'>('Bags');
  const [weightSlipNo, setWeightSlipNo] = useState('');
  const [truckNo, setTruckNo] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverCnic, setDriverCnic] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopkeeperName, setShopkeeperName] = useState('');
  const [shopkeeperPhone, setShopkeeperPhone] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [rentAmountPkr, setRentAmountPkr] = useState<number | ''>('');
  const [rentStatus, setRentStatus] = useState<'PAID' | 'PENDING'>('PENDING');
  const [advancePaidPkr, setAdvancePaidPkr] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [dispatchDate, setDispatchDate] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [remarks, setRemarks] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dispatch) {
      setMaterialDescription(dispatch.materialDescription || '');
      setQuantityUnit(dispatch.quantityUnit || 'Bags');
      setWeightSlipNo(dispatch.weightSlipNo || '');
      setTruckNo(dispatch.truckNo || '');
      setDriverName(dispatch.driverName || '');
      setDriverCnic(dispatch.driverCnic || '');
      setDriverPhone(dispatch.driverPhone || '');
      setShopName(dispatch.shopName || '');
      setShopkeeperName(dispatch.shopkeeperName || '');
      setShopkeeperPhone(dispatch.shopkeeperPhone || '');
      setDestinationCity(dispatch.destinationCity || '');
      setDestinationAddress(dispatch.destinationAddress || '');
      setRentAmountPkr(dispatch.rentAmountPkr || 0);
      setRentStatus(dispatch.rentStatus || 'PENDING');
      setAdvancePaidPkr(dispatch.advancePaidPkr || 0);
      setPaymentMethod(dispatch.paymentMethod || 'Cash');
      setDispatchDate(dispatch.dispatchDate || '');
      setPaymentDate(dispatch.paymentDate || '');
      setRemarks(dispatch.remarks || '');
    }
  }, [dispatch]);

  if (!isOpen || !dispatch) return null;

  const irnNumber = dispatch.irn || dispatch.srNo;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/dispatches/${dispatch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialDescription,
          quantityUnit,
          weightSlipNo,
          truckNo,
          driverName,
          driverCnic,
          driverPhone,
          shopName,
          shopkeeperName,
          shopkeeperPhone,
          destinationCity,
          destinationAddress,
          rentAmountPkr: Number(rentAmountPkr) || 0,
          rentStatus,
          advancePaidPkr: Number(advancePaidPkr) || 0,
          paymentMethod,
          dispatchDate,
          paymentDate,
          remarks,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update dispatch record.');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-['Outfit']">
                Edit Dispatch Entry (تبدیلی اندراج) - {dispatch.irn || `IRN#${dispatch.srNo}`}
              </h3>
              <p className="text-xs text-slate-400">Bilty #{dispatch.biltyNo} | Broker: {dispatch.brokerName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="sm:col-span-2">
              <label htmlFor="edit_material_desc" className="block text-xs font-bold text-slate-700 mb-1">Goods Description</label>
              <input
                id="edit_material_desc"
                name="materialDescription"
                type="text"
                value={materialDescription}
                onChange={(e) => setMaterialDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label htmlFor="edit_quantity_unit" className="block text-xs font-bold text-slate-700 mb-1">Packaging Unit</label>
              <select
                id="edit_quantity_unit"
                name="quantityUnit"
                value={quantityUnit}
                onChange={(e: any) => setQuantityUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-bold"
              >
                <option value="Bags">Bags (بوریاں)</option>
                <option value="Box">Box (ڈبے)</option>
                <option value="Nugs">Nugs (نگ)</option>
                <option value="Drums">Drums (ڈرم)</option>
                <option value="Bales">Bales (گانٹھیں)</option>
                <option value="Pcs">Pcs (پیس)</option>
              </select>
            </div>

            <div>
              <label htmlFor="edit_weight_slip" className="block text-xs font-bold text-slate-700 mb-1">Weight Slip No. (کانٹا پرچی)</label>
              <input
                id="edit_weight_slip"
                name="weightSlipNo"
                type="text"
                value={weightSlipNo}
                onChange={(e) => setWeightSlipNo(e.target.value)}
                placeholder="Slip: xdk-2983 / 232444"
                className="w-full px-3 py-2 text-xs border border-amber-300 bg-amber-50/50 rounded-xl font-mono font-bold text-amber-900"
              />
            </div>

            <div>
              <label htmlFor="edit_truck_no" className="block text-xs font-bold text-slate-700 mb-1">Truck Number</label>
              <input
                id="edit_truck_no"
                name="truckNo"
                type="text"
                value={truckNo}
                onChange={(e) => setTruckNo(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl uppercase font-mono font-bold"
                required
              />
            </div>

            <div>
              <label htmlFor="edit_driver_name" className="block text-xs font-bold text-slate-700 mb-1">Driver Name</label>
              <input
                id="edit_driver_name"
                name="driverName"
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label htmlFor="edit_driver_cnic" className="block text-xs font-bold text-slate-700 mb-1">Driver CNIC</label>
              <input
                id="edit_driver_cnic"
                name="driverCnic"
                type="text"
                value={driverCnic}
                onChange={(e) => setDriverCnic(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono"
                required
              />
            </div>

            <div>
              <label htmlFor="edit_driver_phone" className="block text-xs font-bold text-slate-700 mb-1">Driver Phone</label>
              <input
                id="edit_driver_phone"
                name="driverPhone"
                type="text"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label htmlFor="edit_shop_name" className="block text-xs font-bold text-slate-700 mb-1">Shop Name</label>
              <input
                id="edit_shop_name"
                name="shopName"
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label htmlFor="edit_destination_city" className="block text-xs font-bold text-slate-700 mb-1">Destination City</label>
              <input
                id="edit_destination_city"
                name="destinationCity"
                type="text"
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label htmlFor="edit_rent_amount" className="block text-xs font-bold text-slate-700 mb-1">Total Rent (PKR)</label>
              <input
                id="edit_rent_amount"
                name="rentAmountPkr"
                type="number"
                value={rentAmountPkr}
                onChange={(e) => setRentAmountPkr(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono font-bold"
                required
              />
            </div>

            <div>
              <label htmlFor="edit_advance_paid" className="block text-xs font-bold text-slate-700 mb-1">Advance Paid (PKR)</label>
              <input
                id="edit_advance_paid"
                name="advancePaidPkr"
                type="number"
                value={advancePaidPkr}
                onChange={(e) => setAdvancePaidPkr(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label htmlFor="edit_dispatch_date" className="block text-xs font-bold text-slate-700 mb-1">Dispatch Date</label>
              <input
                id="edit_dispatch_date"
                name="dispatchDate"
                type="date"
                value={dispatchDate}
                onChange={(e) => setDispatchDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label htmlFor="edit_payment_date" className="block text-xs font-bold text-slate-700 mb-1">Payment Date</label>
              <input
                id="edit_payment_date"
                name="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
              />
            </div>
          </div>
        </form>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-xs sm:text-sm font-bold rounded-xl shadow-md disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{loading ? 'Updating...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
