'use client';

import React, { useState, useEffect } from 'react';
import { X, Banknote, CheckCircle, AlertCircle, Check, Calendar } from 'lucide-react';
import { DispatchData } from '@/lib/types';

interface UpdatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dispatch: DispatchData | null;
}

export default function UpdatePaymentModal({
  isOpen,
  onClose,
  onSuccess,
  dispatch,
}: UpdatePaymentModalProps) {
  const [advancePaidPkr, setAdvancePaidPkr] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dispatch) {
      setAdvancePaidPkr(dispatch.advancePaidPkr || 0);
      setPaymentMethod(dispatch.paymentMethod || 'Cash');
      setPaymentDate(dispatch.paymentDate || new Date().toISOString().split('T')[0]);
    }
  }, [dispatch]);

  if (!isOpen || !dispatch) return null;

  const totalRent = dispatch.rentAmountPkr || 0;
  const currentPaid = Number(advancePaidPkr) || 0;
  const remainingDue = Math.max(0, totalRent - currentPaid);
  const irnNumber = dispatch.irn || dispatch.srNo;

  const handlePayFull = () => {
    setAdvancePaidPkr(totalRent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/dispatches/${dispatch.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          advancePaidPkr: Number(advancePaidPkr) || 0,
          paymentMethod,
          paymentDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update payment.');

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base font-['Outfit']">
                Update Freight Payment (وصولی کرایہ)
              </h3>
              <p className="text-[11px] text-slate-400">{dispatch.irn || `IRN#${dispatch.srNo}`} - Bilty #{dispatch.biltyNo}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Breakdown Card */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 font-sans">
            <div className="flex justify-between text-slate-600">
              <span>Total Freight (کل کرایہ):</span>
              <strong className="font-mono text-slate-900">PKR {totalRent.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Consignee / Shop:</span>
              <span className="font-semibold text-slate-800">{dispatch.shopName} ({dispatch.destinationCity})</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Weight & Slip:</span>
              <span className="font-mono">{dispatch.weightMaunds} Mnd ({dispatch.weightSlipNo || 'N/A'})</span>
            </div>
          </div>

          {/* Paid / Advance Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="payment_advance_amount" className="text-xs font-bold text-slate-700">
                Amount Received / Paid (PKR) <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handlePayFull}
                className="text-[11px] font-bold text-emerald-700 hover:underline bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
              >
                Mark Full Paid (مکمل وصولی)
              </button>
            </div>
            <input
              id="payment_advance_amount"
              name="advancePaidPkr"
              type="number"
              min="0"
              max={totalRent}
              value={advancePaidPkr}
              onChange={(e) => setAdvancePaidPkr(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 20000"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
              required
            />
          </div>

          {/* Payment Date */}
          <div>
            <label htmlFor="payment_received_date" className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>Payment Received Date (وصولی تاریخ)</span>
            </label>
            <input
              id="payment_received_date"
              name="paymentDate"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
              required
            />
          </div>

          {/* Live Remaining Balance */}
          <div className="p-3 rounded-xl border flex items-center justify-between bg-slate-50 border-slate-200">
            <span className="text-xs font-bold text-slate-700">Remaining Balance (بقایا کرایہ):</span>
            <span
              className={`font-mono text-sm font-black ${
                remainingDue === 0 ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              PKR {remainingDue.toLocaleString()} {remainingDue === 0 ? '(CLEARED)' : '(PENDING)'}
            </span>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Payment Method / Note
            </label>
            <input
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              placeholder="e.g. Cash On Handover, Bank Transfer, Slip Collection"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Payment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
