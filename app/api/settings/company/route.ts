import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await db.getCompanySettings();
    return NextResponse.json({ company: settings });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch company settings', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only Admin can update company profile and business settings.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updated = await db.updateCompanySettings(body);

    return NextResponse.json({
      success: true,
      company: updated,
      message: 'Company profile updated successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update company settings', details: error.message },
      { status: 500 }
    );
  }
}
