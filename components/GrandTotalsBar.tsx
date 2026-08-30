'use client';

import React from 'react';
import { PackageCheck, Scale, Banknote, CheckCircle2, Clock3 } from 'lucide-react';
import { DashboardSummary } from '@/lib/types';

interface GrandTotalsBarProps {
  summary: DashboardSummary | null;
}

export default function GrandTotalsBar({ summary }: GrandTotalsBarProps) {
  if (!summary) return null;

  const { grandTotals } = summary;

  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-md border border-slate-800 p-3.5 sm:p-4 mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-2 border-b lg:border-b-0 lg:border-r border-slate-800 pb-2 lg:pb-0 lg:pr-4 shrink-0">
          <div className="w-2.5 h-7 bg-emerald-500 rounded-full"></div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              Grand Total Metrics Bar
            </div>
            <div className="text-[11px] text-slate-400">Fixed Cumulative Outward Activity</div>
          </div>
        </div>

        {/* 3 Metric Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
          {/* 1. Grand Total Bags / Nugs */}
          <div className="flex items-center gap-3 bg-slate-800/70 rounded-lg p-2.5 px-3 border border-slate-700/60">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">
                Grand Total Dispatched
              </div>
              <div className="text-lg font-black text-white font-mono leading-tight">
                {grandTotals.totalBags.toLocaleString()}{' '}
                <span className="text-xs font-sans font-normal text-slate-300">Nugs / Bags</span>
              </div>
            </div>
          </div>

          {/* 2. Grand Total Weight */}
          <div className="flex items-center gap-3 bg-slate-800/70 rounded-lg p-2.5 px-3 border border-slate-700/60">
            <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">
                Grand Total Weight
              </div>
              <div className="text-lg font-black text-white font-mono leading-tight">
                {grandTotals.totalWeightMaunds.toLocaleString()}{' '}
                <span className="text-xs font-sans font-normal text-sky-300">Maunds (من)</span>
              </div>
              <div className="text-[10px] text-slate-400">
                {grandTotals.totalWeightKg.toLocaleString()} kg ({grandTotals.totalWeightTons} Tons)
              </div>
            </div>
          </div>

          {/* 3. Rent / Bilty Pending vs Paid */}
          <div className="flex items-center gap-3 bg-slate-800/70 rounded-lg p-2.5 px-3 border border-slate-700/60">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Banknote className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] text-slate-400 font-semibold uppercase flex items-center justify-between">
                <span>Rent / Freight Collection</span>
                <span className="font-mono text-slate-300">PKR {grandTotals.totalRentPkr.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Paid: PKR {grandTotals.paidRentPkr.toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                  <Clock3 className="w-3 h-3 text-amber-400" />
                  Pending: PKR {grandTotals.pendingRentPkr.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
