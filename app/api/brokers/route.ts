import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const brokers = await db.getBrokers();
    return NextResponse.json({ brokers });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch brokers', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin authority required to add new brokers to the business.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      type, // 'MAIN_BROKER' | 'CO_BROKER'
      phone,
      city,
      stockTypes,
      ownAvailableBags,
      manualStockValuationPkr,
      isAttachedToMainBroker,
      attachedToMainBrokerId,
      allocatedQuotaBags,
      commissionRate,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Broker Name and Phone number are required.' },
        { status: 400 }
      );
    }

    const newBroker = await db.createBroker({
      name,
      type: type || 'CO_BROKER',
      phone,
      city: city || 'Chiniot',
      stockTypes: stockTypes || ['General Cargo'],
      ownAvailableBags: Number(ownAvailableBags) || 0,
      manualStockValuationPkr: manualStockValuationPkr !== undefined && manualStockValuationPkr !== '' ? Number(manualStockValuationPkr) : undefined,
      isAttachedToMainBroker: isAttachedToMainBroker !== undefined ? Boolean(isAttachedToMainBroker) : true,
      attachedToMainBrokerId,
      allocatedQuotaBags: Number(allocatedQuotaBags) || (type === 'MAIN_BROKER' ? 0 : 500),
      commissionRate: Number(commissionRate) || (type === 'MAIN_BROKER' ? 0 : 2.0),
    });

    return NextResponse.json({ success: true, broker: newBroker }, { status: 201 });
  } catch (error: any) {
    console.error('Create broker error:', error);
    return NextResponse.json(
      { error: 'Failed to create broker', details: error.message },
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
