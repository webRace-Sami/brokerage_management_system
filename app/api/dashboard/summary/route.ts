import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const [company, stockTypes, brokers, stockItems, dispatches] = await Promise.all([
      db.getCompanySettings(),
      db.getStockTypes(),
      db.getBrokers(),
      db.getStockItems(),
      db.getDispatches({}),
    ]);

    const mainBrokersList = brokers.filter((b: any) => b.type === 'MAIN_BROKER');
    const coBrokersList = brokers.filter((b: any) => b.type === 'CO_BROKER');

    const totalAvailableBags = stockItems.reduce((sum: number, item: any) => sum + (item.availableBags || 0), 0);
    const totalAvailableWeightKg = stockItems.reduce((sum: number, item: any) => sum + (item.availableWeightKg || 0), 0);
    const calculatedValuationPkr = stockItems.reduce(
      (sum: number, item: any) => sum + (item.availableBags || 0) * (item.unitPricePkr || 0),
      0
    );

    // Map Main Brokers with manual valuation and stock types
    const mainBrokersSummary = mainBrokersList.map((mb: any) => {
      const isManual = mb.manualStockValuationPkr !== undefined && mb.manualStockValuationPkr !== null;
      const totalValuationPkr = isManual ? mb.manualStockValuationPkr : calculatedValuationPkr;

      return {
        id: mb.id,
        name: mb.name,
        phone: mb.phone,
        city: mb.city,
        stockTypes: mb.stockTypes || ['Wheat (گندم)', 'Basmati Rice (چاول)'],
        availableBags: mb.ownAvailableBags || totalAvailableBags,
        totalWeightKg: (mb.ownAvailableBags || totalAvailableBags) * 50,
        totalWeightMaunds: ((mb.ownAvailableBags || totalAvailableBags) * 50) / 40.0,
        remainBags: mb.ownAvailableBags || totalAvailableBags,
        totalValuationPkr,
        isManualValuation: isManual,
      };
    });

    // Map Co-Brokers with manual valuation, stock types, and attached Main Broker
    const coBrokersSummary = coBrokersList.map((cb: any) => {
      const cbDispatches = dispatches.filter((d: any) => d.brokerId === cb.id);

      const mainBrokerSoldDispatches = cbDispatches.filter((d: any) => d.stockSource === 'MAIN_BROKER_STOCK' || !d.stockSource);
      const soldBags = mainBrokerSoldDispatches.reduce((sum: number, d: any) => sum + d.quantityBags, 0);
      const soldWeightMaunds = mainBrokerSoldDispatches.reduce((sum: number, d: any) => sum + d.weightMaunds, 0);

      const ownSoldDispatches = cbDispatches.filter((d: any) => d.stockSource === 'OWN_STOCK');
      const ownSoldBags = ownSoldDispatches.reduce((sum: number, d: any) => sum + d.quantityBags, 0);

      const remainQuotaBags = Math.max(0, (cb.allocatedQuotaBags || 0) - soldBags);
      const quotaPercentage =
        cb.allocatedQuotaBags > 0
          ? Math.min(100, Math.round((soldBags / cb.allocatedQuotaBags) * 100))
          : 0;

      const isManual = cb.manualStockValuationPkr !== undefined && cb.manualStockValuationPkr !== null;
      const autoValuation = (cb.ownAvailableBags || 0) * 8000;
      const totalValuationPkr = isManual ? cb.manualStockValuationPkr : autoValuation;

      const attachedMain = mainBrokersList.find((m: any) => m.id === cb.attachedToMainBrokerId);

      return {
        id: cb.id,
        name: cb.name,
        phone: cb.phone,
        city: cb.city,
        stockTypes: cb.stockTypes || ['General Cargo'],
        ownAvailableBags: cb.ownAvailableBags || 0,
        ownAvailableWeight: cb.ownAvailableWeight || 0,
        isAttachedToMainBroker: cb.isAttachedToMainBroker !== undefined ? cb.isAttachedToMainBroker : true,
        attachedToMainBrokerName: attachedMain?.name || 'Primary Main-Broker',
        allocatedQuotaBags: cb.allocatedQuotaBags || 0,
        soldBags,
        ownSoldBags,
        remainQuotaBags,
        soldWeightMaunds,
        totalValuationPkr,
        isManualValuation: isManual,
        quotaPercentage,
      };
    });

    // Grand Totals
    const grandTotalBags = dispatches.reduce((sum: number, d: any) => sum + d.quantityBags, 0);
    const grandTotalWeightKg = dispatches.reduce((sum: number, d: any) => sum + d.weightKg, 0);
    const grandTotalWeightMaunds = dispatches.reduce((sum: number, d: any) => sum + d.weightMaunds, 0);
    const grandTotalWeightTons = Number((grandTotalWeightKg / 1000).toFixed(2));

    const grandTotalRentPkr = dispatches.reduce((sum: number, d: any) => sum + (d.rentAmountPkr || 0), 0);
    const paidRentPkr = dispatches.reduce((sum: number, d: any) => sum + (d.advancePaidPkr || 0), 0);
    const remainingRentPkr = Math.max(0, grandTotalRentPkr - paidRentPkr);

    return NextResponse.json({
      company,
      stockTypes,
      mainBrokers: mainBrokersSummary,
      mainBroker: mainBrokersSummary[0] || {
        name: 'Madina Main Broker',
        totalValuationPkr: calculatedValuationPkr,
        availableBags: totalAvailableBags,
        totalWeightKg: totalAvailableWeightKg,
        totalWeightMaunds: totalAvailableWeightKg / 40.0,
        remainBags: totalAvailableBags,
      },
      coBrokers: coBrokersSummary,
      grandTotals: {
        totalBags: grandTotalBags,
        totalWeightKg: grandTotalWeightKg,
        totalWeightMaunds: grandTotalWeightMaunds,
        totalWeightTons: grandTotalWeightTons,
        totalRentPkr: grandTotalRentPkr,
        paidRentPkr,
        remainingRentPkr,
        totalDispatches: dispatches.length,
      },
      stockItems,
    });
  } catch (error: any) {
    console.error('Summary error:', error);
    return NextResponse.json(
      { error: 'Failed to compute dashboard summary', details: error.message },
      { status: 500 }
    );
  }
}
