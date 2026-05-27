import { NextRequest, NextResponse } from 'next/server';
import { getUsers, createUser } from '@/lib/auth';
import { requirePermission } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  const auth = await requirePermission(request, 'users:read');
  if ('error' in auth) return auth.error;

  const users = await getUsers();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requirePermission(request, 'users:write');
    if ('error' in auth) return auth.error;

    const { username, password, role } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    const user = await createUser(username, password, role || 'viewer');
    return NextResponse.json({ success: true, user });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
