import { NextRequest, NextResponse } from 'next/server';
import { exportToCsv } from '@/lib/storage';
import { requirePermission } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  const auth = await requirePermission(request, 'inquiries:read');
  if ('error' in auth) return auth.error;

  const csv = await exportToCsv('inquiries');
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=inquiries.csv',
    },
  });
}
