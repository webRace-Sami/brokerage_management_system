'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  BarChart3,
  TrendingUp,
  Package,
  Scale,
  Banknote,
  Truck,
  ArrowLeft,
  RefreshCw,
  Building,
} from 'lucide-react';
import { DashboardSummary, DispatchData, UserProfile } from '@/lib/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function AnalyticsPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [dispatches, setDispatches] = useState<DispatchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [authRes, sumRes, dispRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/dashboard/summary'),
          fetch('/api/dispatches'),
        ]);

        if (authRes.ok) {
          const authData = await authRes.json();
          setCurrentUser(authData.user);
        } else {
          const stored = localStorage.getItem('madina_user');
          if (stored) setCurrentUser(JSON.parse(stored));
        }

        if (sumRes.ok) {
          const sumData = await sumRes.json();
          setSummary(sumData);
        }

        if (dispRes.ok) {
          const dispData = await dispRes.json();
          setDispatches(dispData.dispatches || []);
        }
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 1. Stock by Commodity Data
  const stockLabels = summary?.stockItems?.map((s) => s.name.split(' ')[0]) || [];
  const availableBags = summary?.stockItems?.map((s) => s.availableBags) || [];
  const dispatchedBags = summary?.stockItems?.map((s) => s.totalBagsInward - s.availableBags) || [];

  const stockChartData = {
    labels: stockLabels,
    datasets: [
      {
        label: 'Available in Godown',
        data: availableBags,
        backgroundColor: '#10b981',
        borderRadius: 6,
      },
      {
        label: 'Dispatched Outward',
        data: dispatchedBags,
        backgroundColor: '#6366f1',
        borderRadius: 6,
      },
    ],
  };

  // 2. Co-Broker Quota Utilization
  const brokerLabels = summary?.coBrokers?.map((b) => b.name.split(' ')[0]) || [];
  const brokerSold = summary?.coBrokers?.map((b) => b.soldBags) || [];
  const brokerRemain = summary?.coBrokers?.map((b) => b.remainQuotaBags) || [];

  const brokerChartData = {
    labels: brokerLabels,
    datasets: [
      {
        label: 'Sold / Dispatched',
        data: brokerSold,
        backgroundColor: '#f59e0b',
        borderRadius: 6,
      },
      {
        label: 'Remaining Quota',
        data: brokerRemain,
        backgroundColor: '#0284c7',
        borderRadius: 6,
      },
    ],
  };

  // 3. Rent Payment Doughnut Data
  const paidRent = summary?.grandTotals?.paidRentPkr || 0;
  const pendingRent = summary?.grandTotals?.pendingRentPkr || 0;

  const rentChartData = {
    labels: ['Paid Freight (PKR)', 'Pending Freight (PKR)'],
    datasets: [
      {
        data: [paidRent, pendingRent],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // 4. Top Destination Cities
  const cityCounts: Record<string, number> = {};
  dispatches.forEach((d) => {
    cityCounts[d.destinationCity] = (cityCounts[d.destinationCity] || 0) + 1;
  });

  const cityLabels = Object.keys(cityCounts);
  const cityValues = Object.values(cityCounts);

  const cityChartData = {
    labels: cityLabels,
    datasets: [
      {
        label: 'Truck Dispatches Count',
        data: cityValues,
        backgroundColor: '#8b5cf6',
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar user={currentUser} />

      {/* Main Container */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                  Analytics & Visual Reports (تجزیاتی گراف)
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Madina Goods Transport Company, Chiniot - Operations & Brokerage Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Return to Live Table
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
            <span className="font-semibold text-slate-600">Generating analytics charts...</span>
          </div>
        ) : (
          <>
            {/* Top Stat Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Total Dispatched</div>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    {summary?.grandTotals.totalBags.toLocaleString()} Bags
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Total Weight</div>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    {summary?.grandTotals.totalWeightMaunds.toLocaleString()} Maunds
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Banknote className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Freight Paid</div>
                  <div className="text-xl font-black text-emerald-700 font-mono">
                    PKR {summary?.grandTotals.paidRentPkr.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Freight Pending</div>
                  <div className="text-xl font-black text-amber-700 font-mono">
                    PKR {summary?.grandTotals.pendingRentPkr.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graph 1: Stock by Commodity (Available vs Dispatched) */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-600" />
                    <span>Commodity Stock Distribution (Available vs Dispatched)</span>
                  </div>
                </div>
                <div className="h-64 sm:h-72">
                  <Bar
                    data={stockChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'top' as const } },
                    }}
                  />
                </div>
              </div>

              {/* Graph 2: Freight Rent Collection Health */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-amber-600" />
                    <span>Rent / Freight Collection Health (PKR)</span>
                  </div>
                </div>
                <div className="h-64 sm:h-72 flex items-center justify-center">
                  <Doughnut
                    data={rentChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'bottom' as const } },
                    }}
                  />
                </div>
              </div>

              {/* Graph 3: Co-Broker Quota Utilization */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <Building className="w-5 h-5 text-indigo-600" />
                    <span>Co-Broker Quota Volume vs Dispatches (Bags)</span>
                  </div>
                </div>
                <div className="h-64 sm:h-72">
                  <Bar
                    data={brokerChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'top' as const } },
                    }}
                  />
                </div>
              </div>

              {/* Graph 4: Top Destination Cities */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-purple-600" />
                    <span>Dispatch Frequency by Destination City</span>
                  </div>
                </div>
                <div className="h-64 sm:h-72">
                  <Bar
                    data={cityChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'top' as const } },
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
