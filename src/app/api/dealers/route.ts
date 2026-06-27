import { NextRequest, NextResponse } from 'next/server';
import { getDealerApplications } from '@/lib/data';
import { requirePermission } from '@/lib/permissions';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const auth = await requirePermission(request, 'dealers:read');
    if ('error' in auth) return auth.error;

    const dealers = await getDealerApplications();
    return NextResponse.json(dealers);
  } catch (err) {
    logger.error('api/dealers', 'GET failed', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
