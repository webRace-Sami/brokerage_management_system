'use client';

import React, { useState, useEffect } from 'react';
import { X, Building2, Phone, MapPin, FileText, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { CompanySettings, UserProfile } from '@/lib/types';

interface CompanySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  company: CompanySettings | null;
  currentUser: UserProfile | null;
}

export default function CompanySettingsModal({
  isOpen,
  onClose,
  onSuccess,
  company,
  currentUser,
}: CompanySettingsModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [uan, setUan] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [terms, setTerms] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setPhone(company.phone || '');
      setUan(company.uan || '');
      setLocation(company.location || '');
      setDescription(company.description || '');
      setEstablishedYear(company.establishedYear || '1998');
      setTerms(company.terms || '');
    }
  }, [company, isOpen]);

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'ADMIN';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setError('Only Admin can update company profile and business settings.');
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/settings/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          uan,
          location,
          description,
          establishedYear,
          terms,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update company settings.');

      setSuccessMsg('Company business settings updated successfully!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-['Outfit']">
                Company & Business Settings (کمپنی پروفائل سیٹنگز)
              </h3>
              <p className="text-xs text-slate-400">
                Manage Transport Company Name, Contact, Godown Location, and Terms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Company Name (کمپنی کا نام) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Madina Goods Transport Company"
                className="w-full px-3.5 py-2 text-sm font-bold text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
                disabled={!isAdmin}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile / Booking Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-6501234"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                required
                disabled={!isAdmin}
              />
            </div>

            {/* UAN / Landline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                UAN / Landline
              </label>
              <input
                type="text"
                value={uan}
                onChange={(e) => setUan(e.target.value)}
                placeholder="047-6331234"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                disabled={!isAdmin}
              />
            </div>

            {/* Established Year */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Established Year
              </label>
              <input
                type="text"
                value={establishedYear}
                onChange={(e) => setEstablishedYear(e.target.value)}
                placeholder="1998"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                disabled={!isAdmin}
              />
            </div>

            {/* Location */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Head Office & Godown Location (پتہ / اڈہ) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Sargodha Road Bypass, Chiniot, Punjab, Pakistan"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
                disabled={!isAdmin}
              />
            </div>

            {/* Business Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Business Description & Tagline
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of transport operations..."
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                disabled={!isAdmin}
              ></textarea>
            </div>

            {/* Terms & Conditions */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bilty Terms & Conditions (بلٹی شرائط)
              </label>
              <textarea
                rows={2}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Terms printed at bottom of Bilty slips..."
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-sans"
                disabled={!isAdmin}
              ></textarea>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between mt-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isAdmin ? 'Admin settings authority' : 'View only mode (Admin required to edit)'}</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
              >
                Cancel
              </button>
              {isAdmin && (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Settings'}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
