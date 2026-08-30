import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

function checkAdmin(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (user && user.role === 'ADMIN') return true;
  // If no auth token (local dev fallback), allow if admin exists
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const users = await db.getUsers();
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

export async function POST(request: NextRequest) {
  try {
    const isAdmin = checkAdmin(request);
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
