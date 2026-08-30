'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Truck, BarChart3, LayoutDashboard, LogOut, ShieldCheck, UserCheck, Clock, Calendar } from 'lucide-react';
import { UserProfile, CompanySettings } from '@/lib/types';

interface NavbarProps {
  user?: UserProfile | null;
  company?: CompanySettings | null;
}

export default function Navbar({ user, company }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      setDateStr(`${yyyy}${mm}${dd}`);
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('madina_user');
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error', e);
      router.push('/login');
    }
  };

  const companyName = company?.name || 'Madina Goods Transport Company';

  return (
    <header className="bg-slate-900 text-white shadow-lg border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Company Branding */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-md shadow-emerald-900/30 group-hover:scale-105 transition-transform">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-['Outfit']">
                    {companyName}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                    Chiniot
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Munshi Management & Live Brokerage Portal
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === '/dashboard'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/analytics"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === '/analytics'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics & Graphs</span>
            </Link>
          </nav>

          {/* User Profile & Live Date/Clock & Logout */}
          <div className="flex items-center gap-4">
            {/* Live Date (Upper) & Time (Lower) Header Box */}
            <div className="hidden lg:flex flex-col justify-center text-xs font-mono text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 shadow-inner">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Date: {dateStr || '...'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold mt-0.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>{time || 'Loading...'}</span>
              </div>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-white leading-tight">
                    {user.name}
                  </div>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    {user.role === 'ADMIN' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/40">
                        <ShieldCheck className="w-3 h-3 text-amber-400" />
                        Admin Authority
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-600/40">
                        <UserCheck className="w-3 h-3 text-emerald-400" />
                        Munshi Staff
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout Session"
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-300 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-700 hover:border-red-700/50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all"
              >
                Munshi Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
