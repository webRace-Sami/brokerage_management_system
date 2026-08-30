import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brokerId = searchParams.get('brokerId') || undefined;
    const rentStatus = searchParams.get('rentStatus') || undefined;
    const search = searchParams.get('search')?.toLowerCase().trim() || undefined;

    const dispatches = await db.getDispatches({ brokerId, rentStatus, search });

    return NextResponse.json({ dispatches, total: dispatches.length });
  } catch (error: any) {
    console.error('Fetch dispatches error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dispatches', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const body = await request.json();

    const {
      brokerId,
      stockItemId,
      materialDescription,
      quantityBags,
      weightKg,
      truckNo,
      driverName,
      driverCnic,
      driverPhone,
      shopName,
      shopkeeperName,
      shopkeeperPhone,
      destinationAddress,
      destinationCity,
      rentAmountPkr,
      rentStatus,
      advancePaidPkr,
      paymentMethod,
      remarks,
    } = body;

    // Validation
    if (!brokerId || !quantityBags || !truckNo || !driverName || !driverCnic || !shopName || !shopkeeperName || !destinationCity) {
      return NextResponse.json(
        { error: 'Please fill all required dispatch fields.' },
        { status: 400 }
      );
    }

    const brokers = await db.getBrokers();
    const broker = brokers.find((b: any) => b.id === brokerId);
    if (!broker) {
      return NextResponse.json({ error: 'Selected broker not found.' }, { status: 404 });
    }

    const stockItems = await db.getStockItems();
    let resolvedStockItem = null;
    if (stockItemId) {
      resolvedStockItem = stockItems.find((s: any) => s.id === stockItemId);
      if (resolvedStockItem && resolvedStockItem.availableBags < Number(quantityBags)) {
        return NextResponse.json(
          {
            error: `Insufficient stock! Only ${resolvedStockItem.availableBags} bags available for ${resolvedStockItem.name}.`,
          },
          { status: 400 }
        );
      }
    }

    const calculatedWeightKg = Number(weightKg) || Number(quantityBags) * (resolvedStockItem?.standardBagWeightKg || 50);
    const calculatedWeightMaunds = Number((calculatedWeightKg / 40.0).toFixed(2));
    const parsedRent = Number(rentAmountPkr) || 0;
    const parsedAdvance = Number(advancePaidPkr) || (rentStatus === 'PAID' ? parsedRent : 0);
    const balance = Math.max(0, parsedRent - parsedAdvance);

    const dispatch = await db.createDispatch({
      brokerId: broker.id,
      brokerName: broker.name,
      brokerType: broker.type,
      stockItemId: stockItemId || null,
      materialDescription: materialDescription || resolvedStockItem?.name || 'Commercial Goods',
      quantityBags: Number(quantityBags),
      weightKg: calculatedWeightKg,
      weightMaunds: calculatedWeightMaunds,
      truckNo: truckNo.toUpperCase().trim(),
      driverName: driverName.trim(),
      driverCnic: driverCnic.trim(),
      driverPhone: driverPhone ? driverPhone.trim() : null,
      shopName: shopName.trim(),
      shopkeeperName: shopkeeperName.trim(),
      shopkeeperPhone: shopkeeperPhone ? shopkeeperPhone.trim() : null,
      destinationAddress: destinationAddress?.trim() || 'Main City Bazaar',
      destinationCity: destinationCity.trim(),
      rentAmountPkr: parsedRent,
      rentStatus: rentStatus || (balance === 0 ? 'PAID' : 'PENDING'),
      advancePaidPkr: parsedAdvance,
      balancePkr: balance,
      paymentMethod: paymentMethod || 'Cash',
      dispatchedBy: user?.name || 'Munshi Muhammad Aslam',
      remarks: remarks || null,
    });

    return NextResponse.json({ success: true, dispatch }, { status: 201 });
  } catch (error: any) {
    console.error('Create dispatch error:', error);
    return NextResponse.json(
      { error: 'Failed to create dispatch entry', details: error.message },
      { status: 500 }
    );
  }
}
