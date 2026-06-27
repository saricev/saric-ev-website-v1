import { NextRequest, NextResponse } from 'next/server';
import { getInquiries } from '@/lib/data';
import { requirePermission } from '@/lib/permissions';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const auth = await requirePermission(request, 'inquiries:read');
    if ('error' in auth) return auth.error;

    const inquiries = await getInquiries();
    return NextResponse.json(inquiries);
  } catch (err) {
    logger.error('api/inquiries', 'GET failed', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
