import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin permission required to update broker settings.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updated = await db.updateBroker(params.id, body);

    if (!updated) {
      return NextResponse.json({ error: 'Broker not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, broker: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update broker', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin permission required to remove broker.' },
        { status: 403 }
      );
    }

    const deleted = await db.deleteBroker(params.id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Broker not found or cannot delete Main-Broker.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: `Broker ${deleted.name} removed.` });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete broker', details: error.message },
      { status: 500 }
    );
  }
}
