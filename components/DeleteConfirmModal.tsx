'use client';

import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, ShieldAlert } from 'lucide-react';
import { DispatchData } from '@/lib/types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dispatch: DispatchData | null;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onSuccess,
  dispatch,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !dispatch) return null;

  const handleDelete = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/dispatches/${dispatch.id}`, {
        method: 'DELETE',
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = { error: text || 'Server response error' };
      }

      if (!res.ok) {
        throw new Error(data.error || `Failed to delete dispatch record (Status ${res.status}).`);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error deleting record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-red-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-red-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-base font-['Outfit']">Admin Authorization Required</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-xs sm:text-sm text-slate-600">
            Are you sure you want to permanently delete Dispatch Bilty{' '}
            <strong className="text-slate-900 font-mono">{dispatch.biltyNo}</strong>?
          </p>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
            <div><strong>Broker:</strong> {dispatch.brokerName}</div>
            <div><strong>Material:</strong> {dispatch.materialDescription} ({dispatch.quantityBags} Bags)</div>
            <div><strong>Truck & Driver:</strong> {dispatch.truckNo} - {dispatch.driverName}</div>
            <div><strong>Destination:</strong> {dispatch.shopName}, {dispatch.destinationCity}</div>
            <div><strong>Rent:</strong> PKR {dispatch.rentAmountPkr.toLocaleString()} ({dispatch.rentStatus})</div>
          </div>

          <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            ⚠️ Deleting this entry will automatically restore <strong>{dispatch.quantityBags} bags</strong> back into the Main-Broker available warehouse stock.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{loading ? 'Deleting...' : 'Confirm Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
