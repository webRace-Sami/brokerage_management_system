import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const updates: any = {};
    if (body.name !== undefined) updates.name = body.name.trim();
    if (body.username !== undefined) updates.username = body.username.trim().toLowerCase();
    if (body.email !== undefined) updates.email = body.email.trim();
    if (body.role !== undefined) updates.role = body.role;
    if (body.phone !== undefined) updates.phone = body.phone.trim();
    if (body.plainPassword) {
      updates.plainPassword = body.plainPassword.trim();
    }

    const updated = await db.updateUser(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 400 });
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
    const id = params.id;
    const deleted = await db.deleteUser(id);
    if (!deleted) {
      return NextResponse.json({ error: 'User not found or cannot be deleted.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `User "${deleted.name}" deleted successfully.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { 'Allow': 'GET, POST, PUT, DELETE, OPTIONS' },
  });
}
