import { NextRequest, NextResponse } from 'next/server';
import { getRole, updateRole, deleteRole } from '@/lib/auth';
import { requirePermission } from '@/lib/permissions';

interface Props {
  params: Promise<{ name: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  const auth = await requirePermission(request, 'users:read');
  if ('error' in auth) return auth.error;

  const { name } = await params;
  const role = await getRole(name);
  if (!role) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json(role);
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const auth = await requirePermission(request, 'users:write');
    if ('error' in auth) return auth.error;

    const { name } = await params;
    const data = await request.json();
    const success = await updateRole(name, data);
    if (!success) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const auth = await requirePermission(request, 'users:delete');
    if ('error' in auth) return auth.error;

    const { name } = await params;
    const success = await deleteRole(name);
    if (!success) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
