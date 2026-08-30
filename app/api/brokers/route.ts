import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
