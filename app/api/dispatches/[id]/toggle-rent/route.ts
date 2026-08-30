import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleToggle(params.id);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleToggle(params.id);
}

async function handleToggle(id: string) {
  try {
    const updated = await db.toggleRentStatus(id);

    if (!updated) {
      return NextResponse.json({ error: 'Dispatch record not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      dispatch: updated,
      message: `Rent status updated to ${updated.rentStatus}`,
    });
  } catch (error: any) {
    console.error('Toggle rent status error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle rent status', details: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { 'Allow': 'POST, PATCH, OPTIONS' },
  });
}
