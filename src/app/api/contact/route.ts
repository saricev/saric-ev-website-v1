import { NextRequest, NextResponse } from 'next/server';
import { saveToJson } from '@/lib/storage';
import { sendEmail, buildInquiryEmailHtml } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Honeypot check
    if (data.website) {
      return NextResponse.json({ success: true });
    }

    if (!data.name || !data.email || !data.country) {
      return NextResponse.json({ error: 'Name, email, and country are required.' }, { status: 400 });
    }

    await saveToJson('inquiries', data);

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New Inquiry from ${data.name} - ${data.company || 'N/A'}`,
        html: buildInquiryEmailHtml(data),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
