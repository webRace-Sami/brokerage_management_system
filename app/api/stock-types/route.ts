import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stockTypes = await db.getStockTypes();
    return NextResponse.json({ stockTypes });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch stock types', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin permission required to add commodity stock types.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, nameUrdu, code, category, defaultUnit, standardWeightKg, defaultUnitPricePkr, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Stock Type Name is required.' }, { status: 400 });
    }

    const newType = await db.addStockType({
      name,
      nameUrdu,
      code,
      category,
      defaultUnit,
      standardWeightKg,
      defaultUnitPricePkr,
      description,
    });

    return NextResponse.json({ success: true, stockType: newType }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to add stock type', details: error.message },
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
