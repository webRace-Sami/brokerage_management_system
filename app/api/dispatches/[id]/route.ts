import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dispatches = await db.getDispatches({});
    const dispatch = dispatches.find((d: any) => d.id === params.id);

    if (!dispatch) {
      return NextResponse.json({ error: 'Dispatch not found' }, { status: 404 });
    }

    return NextResponse.json({ dispatch });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch dispatch', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await db.updateDispatch(params.id, body);

    if (!updated) {
      return NextResponse.json({ error: 'Dispatch record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, dispatch: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update dispatch', details: error.message },
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
        { error: 'Permission denied. Only authorized Administrator can delete dispatch records.' },
        { status: 403 }
      );
    }

    const deleted = await db.deleteDispatch(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Dispatch record not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Dispatch ${deleted.biltyNo} deleted successfully and inventory restored.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete dispatch', details: error.message },
      { status: 500 }
    );
  }
}
