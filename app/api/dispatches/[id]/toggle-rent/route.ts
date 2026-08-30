import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updated = await db.toggleRentStatus(params.id);

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
