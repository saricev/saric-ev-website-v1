import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, deleteUser, canAssignRole, getRoleLevel } from '@/lib/auth';
import { requirePermission } from '@/lib/permissions';

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  const auth = await requirePermission(request, 'users:read');
  if ('error' in auth) return auth.error;

  const { id } = await params;
  const user = await getUserById(id);
  if (!user) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  const { passwordHash: _, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

const ALLOWED_UPDATE_FIELDS = new Set(['username', 'role', 'password']);

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const auth = await requirePermission(request, 'users:write');
    if ('error' in auth) return auth.error;

    const { id } = await params;
    const rawData = await request.json();

    // Filter to only allowed fields
    const data: Record<string, unknown> = {};
    for (const key of ALLOWED_UPDATE_FIELDS) {
      if (key in rawData) data[key] = rawData[key];
    }

    // Prevent self-role modification
    if (data.role && id === auth.user.id) {
      return NextResponse.json({ error: 'Cannot change your own role.' }, { status: 403 });
    }

    // Role escalation guard
    if (data.role) {
      const targetRole = data.role as string;
      const assignerRole = auth.user.role;

      // Only super_admin can assign super_admin
      if (targetRole === 'super_admin' && assignerRole !== 'super_admin') {
        return NextResponse.json({ error: 'Only super admins can assign the super_admin role.' }, { status: 403 });
      }

      // Can only assign roles at or below your level
      if (!canAssignRole(assignerRole, targetRole)) {
        return NextResponse.json({ error: 'Cannot assign a role equal to or higher than your own.' }, { status: 403 });
      }
    }

    const success = await updateUser(id, data);
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

    const { id } = await params;

    // Prevent self-deletion
    if (id === auth.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account.' }, { status: 403 });
    }

    const success = await deleteUser(id);
    if (!success) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
