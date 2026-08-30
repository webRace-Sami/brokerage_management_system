import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'madina_goods_transport_jwt_secret_key_2026';

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('madina_token')?.value || cookieStore.get('auth_token')?.value;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.role === 'ADMIN';
  } catch (e) {
    return false;
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized. Admin authority required.' }, { status: 403 });
    }

    const { id } = await context.params;
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

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized. Admin authority required.' }, { status: 403 });
    }

    const { id } = await context.params;
    const deleted = await db.deleteUser(id);
    if (!deleted) {
      return NextResponse.json({ error: 'User not found or cannot be deleted.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `User "${deleted.name}" deleted successfully.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 400 });
  }
}
