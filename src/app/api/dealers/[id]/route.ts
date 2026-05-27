import { NextRequest, NextResponse } from 'next/server';
import { updateDealerApplication, deleteDealerApplication } from '@/lib/data';
import { requirePermission } from '@/lib/permissions';

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const auth = await requirePermission(request, 'dealers:write');
  if ('error' in auth) return auth.error;

  const { id } = await params;
  const data = await request.json();
  const success = await updateDealerApplication(id, data);
  if (!success) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const auth = await requirePermission(request, 'dealers:delete');
  if ('error' in auth) return auth.error;

  const { id } = await params;
  const success = await deleteDealerApplication(id);
  if (!success) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json({ success: true });
}
