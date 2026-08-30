import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin permission required to update stock types.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updated = await db.updateStockType(params.id, body);

    if (!updated) {
      return NextResponse.json({ error: 'Stock Type not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, stockType: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update stock type', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return PUT(request, { params });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin permission required to delete stock types.' },
        { status: 403 }
      );
    }

    const deleted = await db.deleteStockType(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Stock Type not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Stock Type ${deleted.name} removed.` });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete stock type', details: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { 'Allow': 'GET, POST, PUT, DELETE, OPTIONS' },
  });
}
