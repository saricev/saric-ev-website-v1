import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, UserPayload } from './auth-edge';

export async function requirePermission(
  request: NextRequest,
  permission: string
): Promise<{ user: UserPayload } | { error: NextResponse }> {
  const user = await verifyAuth(request);
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }) };
  }

  if (!user.permissions.includes(permission)) {
    return { error: NextResponse.json({ error: 'Forbidden. You do not have permission.' }, { status: 403 }) };
  }

  return { user };
}

export async function requireAuth(
  request: NextRequest
): Promise<{ user: UserPayload } | { error: NextResponse }> {
  const user = await verifyAuth(request);
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }) };
  }
  return { user };
}
