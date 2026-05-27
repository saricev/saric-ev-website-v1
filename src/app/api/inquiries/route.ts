import { NextResponse } from 'next/server';
import { getInquiries } from '@/lib/data';

export async function GET() {
  const inquiries = await getInquiries();
  return NextResponse.json(inquiries);
}
