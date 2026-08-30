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

export async function GET() {
  try {
    const users = await db.getUsers();
    // Return sanitized users
    const safeUsers = users.map((u: any) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      role: u.role,
      phone: u.phone || '',
      plainPassword: u.plainPassword || '******',
      createdAt: u.createdAt,
    }));
    return NextResponse.json({ users: safeUsers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized. Admin authority required.' }, { status: 403 });
    }

    const body = await request.json();
    if (!body.name || !body.username || !body.plainPassword) {
      return NextResponse.json({ error: 'Name, Username, and Password are required.' }, { status: 400 });
    }

    const newUser = await db.createUser({
      name: body.name,
      username: body.username,
      email: body.email,
      plainPassword: body.plainPassword,
      role: body.role || 'EMPLOYEE',
      phone: body.phone,
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 400 });
  }
}
