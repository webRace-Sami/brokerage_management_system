'use client';

import React from 'react';
import { X, Printer, Truck } from 'lucide-react';
import { DispatchData, CompanySettings } from '@/lib/types';

interface BiltyPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispatch: DispatchData | null;
  company?: CompanySettings | null;
}

export default function BiltyPrintModal({
  isOpen,
  onClose,
  dispatch,
  company,
}: BiltyPrintModalProps) {
  if (!isOpen || !dispatch) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalRent = dispatch.rentAmountPkr || 0;
  const advancePaid = dispatch.advancePaidPkr || 0;
  const remainingRent = dispatch.remainingRentPkr !== undefined ? dispatch.remainingRentPkr : Math.max(0, totalRent - advancePaid);
  const isPaid = remainingRent === 0;
  const irnNumber = dispatch.irn || dispatch.srNo;
  const unit = dispatch.quantityUnit || 'Bags';
  const slip = dispatch.weightSlipNo || 'xdk-2983 / 232444';

  const companyName = company?.name || 'MADINA GOODS TRANSPORT COMPANY';
  const companyPhone = company?.phone || '0300-6501234';
  const companyUan = company?.uan || '047-6331234';
  const companyLocation = company?.location || 'Sargodha Road Bypass, Chiniot, Punjab, Pakistan';
  const companyTerms = company?.terms || 'مال کی لوڈنگ و انلوڈنگ کے دوران مکمل احتیاط کی جاتی ہے۔ کسی بھی حادثہ کی صورت میں بلٹی شرائط لاگو ہوں گی۔';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-3xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[95vh]">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm sm:text-base font-['Outfit']">
              Transport Bilty Receipt (بلٹی پرنٹ) - {dispatch.irn || `IRN#${dispatch.srNo}`} ({dispatch.biltyNo})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white text-slate-900" id="printable-bilty">
          <div className="border-2 border-slate-900 rounded-lg p-5 sm:p-6 bg-white font-sans text-xs space-y-4">
            {/* Header / Company Title */}
            <div className="text-center border-b-2 border-slate-900 pb-3">
              <div className="text-[11px] font-bold text-slate-700 tracking-wider">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Outfit'] uppercase">
                {companyName}
              </h1>
              <div className="text-sm font-bold text-slate-800">
                گڈز ٹرانسپورٹ کمپنی (رجسٹرڈ)
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                Head Office: {companyLocation} | Booking: {companyPhone} {companyUan ? `| UAN: ${companyUan}` : ''}
              </p>
            </div>

            {/* Bilty Metadata Header Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-slate-300 pb-3 text-xs">
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-bold uppercase">Inspection Receipt</span>
                <span className="font-mono font-black text-slate-900 text-sm">{dispatch.irn || `IRN#${dispatch.srNo}`}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-bold uppercase">Bilty No.</span>
                <span className="font-mono font-black text-slate-900 text-sm">{dispatch.biltyNo}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-bold uppercase">Dispatch Date</span>
                <span className="font-medium text-slate-900">
                  {dispatch.dispatchDate || new Date(dispatch.createdAt).toLocaleDateString('en-GB')}
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-bold uppercase">Payment Status</span>
                <span
                  className={`font-bold px-1.5 py-0.5 rounded text-[11px] inline-block ${
                    isPaid ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {isPaid ? 'PAID (مکمل ادا)' : `PENDING (بقایا: ${remainingRent})`}
                </span>
              </div>
            </div>

            {/* 2 Columns: Consignor & Consignee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-300 pb-3">
              {/* Consignor */}
              <div className="border border-slate-300 rounded p-2.5 space-y-1">
                <span className="text-[10px] font-extrabold uppercase bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">
                  Consignor (ارسال کنندہ / بروکر)
                </span>
                <div className="font-bold text-sm text-slate-900 pt-1">{dispatch.brokerName}</div>
                <div className="text-[11px] text-slate-600">
                  Stock Source: <strong>{dispatch.stockSource === 'OWN_STOCK' ? 'Co-Broker Own Stock' : 'Main-Broker Shared Stock'}</strong>
                </div>
                <div className="text-[11px] text-slate-500">Dispatch Godown: Central Stand</div>
              </div>

              {/* Consignee */}
              <div className="border border-slate-300 rounded p-2.5 space-y-1">
                <span className="text-[10px] font-extrabold uppercase bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">
                  Consignee (وصول کنندہ / دوکاندار)
                </span>
                <div className="font-bold text-sm text-slate-900 pt-1">{dispatch.shopName}</div>
                <div className="text-[11px] text-slate-700">
                  Proprietor: <strong>{dispatch.shopkeeperName}</strong>
                  {dispatch.shopkeeperPhone ? ` (${dispatch.shopkeeperPhone})` : ''}
                </div>
                <div className="text-[11px] text-slate-600">
                  Destination: <strong>{dispatch.destinationCity}</strong> - {dispatch.destinationAddress}
                </div>
              </div>
            </div>

            {/* Vehicle, Driver & Weight Slip */}
            <div className="border border-slate-300 rounded p-2.5 bg-slate-50/50">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block font-semibold">Truck Number:</span>
                  <span className="font-mono font-black text-slate-900 text-sm">{dispatch.truckNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-semibold">Driver Name:</span>
                  <span className="font-bold text-slate-900">{dispatch.driverName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-semibold">Driver CNIC:</span>
                  <span className="font-mono text-slate-800">{dispatch.driverCnic}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-semibold">Weight Slip No. (کانٹا پرچی):</span>
                  <span className="font-mono font-bold text-amber-900 bg-amber-100 px-1 py-0.5 rounded">
                    {slip}
                  </span>
                </div>
              </div>
            </div>

            {/* Goods Table */}
            <div className="border border-slate-900 rounded overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900 uppercase">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Goods Description (تفصیل مال)</th>
                    <th className="p-2 text-right border-r border-slate-300">Quantity & Unit (تعداد)</th>
                    <th className="p-2 text-right border-r border-slate-300">Weight (وزن من)</th>
                    <th className="p-2 text-right">Freight (کرایہ PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900 border-r border-slate-300">
                      <div>{dispatch.materialDescription}</div>
                      {dispatch.stockType && (
                        <div className="text-[10px] text-purple-700 font-normal">Commodity: {dispatch.stockType}</div>
                      )}
                    </td>
                    <td className="p-2.5 text-right font-mono font-black text-slate-900 border-r border-slate-300 text-sm">
                      {dispatch.quantityBags.toLocaleString()} {unit}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900 border-r border-slate-300">
                      {dispatch.weightMaunds} Maunds ({dispatch.weightKg} kg)
                    </td>
                    <td className="p-2.5 text-right font-mono font-black text-slate-900 text-sm">
                      PKR {totalRent.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Rent & Remaining Balance Calculation */}
            <div className="flex justify-end">
              <div className="w-full sm:w-72 border border-slate-300 rounded p-3 space-y-1 bg-slate-50 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Freight (کل کرایہ):</span>
                  <span className="font-mono font-bold text-slate-900">
                    PKR {totalRent.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Paid / Advance (پیشگی):</span>
                  <span className="font-mono font-semibold text-emerald-700">
                    PKR {advancePaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-300 pt-1 font-bold">
                  <span className="text-slate-900">Remaining Balance (بقایا کرایہ):</span>
                  <span
                    className={`font-mono text-sm ${
                      remainingRent > 0 ? 'text-red-600 font-black' : 'text-emerald-700'
                    }`}
                  >
                    PKR {remainingRent.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-4 border-t border-slate-300 grid grid-cols-3 gap-4 text-center text-xs">
              <div className="border-t border-slate-400 pt-1">
                <div className="font-bold text-slate-800">{dispatch.dispatchedBy}</div>
                <div className="text-[10px] text-slate-500">Booking Munshi Signature (منشی دستخط)</div>
              </div>
              <div className="border-t border-slate-400 pt-1">
                <div className="font-bold text-slate-800">{dispatch.driverName}</div>
                <div className="text-[10px] text-slate-500">Driver Signature / Thumb (ڈرائیور انگوٹھا)</div>
              </div>
              <div className="border-t border-slate-400 pt-1">
                <div className="font-bold text-slate-800">{dispatch.shopkeeperName}</div>
                <div className="text-[10px] text-slate-500">Receiver Signature (وصول کنندہ دستخط)</div>
              </div>
            </div>

            <div className="text-[9px] text-slate-500 text-center pt-2 border-t border-dashed border-slate-300">
              * نوٹ: {companyTerms}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print">
          <span className="text-xs text-slate-500">
            Standard Thermal / A4 Print Format Supported
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bilty Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
