import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const brokers = await db.getBrokers();
    const stockItems = await db.getStockItems();
    const dispatches = await db.getDispatches({});

    const mainBroker = brokers.find((b: any) => b.type === 'MAIN_BROKER') || {
      id: 'broker_main',
      name: 'Madina Main Broker (Haji Rasheed & Sons)',
      type: 'MAIN_BROKER',
      allocatedQuotaBags: 5000,
      allocatedQuotaWeight: 6250,
      commissionRate: 0,
      city: 'Chiniot',
      phone: '0300-9876543',
    };

    const coBrokersList = brokers.filter((b: any) => b.type === 'CO_BROKER');

    // Total available stock across master commodities
    const totalAvailableBags = stockItems.reduce((sum: number, item: any) => sum + (item.availableBags || 0), 0);
    const totalAvailableWeightKg = stockItems.reduce((sum: number, item: any) => sum + (item.availableWeightKg || 0), 0);
    const totalValuationPkr = stockItems.reduce(
      (sum: number, item: any) => sum + (item.availableBags || 0) * (item.unitPricePkr || 0),
      0
    );

    // Co-broker individual summaries
    const coBrokersSummary = coBrokersList.map((cb: any) => {
      const cbDispatches = dispatches.filter((d: any) => d.brokerId === cb.id);
      const soldBags = cbDispatches.reduce((sum: number, d: any) => sum + d.quantityBags, 0);
      const soldWeightKg = cbDispatches.reduce((sum: number, d: any) => sum + d.weightKg, 0);
      const soldWeightMaunds = cbDispatches.reduce((sum: number, d: any) => sum + d.weightMaunds, 0);
      const remainQuotaBags = Math.max(0, cb.allocatedQuotaBags - soldBags);
      const quotaPercentage =
        cb.allocatedQuotaBags > 0
          ? Math.min(100, Math.round((soldBags / cb.allocatedQuotaBags) * 100))
          : 0;

      const avgBagPrice =
        stockItems.length > 0
          ? stockItems.reduce((sum: number, s: any) => sum + s.unitPricePkr, 0) / stockItems.length
          : 7000;
      const totalValuationPkr = remainQuotaBags * avgBagPrice;

      return {
        id: cb.id,
        name: cb.name,
        phone: cb.phone,
        city: cb.city,
        allocatedQuotaBags: cb.allocatedQuotaBags,
        allocatedQuotaWeight: cb.allocatedQuotaWeight,
        commissionRate: cb.commissionRate,
        soldBags,
        soldWeightKg,
        soldWeightMaunds,
        remainQuotaBags,
        totalValuationPkr,
        quotaPercentage,
      };
    });

    // Grand Total Metrics
    const grandTotalBags = dispatches.reduce((sum: number, d: any) => sum + d.quantityBags, 0);
    const grandTotalWeightKg = dispatches.reduce((sum: number, d: any) => sum + d.weightKg, 0);
    const grandTotalWeightMaunds = dispatches.reduce((sum: number, d: any) => sum + d.weightMaunds, 0);
    const grandTotalWeightTons = Number((grandTotalWeightKg / 1000).toFixed(2));

    const grandTotalRentPkr = dispatches.reduce((sum: number, d: any) => sum + d.rentAmountPkr, 0);
    const paidRentPkr = dispatches
      .filter((d: any) => d.rentStatus === 'PAID')
      .reduce((sum: number, d: any) => sum + d.rentAmountPkr, 0);
    const pendingRentPkr = dispatches
      .filter((d: any) => d.rentStatus === 'PENDING')
      .reduce((sum: number, d: any) => sum + d.rentAmountPkr, 0);

    return NextResponse.json({
      mainBroker: {
        id: mainBroker.id,
        name: mainBroker.name,
        totalValuationPkr,
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
        pendingRentPkr,
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
