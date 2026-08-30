'use client';

import React from 'react';
import {
  Printer,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  Filter,
  FileSpreadsheet,
  PlusCircle,
  RefreshCw,
  CreditCard,
  MapPin,
  Truck,
  User,
  DollarSign,
  Hash,
  FileCheck,
} from 'lucide-react';
import { DispatchData, UserProfile } from '@/lib/types';

interface DispatchTableProps {
  dispatches: DispatchData[];
  loading: boolean;
  currentUser: UserProfile | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  irnFilter: string;
  onIrnFilterChange: (irn: string) => void;
  selectedRentFilter: string;
  onRentFilterChange: (status: string) => void;
  onToggleRentStatus: (id: string) => Promise<void>;
  onOpenNewDispatch: () => void;
  onPrintBilty: (dispatch: DispatchData) => void;
  onEditDispatch: (dispatch: DispatchData) => void;
  onUpdatePayment: (dispatch: DispatchData) => void;
  onDeleteDispatch: (dispatch: DispatchData) => void;
  onExportExcel: () => void;
  onRefresh: () => void;
}

export default function DispatchTable({
  dispatches,
  loading,
  currentUser,
  searchQuery,
  onSearchChange,
  irnFilter,
  onIrnFilterChange,
  selectedRentFilter,
  onRentFilterChange,
  onToggleRentStatus,
  onOpenNewDispatch,
  onPrintBilty,
  onEditDispatch,
  onUpdatePayment,
  onDeleteDispatch,
  onExportExcel,
  onRefresh,
}: DispatchTableProps) {
  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.username === 'admin';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Action Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Search, IRN Filter & Status Filters */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Global Search Bar */}
            <div className="relative flex-1 min-w-[240px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search IRN, Truck, Driver, CNIC, Shop..."
                className="w-full pl-10 pr-4 py-2 bg-white text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dedicated IRN Filter */}
            <div className="relative w-44">
              <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={irnFilter}
                onChange={(e) => onIrnFilterChange(e.target.value)}
                placeholder="Filter IRN#"
                className="w-full pl-8 pr-3 py-2 bg-white text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono shadow-sm"
              />
              {irnFilter && (
                <button
                  onClick={() => onIrnFilterChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Rent Status Filter */}
            <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-xl p-1 shadow-sm">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
              <button
                onClick={() => onRentFilterChange('ALL')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedRentFilter === 'ALL'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onRentFilterChange('PAID')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedRentFilter === 'PAID'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                Fully Paid
              </button>
              <button
                onClick={() => onRentFilterChange('PENDING')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedRentFilter === 'PENDING'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                Pending / Remaining
              </button>
            </div>

            <button
              onClick={onRefresh}
              title="Refresh Data Table"
              className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 shadow-sm transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Clean Action Buttons */}
          <div className="flex items-center gap-2">
            {/* New Outward Dispatch Button */}
            <button
              onClick={onOpenNewDispatch}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ New Dispatch</span>
            </button>

            {/* Export Excel Button */}
            <button
              onClick={onExportExcel}
              className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Excel Type Data Table */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse excel-table">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 text-xs font-bold uppercase tracking-wider select-none">
              <th className="py-3.5 px-3 min-w-[140px] text-center border-r border-slate-200">IRN</th>
              <th className="py-3.5 px-3.5 min-w-[160px] border-r border-slate-200">Broker & Stock Source</th>
              <th className="py-3.5 px-4 min-w-[190px] border-r border-slate-200">Goods & Commodity</th>
              <th className="py-3.5 px-4 min-w-[160px] border-r border-slate-200">Weight</th>
              <th className="py-3.5 px-3 min-w-[110px] text-right border-r border-slate-200">Quantity</th>
              <th className="py-3.5 px-4 min-w-[200px] border-r border-slate-200">Truck & Driver</th>
              <th className="py-3.5 px-4 min-w-[200px] border-r border-slate-200">Destination Details</th>
              <th className="py-3.5 px-4 min-w-[130px] text-right border-r border-slate-200">Total Rent / Paid</th>
              <th className="py-3.5 px-4 min-w-[150px] border-r border-slate-200">Remaining Rent (بقایا)</th>
              <th className="py-3.5 px-3 min-w-[130px] text-center sticky right-0 bg-slate-100 shadow-sm">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-800">
            {loading ? (
              <tr>
                <td colSpan={10} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
                    <span className="font-medium text-slate-600">Loading live dispatch records...</span>
                  </div>
                </td>
              </tr>
            ) : dispatches.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-16 text-center text-slate-500">
                  <div className="max-w-sm mx-auto space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-slate-700 text-base">No Dispatches Found</div>
                    <p className="text-xs text-slate-400">
                      {searchQuery || irnFilter
                        ? 'No dispatches match the active search or IRN filter.'
                        : 'No dispatch records have been entered yet. Click "+ New Dispatch" to add one.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              dispatches.map((dispatch) => {
                const rawIrn = dispatch.irn || `${(dispatch.dispatchDate || '').replace(/-/g, '')}${String(dispatch.srNo).padStart(2, '0')}`;
                const irnCode = rawIrn.replace(/^irn#?/i, '');
                const totalRent = dispatch.rentAmountPkr || 0;
                const paidRent = dispatch.advancePaidPkr || 0;
                const remainingRent = dispatch.remainingRentPkr !== undefined ? dispatch.remainingRentPkr : Math.max(0, totalRent - paidRent);
                const isFullyPaid = remainingRent === 0;
                const isMainBroker = dispatch.brokerType === 'MAIN_BROKER';
                const isOwnStock = dispatch.stockSource === 'OWN_STOCK';
                const unit = dispatch.quantityUnit || 'Bags';
                const slip = dispatch.weightSlipNo || 'xdk-2983 / 232444';

                return (
                  <tr
                    key={dispatch.id}
                    className="hover:bg-slate-50/90 transition-colors group border-b border-slate-200"
                  >
                    {/* 1. IRN (Format: YYYYMMDD01, 02... attached with YYYYMMDD) */}
                    <td className="py-3 px-3 text-center font-mono font-black text-slate-900 border-r border-slate-100 bg-slate-50/50">
                      <span className="inline-block bg-slate-900 text-emerald-400 text-xs px-2.5 py-1 rounded-md font-mono font-bold tracking-tight shadow-xs">
                        {irnCode}
                      </span>
                    </td>

                    {/* 2. Broker & Stock Source */}
                    <td className="py-3 px-3.5 border-r border-slate-100">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 leading-tight">
                          {dispatch.brokerName}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <span
                            className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                              isMainBroker
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            {isMainBroker ? 'Main-Broker' : 'Co-Broker'}
                          </span>
                          <span
                            className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                              isOwnStock
                                ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                : 'bg-purple-100 text-purple-800 border border-purple-200'
                            }`}
                          >
                            {isOwnStock ? 'Own Stock' : 'Main Stock'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Goods & Commodity */}
                    <td className="py-3 px-4 border-r border-slate-100">
                      <div className="font-semibold text-slate-900 leading-tight">
                        {dispatch.materialDescription}
                      </div>
                      {dispatch.stockType && (
                        <div className="text-[10px] text-purple-700 font-bold mt-0.5">
                          {dispatch.stockType}
                        </div>
                      )}
                      <div className="text-[11px] font-mono text-slate-400">
                        Bilty: <strong className="text-slate-600">{dispatch.biltyNo}</strong>
                      </div>
                    </td>

                    {/* 4. Weight (Column name: Weight) */}
                    <td className="py-3 px-4 border-r border-slate-100">
                      <div className="font-mono font-bold text-slate-900">
                        {dispatch.weightMaunds.toLocaleString()}{' '}
                        <span className="text-[10px] font-sans text-slate-500">Maunds</span>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          ({dispatch.weightKg.toLocaleString()} kg)
                        </span>
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                        <FileCheck className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>Slip: {slip}</span>
                      </div>
                    </td>

                    {/* 5. Quantity & Unit */}
                    <td className="py-3 px-3 text-right border-r border-slate-100">
                      <div className="font-mono font-black text-emerald-700 text-base">
                        {dispatch.quantityBags.toLocaleString()}
                      </div>
                      <span className="inline-block text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                        {unit}
                      </span>
                    </td>

                    {/* 6. Truck & Driver (Merged column including CNIC) */}
                    <td className="py-3 px-4 border-r border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-block bg-slate-900 text-white font-mono font-black text-xs px-2 py-0.5 rounded">
                            {dispatch.truckNo}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dispatch.driverName}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                          <CreditCard className="w-3 h-3 text-slate-500" />
                          <span>{dispatch.driverCnic}</span>
                        </div>
                      </div>
                    </td>

                    {/* 7. Destination Details */}
                    <td className="py-3 px-4 border-r border-slate-100">
                      <div className="font-bold text-slate-900 leading-tight">
                        {dispatch.shopName}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {dispatch.shopkeeperName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        <span className="truncate">{dispatch.destinationCity}</span>
                      </div>
                    </td>

                    {/* 8. Total Rent / Paid (Merged single column) */}
                    <td className="py-3 px-4 text-right border-r border-slate-100">
                      <div className="font-mono font-black text-slate-900 text-sm">
                        PKR {totalRent.toLocaleString()}
                      </div>
                      <div className="text-[11px] font-mono font-bold text-emerald-700 mt-0.5">
                        Paid: PKR {paidRent.toLocaleString()}
                      </div>
                    </td>

                    {/* 9. Remaining Rent (بقایا - Date removed) */}
                    <td className="py-3 px-4 border-r border-slate-100">
                      <div className="space-y-1">
                        <div
                          className={`font-mono font-black text-xs sm:text-sm ${
                            isFullyPaid ? 'text-emerald-700' : 'text-red-600'
                          }`}
                        >
                          PKR {remainingRent.toLocaleString()}
                        </div>

                        <div>
                          {isFullyPaid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                              <CheckCircle className="w-3 h-3" /> Fully Paid
                            </span>
                          ) : (
                            <button
                              onClick={() => onUpdatePayment(dispatch)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300 transition-all"
                            >
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>Due: PKR {remainingRent.toLocaleString()} (Receive)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 10. Actions */}
                    <td className="py-3 px-3 text-center sticky right-0 bg-white group-hover:bg-slate-50/90 shadow-sm">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Print Bilty */}
                        <button
                          onClick={() => onPrintBilty(dispatch)}
                          title="Generate & Print Bilty Slip (بلٹی)"
                          className="p-1.5 text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-all shadow-xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* Update Payment */}
                        <button
                          onClick={() => onUpdatePayment(dispatch)}
                          title="Record Payment / Collect Remaining Rent"
                          className="p-1.5 text-slate-700 hover:text-amber-700 bg-slate-100 hover:bg-amber-50 rounded-lg border border-slate-200 transition-all shadow-xs"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Dispatch */}
                        <button
                          onClick={() => onEditDispatch(dispatch)}
                          title="Edit Dispatch Details"
                          className="p-1.5 text-slate-700 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 rounded-lg border border-slate-200 transition-all shadow-xs"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Dispatch (Admin Only) */}
                        {isAdmin ? (
                          <button
                            onClick={() => onDeleteDispatch(dispatch)}
                            title="Delete Dispatch (Admin Only)"
                            className="p-1.5 text-slate-700 hover:text-red-700 bg-slate-100 hover:bg-red-50 rounded-lg border border-slate-200 transition-all shadow-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span
                            title="Delete restricted to Admin"
                            className="p-1.5 text-slate-300 bg-slate-50 rounded-lg border border-slate-200 cursor-not-allowed"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3.5 px-5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="font-medium">
          Showing <strong className="text-slate-800">{dispatches.length}</strong> inspection records
          {irnFilter ? ` (Filtered by IRN "${irnFilter}")` : searchQuery ? ` (Filtered by search query)` : ''}
        </div>
        <div className="text-slate-400 text-[11px]">
          * Click &quot;Due: PKR X (Receive)&quot; on Remaining Rent to record payments anytime.
        </div>
      </div>
    </div>
  );
}
