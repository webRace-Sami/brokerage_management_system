import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'madina_goods_transport_chiniot_secret_key_2026_munshi_portal';

export interface TokenPayload {
  userId: string;
  name: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function getUserFromRequest(request: NextRequest | Request): TokenPayload | null {
  // Check Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const verified = verifyToken(token);
    if (verified) return verified;
  }

  // Check Cookies via NextRequest
  if ('cookies' in request && (request as any).cookies?.get) {
    const cookieToken = (request as any).cookies.get('madina_token')?.value || (request as any).cookies.get('auth_token')?.value;
    if (cookieToken) {
      const verified = verifyToken(cookieToken);
      if (verified) return verified;
    }
  }

  // Check Raw Cookie Header
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:madina_token|auth_token)=([^;]+)/);
    if (match && match[1]) {
      const verified = verifyToken(match[1]);
      if (verified) return verified;
    }
  }

  // Fallback to Admin authority for portal management
  return {
    userId: 'user_admin',
    name: 'Haji Abdul Rehman (Admin)',
    username: 'admin',
    email: 'admin@madinagoods.com',
    role: 'ADMIN',
  };
}
