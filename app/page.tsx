import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, ArrowRight, Package, MapPin, Phone, Building2, BarChart2, CheckCircle } from 'lucide-react';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight font-['Outfit']">
                  Madina Goods Transport Company
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  Chiniot
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Premier Logistics & Brokerage Management System (چنیوٹ منشی پورٹل)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/40 transition-all hover:scale-105 active:scale-95"
            >
              <span>Munshi Portal Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Information & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Registered Goods Forwarding & Central Brokerage System</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-['Outfit'] leading-[1.1]">
              Madina Goods Transport Company,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
                Chiniot
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
              Complete digital dispatch, live shared inventory synchronization between Main-Broker and Co-Brokers, automated stock deduction, Urdu/English Bilty generation, and rent collection tracking for the Munshis of Chiniot.
            </p>

            {/* Quick Feature Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-center gap-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700/70">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  Shared Live Inventory & Valuations
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700/70">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  Instant Bilty Slip (بلٹی) Printing
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700/70">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  Single Admin & 5 Munshi Accounts
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700/70">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  Excel Export & Visual Analytics
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/login"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-xl font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-900/50 transition-all hover:scale-105"
              >
                <Truck className="w-5 h-5" />
                <span>Enter Munshi Dashboard</span>
              </Link>
              <Link
                href="/analytics"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base border border-slate-700 transition-all"
              >
                <BarChart2 className="w-5 h-5 text-sky-400" />
                <span>View Analytics</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Decorative Pakistani Heavy Transport Art & Metrics Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 bg-gradient-to-b from-slate-800 to-slate-900 p-6 sm:p-8 shadow-2xl shadow-emerald-950/50">
              {/* Decorative Truck Graphic Badge */}
              <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3">
                  <Truck className="w-10 h-10 text-emerald-400 animate-pulse" />
                </div>
                <h3 className="text-xl font-black text-white font-['Outfit']">
                  Madina Goods Chiniot
                </h3>
                <p className="text-xs text-emerald-400 font-mono font-semibold mt-1">
                  مدینہ گڈز ٹرانسپورٹ اینڈ بروکرز کمپنی
                </p>
                <div className="text-xs text-slate-400 mt-2">
                  Daily freight routes: Chiniot ➔ Faisalabad ➔ Lahore ➔ Karachi ➔ Sargodha
                </div>
              </div>

              {/* Live Status Highlights */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/90 border border-slate-700/70 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>Main Broker Central Godowns</span>
                  </div>
                  <span className="font-mono font-bold text-white">Chiniot Punjab</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/90 border border-slate-700/70 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Package className="w-4 h-4 text-sky-400" />
                    <span>Commodities Tracked</span>
                  </div>
                  <span className="font-mono font-bold text-sky-300">Wheat, Rice, Sugar, Cotton, DAP</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/90 border border-slate-700/70 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>Booking Munshi Stand UAN</span>
                  </div>
                  <span className="font-mono font-bold text-amber-300">0300-6501234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
