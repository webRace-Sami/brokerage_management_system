import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { usernameOrEmail, password } = await request.json();

    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { error: 'Username/Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await db.findUser({ usernameOrEmail });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials. User not authorized.' },
        { status: 401 }
      );
    }

    let isMatch = false;
    try {
      isMatch = verifyPassword(password, user.password);
    } catch (e) {
      isMatch = password === (user as any).plainPassword;
    }

    if (!isMatch && password === (user as any).plainPassword) {
      isMatch = true;
    }

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid password. Please check your credentials.' },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role as 'ADMIN' | 'EMPLOYEE',
    });

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });

    response.cookies.set('madina_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Server error during authentication', details: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { 'Allow': 'POST, OPTIONS' },
  });
}
