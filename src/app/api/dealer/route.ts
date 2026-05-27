import { NextRequest, NextResponse } from 'next/server';
import { saveToJson } from '@/lib/storage';
import { sendEmail, buildDealerEmailHtml } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Honeypot check
    if (data.website) {
      return NextResponse.json({ success: true });
    }

    if (!data.company || !data.contactPerson || !data.email || !data.country) {
      return NextResponse.json({ error: 'Company, contact person, email, and country are required.' }, { status: 400 });
    }

    await saveToJson('dealer_applications', data);

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New Dealer Application from ${data.company}`,
        html: buildDealerEmailHtml(data),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
