import { NextRequest, NextResponse } from 'next/server';
import { getFaqs, saveFaqs } from '@/lib/data';
import { requirePermission } from '@/lib/permissions';
import crypto from 'crypto';

export async function GET() {
  const faqs = await getFaqs();
  return NextResponse.json(faqs);
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requirePermission(request, 'faq:write');
    if ('error' in auth) return auth.error;

    const data = await request.json();
    const faqs = await getFaqs();
    data.id = crypto.randomUUID();
    faqs.push(data);
    await saveFaqs(faqs);
    return NextResponse.json({ success: true, id: data.id });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
