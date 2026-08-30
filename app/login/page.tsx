'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Truck, ShieldCheck, UserCheck, Lock, User, KeyRound, AlertCircle, ArrowRight, Check } from 'lucide-react';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!usernameOrEmail.trim() || !password.trim()) {
      setError('Please enter your authorized username/email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      // Store in localStorage for fast UI rendering
      localStorage.setItem('madina_user', JSON.stringify(data.user));

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing authorized accounts
  const handleQuickFill = (user: string, pass: string) => {
    setUsernameOrEmail(user);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/80">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-md">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight font-['Outfit']">
                Madina Goods Transport Company
              </span>
              <span className="text-xs text-emerald-400 block font-medium">Chiniot - Munshi Portal</span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Login Form Box */}
      <main className="max-w-md mx-auto px-4 py-8 sm:py-12 w-full flex-1 flex flex-col justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Heading */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white font-['Outfit']">
              Munshi Portal Login
            </h2>
            <p className="text-xs text-slate-400">
              Enter your authorized staff or administrator credentials
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                Username or Email Address
              </label>
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="e.g. admin or munshi1"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-inner"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-inner font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-4 rounded-xl text-sm shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying Security Token...</span>
              ) : (
                <>
                  <span>Sign In to Munshi Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick-Fill Demo Credentials Selector */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-2.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Quick One-Click Authorized Accounts
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Admin Button */}
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'MadinaAdmin@2026!')}
                className="p-2.5 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-600/40 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Admin Account
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">admin (Full Control)</div>
              </button>

              {/* Munshi 1 Button */}
              <button
                type="button"
                onClick={() => handleQuickFill('munshi1', 'MunshiPass@2026')}
                className="p-2.5 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-600/40 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-300">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Munshi Aslam
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">munshi1 (Staff)</div>
              </button>

              {/* Munshi 2 Button */}
              <button
                type="button"
                onClick={() => handleQuickFill('munshi2', 'MunshiPass@2026')}
                className="p-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition-all"
              >
                <div className="text-[11px] font-bold text-slate-200">Munshi Tariq</div>
                <div className="text-[10px] text-slate-400 font-mono">munshi2</div>
              </button>

              {/* Munshi 3 Button */}
              <button
                type="button"
                onClick={() => handleQuickFill('munshi3', 'MunshiPass@2026')}
                className="p-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition-all"
              >
                <div className="text-[11px] font-bold text-slate-200">Munshi Imran</div>
                <div className="text-[10px] text-slate-400 font-mono">munshi3</div>
              </button>
            </div>

            <div className="text-[10px] text-center text-slate-500 pt-1">
              * Protected System: Public registration disabled. Only developer/admin provisioned staff can access.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
