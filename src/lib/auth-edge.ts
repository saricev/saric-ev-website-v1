import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET_VALUE = process.env.JWT_SECRET;
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_VALUE || 'saric-ev-dev-only-secret');

export interface UserPayload {
  id: string;
  username: string;
  role: string;
  permissions: string[];
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserPayload;
  } catch {
    return null;
  }
}

export async function verifyAuth(request: NextRequest): Promise<UserPayload | null> {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function verifyPermission(request: NextRequest, permission: string): Promise<UserPayload | null> {
  const user = await verifyAuth(request);
  if (!user) return null;
  if (!user.permissions.includes(permission)) return null;
  return user;
}
