import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brokerId = searchParams.get('brokerId') || undefined;
    const rentStatus = searchParams.get('rentStatus') || undefined;
    const search = searchParams.get('search')?.toLowerCase().trim() || undefined;
    const irnParam = searchParams.get('irn') || searchParams.get('srNo');
    const irn = irnParam ? irnParam.trim() : undefined;

    const dispatches = await db.getDispatches({ brokerId, rentStatus, search, irn });

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
      biltyNo,
      brokerId,
      stockSource,
      stockItemId,
      stockType,
      materialDescription,
      quantityBags,
      quantityUnit, // 'Bags' | 'Nugs' | 'Box' | 'Drums' | 'Bales' | 'Pcs'
      weightKg,
      weightSlipNo, // e.g. "xdk-2983 / 232444"
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
      paymentDate,
      dispatchDate,
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

    const resolvedStockSource = stockSource || (broker.type === 'MAIN_BROKER' ? 'MAIN_BROKER_STOCK' : 'OWN_STOCK');

    // Stock verification
    const stockItems = await db.getStockItems();
    let resolvedStockItem = null;

    if (resolvedStockSource === 'MAIN_BROKER_STOCK') {
      if (broker.type === 'CO_BROKER' && !broker.isAttachedToMainBroker) {
        return NextResponse.json(
          { error: `${broker.name} is not currently authorized/attached to sell Main-Broker stock.` },
          { status: 400 }
        );
      }

      if (stockItemId) {
        resolvedStockItem = stockItems.find((s: any) => s.id === stockItemId);
        if (resolvedStockItem && resolvedStockItem.availableBags < Number(quantityBags)) {
          return NextResponse.json(
            {
              error: `Insufficient Main-Broker stock! Only ${resolvedStockItem.availableBags} available for ${resolvedStockItem.name}.`,
            },
            { status: 400 }
          );
        }
      }
    } else {
      if ((broker.ownAvailableBags || 0) < Number(quantityBags)) {
        return NextResponse.json(
          {
            error: `Insufficient own stock! ${broker.name} only has ${broker.ownAvailableBags || 0} in own stock.`,
          },
          { status: 400 }
        );
      }
    }

    const calculatedWeightKg = Number(weightKg) || Number(quantityBags) * (resolvedStockItem?.standardBagWeightKg || 50);
    const calculatedWeightMaunds = Number((calculatedWeightKg / 40.0).toFixed(2));
    const parsedRent = Number(rentAmountPkr) || 0;
    const parsedAdvance = Number(advancePaidPkr) || (rentStatus === 'PAID' ? parsedRent : 0);

    const dispatch = await db.createDispatch({
      biltyNo: biltyNo ? biltyNo.trim() : undefined,
      brokerId: broker.id,
      brokerName: broker.name,
      brokerType: broker.type,
      stockSource: resolvedStockSource,
      stockItemId: stockItemId || null,
      stockType: stockType || (resolvedStockItem ? resolvedStockItem.name : 'General Goods'),
      materialDescription: materialDescription || resolvedStockItem?.name || 'Commercial Goods',
      quantityBags: Number(quantityBags),
      quantityUnit: quantityUnit || 'Bags',
      weightKg: calculatedWeightKg,
      weightMaunds: calculatedWeightMaunds,
      weightSlipNo: weightSlipNo || `WS-${Date.now().toString().slice(-4)} / ${Math.floor(100000 + Math.random() * 900000)}`,
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
      advancePaidPkr: parsedAdvance,
      paymentMethod: paymentMethod || 'Cash',
      paymentDate: paymentDate || dispatchDate || new Date().toISOString().split('T')[0],
      dispatchDate: dispatchDate || new Date().toISOString().split('T')[0],
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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { 'Allow': 'GET, POST, OPTIONS' },
  });
}
