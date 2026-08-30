import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { advancePaidPkr, paymentMethod, paymentDate } = await request.json();

    if (advancePaidPkr === undefined || Number(advancePaidPkr) < 0) {
      return NextResponse.json(
        { error: 'Valid payment amount is required.' },
        { status: 400 }
      );
    }

    const updated = await db.updatePayment(
      params.id,
      Number(advancePaidPkr),
      paymentMethod,
      paymentDate
    );

    if (!updated) {
      return NextResponse.json({ error: 'Dispatch record not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      dispatch: updated,
      message: `Payment updated: Paid PKR ${updated.advancePaidPkr}, Remaining: PKR ${updated.remainingRentPkr}`,
    });
  } catch (error: any) {
    console.error('Update payment error:', error);
    return NextResponse.json(
      { error: 'Failed to update payment details', details: error.message },
      { status: 500 }
    );
  }
}
