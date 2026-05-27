import { NextRequest, NextResponse } from 'next/server';
import { getCompany, saveCompany } from '@/lib/data';
import { requirePermission } from '@/lib/permissions';

export async function GET() {
  const company = await getCompany();
  return NextResponse.json(company);
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requirePermission(request, 'company:write');
    if ('error' in auth) return auth.error;

    const data = await request.json();
    await saveCompany(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
