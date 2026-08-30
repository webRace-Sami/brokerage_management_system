import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = (await db.findUser({ id: payload.userId })) || (await db.findUser({ usernameOrEmail: payload.username }));

    if (user) {
      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.username === 'admin' ? 'ADMIN' : user.role,
          phone: user.phone || '',
        },
      });
    }

    return NextResponse.json({
      user: {
        id: payload.userId,
        name: payload.name,
        username: payload.username,
        email: payload.email,
        role: payload.username === 'admin' ? 'ADMIN' : payload.role,
        phone: '',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch user profile', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { 'Allow': 'GET, POST, OPTIONS' },
  });
}
