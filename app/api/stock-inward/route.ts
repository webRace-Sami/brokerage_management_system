import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const body = await request.json();

    const {
      stockItemId,
      quantityBags,
      supplierName,
      vehicleNo,
      warehouseLocation,
      notes,
    } = body;

    if (!stockItemId || !quantityBags || Number(quantityBags) <= 0) {
      return NextResponse.json(
        { error: 'Valid Stock Item and bag quantity are required.' },
        { status: 400 }
      );
    }

    const stockItems = await db.getStockItems();
    const stockItem = stockItems.find((s: any) => s.id === stockItemId);

    if (!stockItem) {
      return NextResponse.json({ error: 'Stock item not found' }, { status: 404 });
    }

    const parsedBags = Number(quantityBags);
    const weightKg = parsedBags * stockItem.standardBagWeightKg;
    const weightMaunds = Number((weightKg / 40.0).toFixed(2));
    const totalValuationPkr = parsedBags * stockItem.unitPricePkr;

    const inward = await db.addStockInward({
      irnCode: stockItem.code,
      stockItemId: stockItem.id,
      materialName: stockItem.name,
      quantityBags: parsedBags,
      weightKg,
      weightMaunds,
      unitRatePkr: stockItem.unitPricePkr,
      totalValuationPkr,
      supplierName: supplierName?.trim() || 'Direct Godown Transfer',
      vehicleNo: vehicleNo?.toUpperCase().trim() || 'LOCAL',
      warehouseLocation: warehouseLocation?.trim() || 'Sargodha Road Main Godown #1, Chiniot',
      receivedBy: user?.name || 'Munshi Incharge',
      notes: notes || null,
      inwardDate: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, inward }, { status: 201 });
  } catch (error: any) {
    console.error('Stock inward error:', error);
    return NextResponse.json(
      { error: 'Failed to record stock inward', details: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { 'Allow': 'POST, OPTIONS' },
  });
}
