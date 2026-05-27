interface EmailData {
  to: string;
  subject: string;
  html: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'noreply@saricev.com';

  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured, skipping email send');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: data.to,
        subject: data.subject,
        html: data.html,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export function buildInquiryEmailHtml(data: {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  interestedProducts: string[];
  message: string;
}): string {
  return `
    <h2>New Inquiry from Saric Website</h2>
    <table style="border-collapse: collapse; width: 100%;">
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.name)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Company</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.company)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.email)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.phone)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Country</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.country)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Interested Products</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.interestedProducts.join(', '))}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.message)}</td></tr>
    </table>
  `;
}

export function buildDealerEmailHtml(data: {
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  existingBusiness: string;
  annualVolume: string;
  message: string;
}): string {
  return `
    <h2>New Dealer Application from Saric Website</h2>
    <table style="border-collapse: collapse; width: 100%;">
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Company</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.company)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Contact Person</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.contactPerson)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.email)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.phone)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Country</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.country)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Existing Business</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.existingBusiness)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Annual Volume</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.annualVolume)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.message)}</td></tr>
    </table>
  `;
}
