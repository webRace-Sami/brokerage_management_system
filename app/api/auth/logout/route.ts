import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  return handleLogout();
}

export async function GET() {
  return handleLogout();
}

function handleLogout() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

  response.cookies.set('madina_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { 'Allow': 'GET, POST, OPTIONS' },
  });
}
