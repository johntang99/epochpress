import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getDefaultSite, getSiteByHost } from '@/lib/sites';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface QuoteFormData {
  product: string;
  productLabel: string;
  specs: Record<string, string>;
  files: Array<{ name: string; size: number }>;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}

function specsToHTML(specs: Record<string, string>): string {
  return Object.entries(specs)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;text-transform:capitalize;">${k.replace(/([A-Z])/g, ' $1').trim()}</td><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;">${v}</td></tr>`
    )
    .join('');
}

function createCompanyEmailHTML(data: QuoteFormData): string {
  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f3f4f6;">
<div style="max-width:600px;margin:0 auto;padding:24px;">
  <div style="background:#0F1B2D;padding:24px;border-radius:12px 12px 0 0;">
    <h1 style="color:#d4a853;margin:0;font-size:20px;">New Quote Request</h1>
    <p style="color:#9ca3af;margin:4px 0 0;font-size:14px;">${data.productLabel}</p>
  </div>
  <div style="background:white;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
    <h2 style="font-size:16px;color:#111827;margin:0 0 16px;">Contact Information</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:6px 12px;color:#6b7280;font-size:13px;">Name</td><td style="padding:6px 12px;font-size:14px;font-weight:600;">${data.name}</td></tr>
      <tr><td style="padding:6px 12px;color:#6b7280;font-size:13px;">Email</td><td style="padding:6px 12px;font-size:14px;"><a href="mailto:${data.email}" style="color:#d4a853;">${data.email}</a></td></tr>
      ${data.phone ? `<tr><td style="padding:6px 12px;color:#6b7280;font-size:13px;">Phone</td><td style="padding:6px 12px;font-size:14px;">${data.phone}</td></tr>` : ''}
      ${data.company ? `<tr><td style="padding:6px 12px;color:#6b7280;font-size:13px;">Company</td><td style="padding:6px 12px;font-size:14px;">${data.company}</td></tr>` : ''}
    </table>

    ${Object.keys(data.specs).length > 0 ? `
    <h2 style="font-size:16px;color:#111827;margin:24px 0 12px;">Project Specifications</h2>
    <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;">
      ${specsToHTML(data.specs)}
    </table>` : ''}

    ${data.files.length > 0 ? `
    <h2 style="font-size:16px;color:#111827;margin:24px 0 12px;">Files Attached</h2>
    <ul style="margin:0;padding:0 0 0 20px;color:#374151;font-size:14px;">
      ${data.files.map((f) => `<li>${f.name} (${(f.size / 1024).toFixed(0)} KB)</li>`).join('')}
    </ul>` : ''}

    ${data.message ? `
    <h2 style="font-size:16px;color:#111827;margin:24px 0 12px;">Message</h2>
    <p style="color:#374151;font-size:14px;line-height:1.6;background:#f9fafb;padding:12px;border-radius:8px;">${data.message}</p>` : ''}

    <div style="margin-top:24px;text-align:center;">
      <a href="mailto:${data.email}?subject=Re: Quote for ${data.productLabel}" style="display:inline-block;padding:12px 24px;background-color:#d4a853;color:#0F1B2D;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Reply to Customer</a>
    </div>
  </div>
</div>
</body></html>`;
}

function createCustomerEmailHTML(data: QuoteFormData): string {
  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f3f4f6;">
<div style="max-width:600px;margin:0 auto;padding:24px;">
  <div style="background:#0F1B2D;padding:24px;border-radius:12px 12px 0 0;">
    <h1 style="color:#d4a853;margin:0;font-size:20px;">Quote Request Received</h1>
    <p style="color:#9ca3af;margin:4px 0 0;font-size:14px;">Epoch Press</p>
  </div>
  <div style="background:white;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
    <p style="color:#374151;font-size:15px;line-height:1.6;">Hi ${data.name},</p>
    <p style="color:#374151;font-size:15px;line-height:1.6;">
      Thank you for requesting a quote for <strong>${data.productLabel}</strong>. We've received your project details and our team will review them carefully.
    </p>
    <p style="color:#374151;font-size:15px;line-height:1.6;">
      You can expect a detailed quote from us within <strong>24 hours</strong>. If we need any additional information, we'll reach out to you directly.
    </p>

    ${Object.keys(data.specs).length > 0 ? `
    <h2 style="font-size:15px;color:#111827;margin:24px 0 12px;">Your Request Summary</h2>
    <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;">
      <tr><td style="padding:8px 12px;color:#6b7280;font-size:13px;">Product</td><td style="padding:8px 12px;font-size:14px;font-weight:600;">${data.productLabel}</td></tr>
      ${specsToHTML(data.specs)}
    </table>` : ''}

    <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
      <p style="margin:0;color:#166534;font-size:14px;">
        <strong>Questions?</strong> Reply to this email or call us at <strong>973.694.3600</strong>
      </p>
    </div>

    <p style="color:#9ca3af;font-size:12px;margin-top:24px;text-align:center;">
      Epoch Press • 7 Highpoint Drive, Wayne, NJ 07470 • 973.694.3600
    </p>
  </div>
</div>
</body></html>`;
}

export async function POST(request: NextRequest) {
  try {
    const data: QuoteFormData = await request.json();

    // Validate required fields
    if (!data.product || !data.name || !data.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Resolve site
    const host = request.headers.get('host');
    const site = (await getSiteByHost(host)) || (await getDefaultSite());
    const siteId = site?.id || 'epoch-press';

    // Save to database
    const supabase = getSupabaseServerClient();
    let quoteId: string | null = null;

    if (supabase) {
      const { data: inserted, error: dbError } = await supabase
        .from('quotes')
        .insert({
          site_id: siteId,
          product: data.product,
          specs: data.specs || {},
          files: data.files || [],
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          message: data.message || null,
          status: 'new',
        })
        .select('id')
        .single();

      if (dbError) {
        console.error('Quote DB insert error:', dbError);
      } else {
        quoteId = inserted?.id;
      }
    }

    // Send emails
    if (resend) {
      const fromAddress = process.env.RESEND_FROM || 'Epoch Press <no-reply@epochpress.com>';
      const companyEmail = process.env.QUOTE_NOTIFICATION_TO || process.env.CONTACT_FALLBACK_TO || 'info@epochpress.com';

      // Email 1: Notify company
      try {
        await resend.emails.send({
          from: fromAddress,
          to: companyEmail,
          reply_to: data.email,
          subject: `New Quote: ${data.productLabel} — ${data.name}${data.company ? ` (${data.company})` : ''}`,
          html: createCompanyEmailHTML(data),
        });
      } catch (emailErr) {
        console.error('Company notification email failed:', emailErr);
      }

      // Email 2: Auto-reply to customer
      try {
        await resend.emails.send({
          from: fromAddress,
          to: data.email,
          subject: `Quote Request Received — ${data.productLabel} | Epoch Press`,
          html: createCustomerEmailHTML(data),
        });
      } catch (emailErr) {
        console.error('Customer auto-reply email failed:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      quoteId,
      message: 'Quote request received. We will respond within 24 hours.',
    });
  } catch (err) {
    console.error('Quote API error:', err);
    return NextResponse.json({ error: 'Failed to process quote request' }, { status: 500 });
  }
}
