import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const stockItems = await db.getStockItems();
    return NextResponse.json({ stockItems });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch stock items', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin permission required to register master IRN items.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { code, name, category, standardBagWeightKg, unitPricePkr, description } = body;

    if (!code || !name || !unitPricePkr) {
      return NextResponse.json(
        { error: 'Code, Name, and Unit Price are required.' },
        { status: 400 }
      );
    }

    const item = await db.addStockItem({
      code: code.toUpperCase().trim(),
      name: name.trim(),
      category: category?.trim() || 'General Cargo',
      standardBagWeightKg: Number(standardBagWeightKg) || 50,
      unitPricePkr: Number(unitPricePkr),
      description: description?.trim() || '',
    });

    return NextResponse.json({ success: true, stockItem: item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create IRN Stock Item', details: error.message },
      { status: 500 }
    );
  }
}
