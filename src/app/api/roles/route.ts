import { NextRequest, NextResponse } from 'next/server';
import { getRoles, createRole } from '@/lib/auth';
import { requirePermission } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  const auth = await requirePermission(request, 'users:read');
  if ('error' in auth) return auth.error;

  const roles = await getRoles();
  return NextResponse.json(roles);
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requirePermission(request, 'users:write');
    if ('error' in auth) return auth.error;

    const { name, description, permissions } = await request.json();
    if (!name || !permissions) {
      return NextResponse.json({ error: 'Name and permissions are required.' }, { status: 400 });
    }

    const role = await createRole(name, description || '', permissions);
    return NextResponse.json({ success: true, role });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
