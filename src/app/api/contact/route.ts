import { NextRequest, NextResponse } from 'next/server';
import { saveToJson } from '@/lib/storage';
import { sendEmail, buildInquiryEmailHtml } from '@/lib/email';
import { createRateLimiter } from '@/lib/rate-limit';

const limiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 10 }); // 10 per hour per IP

export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const { success, remaining } = limiter.check(request);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const data = await request.json();

    // Honeypot check
    if (data.website) {
      return NextResponse.json({ success: true });
    }

    if (!data.name || !data.email || !data.country) {
      return NextResponse.json({ error: 'Name, email, and country are required.' }, { status: 400 });
    }

    // Input length validation
    if (data.name.length > 100) {
      return NextResponse.json({ error: 'Name must be 100 characters or less.' }, { status: 400 });
    }
    if (data.email.length > 254) {
      return NextResponse.json({ error: 'Email must be 254 characters or less.' }, { status: 400 });
    }
    if (data.message && data.message.length > 5000) {
      return NextResponse.json({ error: 'Message must be 5000 characters or less.' }, { status: 400 });
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

    const response = NextResponse.json({ success: true });
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    return response;
  } catch (err) {
    console.error('Contact POST error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
