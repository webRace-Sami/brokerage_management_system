'use client';

import React from 'react';
import { Package, Scale, Coins, Building2, User, TrendingUp, CheckCircle, Percent } from 'lucide-react';
import { DashboardSummary } from '@/lib/types';

interface SummaryCardsProps {
  summary: DashboardSummary | null;
  activeBrokerTab: string;
  onSelectBrokerTab: (brokerId: string) => void;
}

export default function SummaryCards({
  summary,
  activeBrokerTab,
  onSelectBrokerTab,
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

  const { mainBroker, coBrokers } = summary;

  return (
    <div className="space-y-4">
      {/* 1. Main-Broker Primary Live Inventory Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-700/60 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Broker Identity */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Building2 className="w-3.5 h-3.5" />
                Primary Owner & Main-Broker
              </span>
              <span className="text-xs text-slate-400 font-mono">Live Inventory Shared Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-['Outfit']">
              {mainBroker.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Central Master Warehouse Stock (Chiniot Godowns). Automatically synchronized with Co-Brokers.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6 shrink-0">
            {/* Available Bags */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 px-4">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                <span>Available Stock</span>
                <Package className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {mainBroker.availableBags.toLocaleString()}{' '}
                <span className="text-xs font-sans font-medium text-emerald-400">Bags / Pcs</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Remain: <strong className="text-slate-200">{mainBroker.remainBags.toLocaleString()}</strong>
              </div>
            </div>

            {/* Total Weight */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 px-4">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                <span>Total Live Weight</span>
                <Scale className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {Math.round(mainBroker.totalWeightMaunds).toLocaleString()}{' '}
                <span className="text-xs font-sans font-medium text-sky-400">Maunds (من)</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                ≈ {(mainBroker.totalWeightKg / 1000).toFixed(1)} Metric Tons
              </div>
            </div>

            {/* Total Valuation in PKR */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 px-4 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                <span>Total Stock Valuation</span>
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                PKR {Math.round(mainBroker.totalValuationPkr).toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Live Real-Time Value
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Co-Broker Badges / Interactive Filter Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-600" />
            Associated Co-Brokers & Quota Trackers
          </span>
          <span className="text-xs text-slate-400">Click a broker badge to filter table data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* "All Brokers" Tab */}
          <button
            onClick={() => onSelectBrokerTab('ALL')}
            className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
              activeBrokerTab === 'ALL'
                ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800">ALL BROKERS</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                Combined
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">
              {summary.grandTotals.totalDispatches} Dispatches
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Total Dispatched: <strong>{summary.grandTotals.totalBags.toLocaleString()} Bags</strong>
            </div>
          </button>

          {/* Individual Co-Brokers */}
          {coBrokers.map((cb) => {
            const isSelected = activeBrokerTab === cb.id;
            return (
              <button
                key={cb.id}
                onClick={() => onSelectBrokerTab(cb.id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <div className="font-bold text-sm text-slate-900 truncate" title={cb.name}>
                    {cb.name}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full shrink-0">
                    Co-Broker
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-2 text-xs">
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-semibold">Stock Sold</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {cb.soldBags} <span className="font-normal text-[10px]">Bags</span>
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-semibold">Remain Quota</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      {cb.remainQuotaBags} <span className="font-normal text-[10px]">Bags</span>
                    </span>
                  </div>
                </div>

                {/* Quota Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>Quota: {cb.allocatedQuotaBags} Bags</span>
                    <span className="font-mono font-bold text-indigo-600">{cb.quotaPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        cb.quotaPercentage > 80 ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${Math.min(100, cb.quotaPercentage)}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
