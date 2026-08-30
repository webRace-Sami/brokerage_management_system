'use client';

import React, { useState } from 'react';
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
  PackagePlus,
  Settings2,
  RefreshCw,
  Phone,
  CreditCard,
  MapPin,
  Truck,
  User,
  Building,
} from 'lucide-react';
import { DispatchData, UserProfile } from '@/lib/types';

interface DispatchTableProps {
  dispatches: DispatchData[];
  loading: boolean;
  currentUser: UserProfile | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRentFilter: string;
  onRentFilterChange: (status: string) => void;
  onToggleRentStatus: (id: string) => Promise<void>;
  onOpenNewDispatch: () => void;
  onOpenStockInward: () => void;
  onOpenStockRegistry: () => void;
  onPrintBilty: (dispatch: DispatchData) => void;
  onEditDispatch: (dispatch: DispatchData) => void;
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
  selectedRentFilter,
  onRentFilterChange,
  onToggleRentStatus,
  onOpenNewDispatch,
  onOpenStockInward,
  onOpenStockRegistry,
  onPrintBilty,
  onEditDispatch,
  onDeleteDispatch,
  onExportExcel,
  onRefresh,
}: DispatchTableProps) {
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleRent = async (id: string) => {
    try {
      setTogglingId(id);
      await onToggleRentStatus(id);
    } finally {
      setTogglingId(null);
    }
  };

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Action Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Instant Search Bar */}
            <div className="relative flex-1 min-w-[280px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Sr#, Truck, Driver, CNIC, Shop, City, Goods..."
                className="w-full pl-10 pr-4 py-2 bg-white text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all"
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

            {/* Rent Status Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl p-1 shadow-sm">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
              <button
                onClick={() => onRentFilterChange('ALL')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedRentFilter === 'ALL'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                All Rent
              </button>
              <button
                onClick={() => onRentFilterChange('PAID')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedRentFilter === 'PAID'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                Paid Only
              </button>
              <button
                onClick={() => onRentFilterChange('PENDING')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedRentFilter === 'PENDING'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                Pending
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

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* New Outward Dispatch Button */}
            <button
              onClick={onOpenNewDispatch}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ New Dispatch Entry</span>
            </button>

            {/* Stock Inward Restock */}
            <button
              onClick={onOpenStockInward}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
            >
              <PackagePlus className="w-4 h-4 text-emerald-400" />
              <span>Stock Inward</span>
            </button>

            {/* IRN Master Registry (Posting IRN) */}
            <button
              onClick={onOpenStockRegistry}
              title="Posting IRN & Master Goods Rates"
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
            >
              <Settings2 className="w-4 h-4 text-indigo-600" />
              <span>IRN Registry</span>
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
          {/* Table Header with Hover Effect */}
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 text-xs font-bold uppercase tracking-wider select-none">
              <th className="py-3.5 px-3 w-14 text-center border-r border-slate-200">Sr.</th>
              <th className="py-3.5 px-4 min-w-[150px] border-r border-slate-200">Broker Type & Name</th>
              <th className="py-3.5 px-4 min-w-[200px] border-r border-slate-200">Material / Goods Description</th>
              <th className="py-3.5 px-3 min-w-[110px] text-right border-r border-slate-200">Weight</th>
              <th className="py-3.5 px-3 min-w-[110px] text-right border-r border-slate-200">Quantity</th>
              <th className="py-3.5 px-3 min-w-[120px] border-r border-slate-200">Truck No.</th>
              <th className="py-3.5 px-4 min-w-[200px] border-r border-slate-200">Driver Details</th>
              <th className="py-3.5 px-4 min-w-[240px] border-r border-slate-200">Destination Details</th>
              <th className="py-3.5 px-4 min-w-[190px] border-r border-slate-200">Rent Status & Amount</th>
              <th className="py-3.5 px-3 min-w-[140px] text-center sticky right-0 bg-slate-100 shadow-sm">
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
                      {searchQuery
                        ? `No dispatches match the search query "${searchQuery}".`
                        : 'No dispatch records have been entered yet. Click "+ New Dispatch Entry" to add one.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              dispatches.map((dispatch) => {
                const isPaid = dispatch.rentStatus === 'PAID';
                const isMainBroker = dispatch.brokerType === 'MAIN_BROKER';

                return (
                  <tr
                    key={dispatch.id}
                    className="hover:bg-slate-50/90 transition-colors group border-b border-slate-200"
                  >
                    {/* 1. Sr No. */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-600 border-r border-slate-100 bg-slate-50/50">
                      #{dispatch.srNo}
                    </td>

                    {/* 2. Broker Type & Name */}
                    <td className="py-3 px-4 border-r border-slate-100">
                      <div className="flex items-start gap-1.5">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                              isMainBroker
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                            }`}
                          >
                            <Building className="w-2.5 h-2.5" />
                            {isMainBroker ? 'Main-Broker' : 'Co-Broker'}
                          </span>
                          <div className="font-semibold text-slate-900 leading-tight">
                            {dispatch.brokerName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 3. Material / Goods Description */}
                    <td className="py-3 px-4 border-r border-slate-100">
                      <div className="font-semibold text-slate-900 leading-tight">
                        {dispatch.materialDescription}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        Bilty: <strong className="text-slate-600">{dispatch.biltyNo}</strong>
                      </div>
                    </td>

                    {/* 4. Weight */}
                    <td className="py-3 px-3 text-right border-r border-slate-100">
                      <div className="font-mono font-black text-slate-900 text-sm">
                        {dispatch.weightMaunds.toLocaleString()}{' '}
                        <span className="text-[11px] font-sans font-medium text-slate-500">Maunds</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {dispatch.weightKg.toLocaleString()} kg
                      </div>
                    </td>

                    {/* 5. Quantity */}
                    <td className="py-3 px-3 text-right border-r border-slate-100">
                      <div className="font-mono font-black text-emerald-700 text-sm">
                        {dispatch.quantityBags.toLocaleString()}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">Bags / Pcs</span>
                    </td>

                    {/* 6. Truck No. */}
                    <td className="py-3 px-3 border-r border-slate-100">
                      <span className="inline-block bg-slate-900 text-white font-mono font-extrabold text-xs px-2.5 py-1 rounded-md tracking-wider shadow-xs">
                        {dispatch.truckNo}
                      </span>
                    </td>

                    {/* 7. Driver Details */}
                    <td className="py-3 px-4 border-r border-slate-100">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {dispatch.driverName}
                      </div>
                      <div className="flex items-center gap-1 font-mono text-xs text-slate-600 mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                        <CreditCard className="w-3 h-3 text-slate-500" />
                        <span>{dispatch.driverCnic}</span>
                      </div>
                      {dispatch.driverPhone && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-2.5 h-2.5" />
                          {dispatch.driverPhone}
                        </div>
                      )}
                    </td>

                    {/* 8. Destination Details */}
                    <td className="py-3 px-4 border-r border-slate-100">
                      <div className="font-bold text-slate-900 leading-tight">
                        {dispatch.shopName}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {dispatch.shopkeeperName}
                        {dispatch.shopkeeperPhone ? ` (${dispatch.shopkeeperPhone})` : ''}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        <span className="truncate">{dispatch.destinationCity}</span>
                      </div>
                    </td>

                    {/* 9. Rent Status & Amount with Instant Quick-Toggle Button */}
                    <td className="py-3 px-4 border-r border-slate-100">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono font-black text-slate-900 text-sm">
                            PKR {dispatch.rentAmountPkr.toLocaleString()}
                          </span>
                        </div>

                        {/* Quick Toggle Button Row */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleRent(dispatch.id)}
                            disabled={togglingId === dispatch.id}
                            title={`Click to switch status to ${isPaid ? 'Pending' : 'Paid'}`}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-xs border ${
                              isPaid
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                            }`}
                          >
                            {isPaid ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                <span>PAID</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>PENDING</span>
                              </>
                            )}
                            <span className="text-[10px] text-slate-400 font-normal">↺ toggle</span>
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* 10. Actions Column */}
                    <td className="py-3 px-3 text-center sticky right-0 bg-white group-hover:bg-slate-50/90 shadow-sm">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Print Bilty Button */}
                        <button
                          onClick={() => onPrintBilty(dispatch)}
                          title="Generate & Print Bilty Slip (بلٹی)"
                          className="p-1.5 text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all shadow-xs"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Edit Dispatch */}
                        <button
                          onClick={() => onEditDispatch(dispatch)}
                          title="Edit Dispatch Details"
                          className="p-1.5 text-slate-700 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition-all shadow-xs"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Dispatch (Strictly Admin Only) */}
                        {isAdmin ? (
                          <button
                            onClick={() => onDeleteDispatch(dispatch)}
                            title="Delete Dispatch (Admin Only)"
                            className="p-1.5 text-slate-700 hover:text-red-700 bg-slate-100 hover:bg-red-50 rounded-lg border border-slate-200 hover:border-red-300 transition-all shadow-xs"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span
                            title="Delete restricted to Admin"
                            className="p-1.5 text-slate-300 bg-slate-50 rounded-lg border border-slate-200 cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Table Footer with Record Count */}
      <div className="p-3.5 px-5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="font-medium">
          Showing <strong className="text-slate-800">{dispatches.length}</strong> dispatch records
          {searchQuery && ` (filtered from active query)`}
        </div>
        <div className="text-slate-400 text-[11px]">
          * Click &quot;toggle&quot; on Rent Status to quickly update payment. Only Admin can delete entries.
        </div>
      </div>
    </div>
  );
}
