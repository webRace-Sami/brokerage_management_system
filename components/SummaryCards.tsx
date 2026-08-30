'use client';

import React from 'react';
import { Package, Scale, Coins, Building2, User, Users, CheckCircle, Link2, Unlink, Layers, Settings } from 'lucide-react';
import { DashboardSummary } from '@/lib/types';

interface SummaryCardsProps {
  summary: DashboardSummary | null;
  activeBrokerTab: string;
  onSelectBrokerTab: (brokerId: string) => void;
  onOpenBrokerSettings?: () => void;
  onOpenUserManagement?: () => void;
  onOpenStockTypes?: () => void;
  onOpenCompanySettings?: () => void;
  isAdmin?: boolean;
}

export default function SummaryCards({
  summary,
  activeBrokerTab,
  onSelectBrokerTab,
  onOpenBrokerSettings,
  onOpenUserManagement,
  onOpenStockTypes,
  onOpenCompanySettings,
  isAdmin,
}: SummaryCardsProps) {
  if (!summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  const { mainBrokers, coBrokers, grandTotals, company } = summary;

  return (
    <div className="space-y-4">
      {/* Top Header Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Live Stock & Broker Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {company?.name || 'Madina Goods Transport'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 font-['Outfit'] mt-1">
            Registered Brokers & Stock Valuations (تمام بروکرز و اسٹاک معلومات)
          </h2>
        </div>

        {isAdmin && (
          <div className="flex flex-wrap items-center gap-2">
            {onOpenBrokerSettings && (
              <button
                onClick={onOpenBrokerSettings}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>+ Manage Brokers</span>
              </button>
            )}

            {onOpenUserManagement && (
              <button
                onClick={onOpenUserManagement}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95"
              >
                <Users className="w-3.5 h-3.5" />
                <span>+ Manage Users</span>
              </button>
            )}

            {onOpenStockTypes && (
              <button
                onClick={onOpenStockTypes}
                className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>Stock Types</span>
              </button>
            )}

            {onOpenCompanySettings && (
              <button
                onClick={onOpenCompanySettings}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition-all"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
                <span>Company Info</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid of ALL Broker Boxes: Combined Tab, Main-Brokers & Co-Brokers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {/* 1. All Combined Filter Tab */}
        <button
          onClick={() => onSelectBrokerTab('ALL')}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
            activeBrokerTab === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-lg ring-2 ring-emerald-500/50'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs text-slate-900'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-extrabold uppercase ${activeBrokerTab === 'ALL' ? 'text-emerald-400' : 'text-slate-600'}`}>
                ALL BROKERS COMBINED
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeBrokerTab === 'ALL' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                Full Stand
              </span>
            </div>
            <div className="text-2xl font-black font-mono">
              {grandTotals.totalDispatches} <span className="text-xs font-sans font-normal opacity-80">Dispatches</span>
            </div>
            <div className="text-xs opacity-80 mt-1">
              Dispatched: <strong>{grandTotals.totalBags.toLocaleString()} Bags / Nugs</strong>
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-slate-200/20 flex justify-between text-xs">
            <span className="opacity-70">Total Rent Value:</span>
            <strong className="font-mono text-emerald-400">PKR {grandTotals.totalRentPkr.toLocaleString()}</strong>
          </div>
        </button>

        {/* 2. Main-Broker Boxes */}
        {(mainBrokers || []).map((mb) => {
          const isSelected = activeBrokerTab === mb.id;
          return (
            <button
              key={mb.id}
              onClick={() => onSelectBrokerTab(mb.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-950 text-white border-emerald-600 shadow-lg ring-2 ring-emerald-500/50'
                  : 'bg-gradient-to-br from-emerald-50/60 to-white border-emerald-200 hover:border-emerald-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase flex items-center gap-1 shadow-xs">
                    👑 Main-Broker
                  </span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-emerald-300' : 'text-slate-500'}`}>
                    {mb.city}
                  </span>
                </div>

                <div className={`font-black text-sm sm:text-base leading-tight mb-2 truncate ${isSelected ? 'text-white' : 'text-slate-900'}`} title={mb.name}>
                  {mb.name}
                </div>

                {/* Stock Types List */}
                <div className="flex flex-wrap gap-1 mb-2.5">
                  {(mb.stockTypes || ['Wheat', 'Rice']).map((st, i) => (
                    <span
                      key={i}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-emerald-800/80 text-emerald-200 border border-emerald-700'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}
                    >
                      {st}
                    </span>
                  ))}
                </div>

                {/* Available Bags & Weight */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2 rounded-xl border ${isSelected ? 'bg-emerald-900/60 border-emerald-800' : 'bg-white border-emerald-100'}`}>
                    <span className={`block text-[10px] font-bold ${isSelected ? 'text-emerald-300' : 'text-slate-500'}`}>
                      Available Stock
                    </span>
                    <span className={`font-black font-mono text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {mb.availableBags.toLocaleString()} <span className="text-[10px] font-normal">Bags</span>
                    </span>
                  </div>

                  <div className={`p-2 rounded-xl border ${isSelected ? 'bg-emerald-900/60 border-emerald-800' : 'bg-white border-emerald-100'}`}>
                    <span className={`block text-[10px] font-bold ${isSelected ? 'text-emerald-300' : 'text-slate-500'}`}>
                      Total Weight
                    </span>
                    <span className={`font-black font-mono text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {Math.round(mb.totalWeightMaunds).toLocaleString()} <span className="text-[10px] font-normal">Maunds</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Valuation in PKR */}
              <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs ${isSelected ? 'border-emerald-800 text-emerald-300' : 'border-emerald-100 text-slate-600'}`}>
                <span className="flex items-center gap-1 font-bold text-[11px]">
                  <Coins className="w-3.5 h-3.5 text-amber-500" /> Valuation:
                </span>
                <strong className={`font-mono ${isSelected ? 'text-amber-300' : 'text-amber-700'}`}>
                  PKR {Math.round(mb.totalValuationPkr).toLocaleString()}
                </strong>
              </div>
            </button>
          );
        })}

        {/* 3. Co-Broker Boxes */}
        {coBrokers.map((cb) => {
          const isSelected = activeBrokerTab === cb.id;
          return (
            <button
              key={cb.id}
              onClick={() => onSelectBrokerTab(cb.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-950 text-white border-indigo-500 shadow-lg ring-2 ring-indigo-500/50'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 uppercase">
                    🤝 Co-Broker
                  </span>
                  {cb.isAttachedToMainBroker ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-0.5">
                      <Link2 className="w-2.5 h-2.5" /> Attached
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full flex items-center gap-0.5">
                      <Unlink className="w-2.5 h-2.5" /> Own Only
                    </span>
                  )}
                </div>

                <div className={`font-black text-sm sm:text-base leading-tight mb-2 truncate ${isSelected ? 'text-white' : 'text-slate-900'}`} title={cb.name}>
                  {cb.name}
                </div>

                {/* Stock Types List */}
                <div className="flex flex-wrap gap-1 mb-2.5">
                  {(cb.stockTypes || ['General']).map((st, i) => (
                    <span
                      key={i}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-indigo-900 text-indigo-200 border border-indigo-800'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {st}
                    </span>
                  ))}
                </div>

                {/* Dual Stock Counters: Own Stock vs Main Sold */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2 rounded-xl border ${isSelected ? 'bg-indigo-900/60 border-indigo-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className={`block text-[10px] font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-500'}`}>
                      Own Stock
                    </span>
                    <span className={`font-black font-mono text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {(cb.ownAvailableBags || 0).toLocaleString()} <span className="text-[10px] font-normal">Bags</span>
                    </span>
                  </div>

                  <div className={`p-2 rounded-xl border ${isSelected ? 'bg-indigo-900/60 border-indigo-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className={`block text-[10px] font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-500'}`}>
                      Main Stock Sold
                    </span>
                    <span className={`font-black font-mono text-sm ${isSelected ? 'text-indigo-300' : 'text-indigo-700'}`}>
                      {cb.soldBags} <span className="text-[10px] font-normal">Bags</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Valuation in PKR */}
              <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs ${isSelected ? 'border-indigo-800 text-indigo-300' : 'border-slate-100 text-slate-600'}`}>
                <span className="flex items-center gap-1 font-bold text-[11px]">
                  <Coins className="w-3.5 h-3.5 text-amber-500" /> Valuation:
                </span>
                <strong className={`font-mono ${isSelected ? 'text-amber-300' : 'text-amber-700'}`}>
                  PKR {Math.round(cb.totalValuationPkr).toLocaleString()}
                </strong>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
