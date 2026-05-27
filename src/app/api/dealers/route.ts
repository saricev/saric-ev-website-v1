import { NextResponse } from 'next/server';
import { getDealerApplications } from '@/lib/data';

export async function GET() {
  const dealers = await getDealerApplications();
  return NextResponse.json(dealers);
}
