import React from 'react';
import { Shield, Truck, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 mt-12 no-print">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white font-['Outfit']">
              Madina Goods Transport Company, Chiniot
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> Sargodha Road Godowns & Bypass Stand, Chiniot
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Phone className="w-3.5 h-3.5 text-emerald-500" /> UAN: 0300-6501234
            </span>
            <span className="text-slate-500">|</span>
            <span className="font-medium text-slate-400">
              All reserved by <strong className="text-slate-200">WebRace Co.</strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
