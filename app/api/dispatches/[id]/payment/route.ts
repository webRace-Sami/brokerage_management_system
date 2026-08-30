import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handlePayment(request, params.id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handlePayment(request, params.id);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handlePayment(request, params.id);
}

async function handlePayment(request: NextRequest, id: string) {
  try {
    const { advancePaidPkr, paymentMethod, paymentDate } = await request.json();

    if (advancePaidPkr === undefined || Number(advancePaidPkr) < 0) {
      return NextResponse.json(
        { error: 'Valid payment amount is required.' },
        { status: 400 }
      );
    }

    const updated = await db.updatePayment(
      id,
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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { 'Allow': 'POST, PUT, PATCH, OPTIONS' },
  });
}
