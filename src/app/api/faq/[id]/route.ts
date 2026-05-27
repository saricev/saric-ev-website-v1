import { NextRequest, NextResponse } from 'next/server';
import { getFaqs, saveFaqs, deleteFaq } from '@/lib/data';
import { requirePermission } from '@/lib/permissions';

interface Props {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const auth = await requirePermission(request, 'faq:write');
    if ('error' in auth) return auth.error;

    const { id } = await params;
    const data = await request.json();
    const faqs = await getFaqs();
    const index = faqs.findIndex((f) => f.id === id);
    if (index === -1) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    faqs[index] = { ...faqs[index], ...data };
    await saveFaqs(faqs);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const auth = await requirePermission(request, 'faq:delete');
    if ('error' in auth) return auth.error;

    const { id } = await params;
    const success = await deleteFaq(id);
    if (!success) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
