import Stripe from 'stripe';

export const config = { path: '/api/stripe-webhook' };

// ── Config (with safe defaults) ──────────────────────────────────
const SITE_URL = (process.env.SITE_URL || 'https://getsiterra.com').replace(/\/$/, '');
const SUPPORT_EMAIL = 'Hello@getsiterra.com';
const LOGO_URL = `${SITE_URL}/brand/logo-horizontal-dark.png`;

// Where the internal order notification is delivered.
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'Hello@getsiterra.com';

// Ensure a valid "Display Name <address>" From header even if the env var was
// set without angle brackets (e.g. "Siterra hello@getsiterra.com").
function formatSender(raw: string): string {
  const value = (raw || '').trim();
  if (!value || value.includes('<')) return value;
  const match = value.match(/^(.*?)\s*([^\s]+@[^\s]+)$/);
  if (!match) return value;
  const name = match[1].trim();
  const addr = match[2].trim();
  return name ? `${name} <${addr}>` : `<${addr}>`;
}

// Customer-facing emails send from hello@; internal alerts from orders@ so the
// inbox doesn't look like hello@ emailed itself.
const CUSTOMER_FROM = formatSender(process.env.FROM_EMAIL || 'Siterra <hello@getsiterra.com>');
const ORDERS_FROM = formatSender(process.env.ORDERS_FROM_EMAIL || 'Siterra Orders <orders@getsiterra.com>');

// ── Webhook handler ──────────────────────────────────────────────
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    console.error('[webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET.');
    return new Response('Webhook not configured', { status: 500 });
  }

  const stripe = new Stripe(secret, { apiVersion: '2025-08-27.basil' });
  const sig = req.headers.get('stripe-signature');
  if (!sig) return new Response('Missing signature', { status: 400 });

  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, webhookSecret);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  // Process the event, but NEVER let email work affect the response to Stripe.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await processOrderEmails(session);
    } catch (err) {
      // Defensive catch — sendEmail never throws, but guard the whole flow anyway.
      console.error('[email] Unexpected error in order email flow:', err);
    }
  }

  // Always acknowledge a verified event so Stripe doesn't retry.
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ── Order email flow: 3 emails ───────────────────────────────────
interface OrderData {
  firstName: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  business: string;
  businessType: string;
  city: string;
  website: string;
  notes: string;
  packageName: string;
  addons: string;
  carePlan: string;
  hasCare: boolean;
  hasAddons: boolean;
  isSubscription: boolean;
  dueTodayCents: number;
  careMonthlyCents: number;
  sessionId: string;
  customerId: string;
  subscriptionId: string;
}

async function processOrderEmails(session: Stripe.Checkout.Session) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY not set — skipping all emails. Session: ${session.id}`);
    return;
  }

  const m = session.metadata || {};
  const customerEmail =
    session.customer_email ||
    (typeof session.customer_details?.email === 'string' ? session.customer_details.email : '') ||
    '';

  const data: OrderData = {
    firstName: (m.customer_name || '').trim().split(/\s+/)[0] || '',
    customerName: m.customer_name || '',
    customerEmail,
    phone: m.phone || '',
    business: m.business || '',
    businessType: m.business_type || '',
    city: m.city || '',
    website: m.current_website || '',
    notes: m.notes || '',
    packageName: m.package || '—',
    addons: m.addons || 'none',
    carePlan: m.care_plan || 'none',
    hasCare: !!m.care_plan && m.care_plan !== 'none',
    hasAddons: !!m.addons && m.addons !== 'none',
    isSubscription: session.mode === 'subscription',
    dueTodayCents: m.due_today_cents ? parseInt(m.due_today_cents, 10) : session.amount_total ?? 0,
    careMonthlyCents: m.care_monthly_cents ? parseInt(m.care_monthly_cents, 10) : 0,
    sessionId: session.id,
    customerId: typeof session.customer === 'string' ? session.customer : session.customer?.id || '',
    subscriptionId:
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id || '',
  };

  // 1) Internal order notification (always, if Resend is configured).
  const internalOk = await sendEmail(apiKey, {
    from: ORDERS_FROM,
    to: NOTIFY_EMAIL,
    replyTo: data.customerEmail || undefined,
    subject: `New order — ${data.packageName}${data.business ? ` · ${data.business}` : ''}`,
    html: internalHtml(data),
    text: internalText(data),
  });
  console.log(`[email] internal notification ${internalOk ? 'sent' : 'FAILED'} (order ${data.sessionId})`);

  // Customer-facing emails require a customer email.
  if (!data.customerEmail) {
    console.warn(
      `[email] No customer email on session ${data.sessionId} — skipping customer confirmation + intake.`
    );
    return;
  }

  // 2) Customer payment confirmation.
  const confirmOk = await sendEmail(apiKey, {
    from: CUSTOMER_FROM,
    to: data.customerEmail,
    replyTo: SUPPORT_EMAIL,
    subject: 'Your Siterra project is confirmed',
    html: confirmationHtml(data),
    text: confirmationText(data),
  });
  console.log(
    `[email] customer confirmation ${confirmOk ? 'sent' : 'FAILED'} → ${data.customerEmail} (order ${data.sessionId})`
  );

  // 3) Customer project intake.
  const intakeOk = await sendEmail(apiKey, {
    from: CUSTOMER_FROM,
    to: data.customerEmail,
    replyTo: SUPPORT_EMAIL,
    subject: 'Next step: tell us about your business',
    html: intakeHtml(data),
    text: intakeText(data),
  });
  console.log(
    `[email] customer intake ${intakeOk ? 'sent' : 'FAILED'} → ${data.customerEmail} (order ${data.sessionId})`
  );
}

// ── Reusable Resend sender (never throws) ────────────────────────
interface EmailOpts {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
}

async function sendEmail(apiKey: string, opts: EmailOpts): Promise<boolean> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: opts.from,
        to: [opts.to],
        reply_to: opts.replyTo || undefined,
        subject: opts.subject,
        html: opts.html,
        text: opts.text || undefined,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`[email] Resend API error ${res.status} for "${opts.subject}": ${body}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[email] Resend request threw for "${opts.subject}":`, err);
    return false;
  }
}

// ── Shared helpers ───────────────────────────────────────────────
function money(cents: number): string {
  const d = (cents || 0) / 100;
  return '$' + d.toLocaleString('en-US', {
    minimumFractionDigits: d % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c)
  );
}

const YEAR = new Date().getFullYear();

// Premium responsive shell. `inner` is placed inside one padded content cell.
function layout(inner: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
</head>
<body style="margin:0;padding:0;background:#f6f8fa;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f8fa;">
    <tr>
      <td align="center" style="padding:28px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e7ebef;">
          <tr><td style="height:3px;background:#16b5cf;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr>
            <td style="padding:26px 32px 6px 32px;">
              <img src="${LOGO_URL}" alt="Siterra" width="142" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:142px;" />
            </td>
          </tr>
          <tr>
            <td style="padding:14px 32px 26px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              ${inner}
            </td>
          </tr>
          <tr>
            <td style="padding:22px 32px 28px 32px;border-top:1px solid #eef1f5;">
              <p style="margin:0;font:400 12px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#8a93a1;">
                <span style="color:#5b6573;font-weight:600;">Siterra</span><br>
                Premium websites for service businesses<br>
                <a href="mailto:${SUPPORT_EMAIL}" style="color:#0e7d93;text-decoration:none;">${SUPPORT_EMAIL}</a><br>
                <a href="${SITE_URL}" style="color:#0e7d93;text-decoration:none;">${SITE_URL}</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:14px 0 0;font:400 11px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#aab2bd;">&copy; ${YEAR} Siterra &middot; Built in Florida</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const eyebrow = (t: string) =>
  `<p style="margin:0 0 8px;font:600 11px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:#0e7d93;">${t}</p>`;

const h1 = (t: string) =>
  `<h1 style="margin:0 0 16px;font:700 24px/1.25 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0b1116;letter-spacing:-0.01em;">${t}</h1>`;

const p = (t: string) =>
  `<p style="margin:0 0 16px;font:400 15px/1.65 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#3d4756;">${t}</p>`;

// Key/value summary box for customer emails.
function summaryBox(rows: [string, string][]): string {
  const trs = rows
    .map(
      ([k, v]) =>
        `<tr>
          <td style="padding:9px 0;font:500 13px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#8a93a1;vertical-align:top;width:42%;">${escapeHtml(k)}</td>
          <td style="padding:9px 0;font:500 14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a222c;text-align:right;">${escapeHtml(v)}</td>
        </tr>`
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 20px;background:#f7f9fb;border:1px solid #e6eaef;border-radius:12px;">
    <tr><td style="padding:6px 18px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${trs}</table>
    </td></tr>
  </table>`;
}

// ── Email 1: internal order notification ─────────────────────────
function internalHtml(d: OrderData): string {
  const rows: [string, string][] = [
    ['Customer name', d.customerName || '—'],
    ['Email', d.customerEmail || '—'],
    ['Phone', d.phone || '—'],
    ['Business', d.business || '—'],
    ['Business type', d.businessType || '—'],
    ['City / service area', d.city || '—'],
    ['Current website', d.website || '—'],
    ['Notes', d.notes || '—'],
    ['Package', d.packageName],
    ['Add-ons', d.addons],
    ['Care plan', d.carePlan],
    ['Amount paid today', money(d.dueTodayCents)],
    ['Order type', d.isSubscription ? 'Project + care plan' : 'One-time project'],
  ];
  const mainRows = rows
    .map(
      ([k, v]) =>
        `<tr>
          <td style="padding:10px 12px;border-bottom:1px solid #eef1f5;font:500 13px/1.5 sans-serif;color:#8a93a1;width:170px;vertical-align:top;">${escapeHtml(k)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eef1f5;font:400 14px/1.5 sans-serif;color:#1a222c;">${escapeHtml(v)}</td>
        </tr>`
    )
    .join('');

  const refRows: [string, string][] = [
    ['Stripe session', d.sessionId || '—'],
    ['Stripe customer', d.customerId || '—'],
    ['Stripe subscription', d.subscriptionId || '—'],
  ];
  const refHtml = refRows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:3px 0;font:500 11px/1.5 monospace;color:#9aa3b0;width:150px;">${escapeHtml(k)}</td><td style="padding:3px 0;font:400 11px/1.5 monospace;color:#6b7480;word-break:break-all;">${escapeHtml(v)}</td></tr>`
    )
    .join('');

  const inner = `
    ${eyebrow('New order')}
    ${h1('A checkout just completed')}
    ${p('Here are the full details for this order.')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 20px;border:1px solid #e6eaef;border-radius:12px;overflow:hidden;">
      ${mainRows}
    </table>
    <p style="margin:0 0 8px;font:600 11px/1 sans-serif;letter-spacing:1.4px;text-transform:uppercase;color:#9aa3b0;">Reference</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${refHtml}</table>
  `;
  return layout(inner);
}

function internalText(d: OrderData): string {
  return [
    'NEW SITERRA ORDER',
    '',
    `Customer name: ${d.customerName || '-'}`,
    `Email: ${d.customerEmail || '-'}`,
    `Phone: ${d.phone || '-'}`,
    `Business: ${d.business || '-'}`,
    `Business type: ${d.businessType || '-'}`,
    `City / service area: ${d.city || '-'}`,
    `Current website: ${d.website || '-'}`,
    `Notes: ${d.notes || '-'}`,
    '',
    `Package: ${d.packageName}`,
    `Add-ons: ${d.addons}`,
    `Care plan: ${d.carePlan}`,
    `Amount paid today: ${money(d.dueTodayCents)}`,
    `Order type: ${d.isSubscription ? 'Project + care plan' : 'One-time project'}`,
    '',
    `Stripe session: ${d.sessionId || '-'}`,
    `Stripe customer: ${d.customerId || '-'}`,
    `Stripe subscription: ${d.subscriptionId || '-'}`,
  ].join('\n');
}

// ── Email 2: customer payment confirmation ───────────────────────
function confirmationHtml(d: OrderData): string {
  const rows: [string, string][] = [['Package', d.packageName]];
  if (d.hasAddons) rows.push(['Add-ons', d.addons]);
  if (d.hasCare) rows.push(['Care plan', d.carePlan]);
  rows.push(['Paid today', money(d.dueTodayCents)]);

  const careNote = d.hasCare
    ? p(
        `Your first 30 days of care are included. Your <strong>${escapeHtml(
          d.carePlan
        )}</strong> plan (${money(
          d.careMonthlyCents
        )}/month) begins automatically after that 30-day period — there's nothing you need to do.`
      )
    : '';

  const cancelNote = d.hasCare
    ? `<p style="margin:20px 0 0;font:400 12px/1.6 sans-serif;color:#9aa3b0;">If you selected a care plan and need to adjust or cancel before the first monthly charge, just reply to this email or contact <a href="mailto:${SUPPORT_EMAIL}" style="color:#0e7d93;text-decoration:none;">${SUPPORT_EMAIL}</a>.</p>`
    : '';

  const inner = `
    ${eyebrow('Payment confirmed')}
    ${h1('Your project is confirmed')}
    ${p(`Hi${d.firstName ? ' ' + escapeHtml(d.firstName) : ' there'},`)}
    ${p('Thank you — your payment came through and your project is confirmed and your spot is reserved. Here&rsquo;s a quick summary of what you booked:')}
    ${summaryBox(rows)}
    ${careNote}
    ${p('Next, you&rsquo;ll get one more short email asking for a few helpful details about your business — they let us build something accurate and premium for your customers.')}
    ${p('Have a question in the meantime? Just reply to this email and it comes straight to us.')}
    ${cancelNote}
  `;
  return layout(inner);
}

function confirmationText(d: OrderData): string {
  const lines = [
    'PAYMENT CONFIRMED — Your Siterra project is confirmed',
    '',
    `Hi${d.firstName ? ' ' + d.firstName : ' there'},`,
    '',
    'Thank you — your payment came through and your project is confirmed and your spot is reserved. Summary of what you booked:',
    '',
    `Package: ${d.packageName}`,
  ];
  if (d.hasAddons) lines.push(`Add-ons: ${d.addons}`);
  if (d.hasCare) lines.push(`Care plan: ${d.carePlan}`);
  lines.push(`Paid today: ${money(d.dueTodayCents)}`);
  lines.push('');
  if (d.hasCare) {
    lines.push(
      `Your first 30 days of care are included. Your ${d.carePlan} plan (${money(
        d.careMonthlyCents
      )}/month) begins after that 30-day period.`,
      ''
    );
  }
  lines.push(
    "Next, you'll get one more short email asking for a few helpful details about your business.",
    '',
    'Questions? Just reply to this email.'
  );
  if (d.hasCare) {
    lines.push(
      '',
      `If you selected a care plan and need to adjust or cancel before the first monthly charge, reply to this email or contact ${SUPPORT_EMAIL}.`
    );
  }
  lines.push('', '—', 'Siterra', 'Premium websites for service businesses', SUPPORT_EMAIL, SITE_URL);
  return lines.join('\n');
}

// ── Email 3: customer project intake ─────────────────────────────
function intakeSection(n: number, title: string, body: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;">
      <tr>
        <td style="vertical-align:top;width:34px;">
          <div style="width:26px;height:26px;border-radius:50%;background:#eafafd;color:#0e7d93;font:700 13px/26px sans-serif;text-align:center;">${n}</div>
        </td>
        <td style="vertical-align:top;">
          <p style="margin:0 0 4px;font:600 15px/1.4 sans-serif;color:#0b1116;">${title}</p>
          <p style="margin:0;font:400 14px/1.6 sans-serif;color:#4a5563;">${body}</p>
        </td>
      </tr>
    </table>`;
}

function intakeHtml(d: OrderData): string {
  const inner = `
    ${eyebrow('Next step')}
    ${h1('Tell us about your business')}
    ${p(`Hi${d.firstName ? ' ' + escapeHtml(d.firstName) : ' there'},`)}
    ${p('Now that your project is confirmed, the next step is helping us understand your business so we can build something that feels accurate, premium, and useful for your customers.')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;background:#f7f9fb;border:1px solid #e6eaef;border-radius:12px;">
      <tr><td style="padding:14px 18px;font:400 14px/1.6 sans-serif;color:#3d4756;">
        You don&rsquo;t need to answer everything perfectly. Send whatever you have, and we&rsquo;ll organize it.<br>
        You can reply with text, attach files, or send links — whatever is easiest.
      </td></tr>
    </table>
    ${intakeSection(1, 'Brand assets', 'Send any logo files, brand colors, your current website, social media links, photos, videos, or existing brand materials.')}
    ${intakeSection(2, 'Services &amp; service areas', 'Your main services, the cities or areas you serve, and any best offers, warranties, guarantees, financing, or promotions.')}
    ${intakeSection(3, 'What makes you different', 'Why customers choose you, your strongest reviews or testimonials, before-and-after examples, certifications, experience, or other trust builders.')}
    ${intakeSection(4, 'Your main goal for the site', 'Are you after more calls, quote requests, bookings, credibility, local visibility, a more premium image, or something else?')}
    ${intakeSection(5, 'Inspiration &amp; preferences', 'Websites you like, competitors you want to look better than, styles you dislike, and anything you definitely want included or avoided.')}
    ${p('Once we receive your details, we&rsquo;ll review everything and use it to shape your site direction. If anything is missing, we&rsquo;ll follow up with simple questions.')}
    <p style="margin:18px 0 0;font:500 14px/1.6 sans-serif;color:#0b1116;">Reply whenever you&rsquo;re ready — no rush.</p>
  `;
  return layout(inner);
}

function intakeText(d: OrderData): string {
  return [
    'NEXT STEP: Tell us about your business',
    '',
    `Hi${d.firstName ? ' ' + d.firstName : ' there'},`,
    '',
    'Now that your project is confirmed, the next step is helping us understand your business so we can build something that feels accurate, premium, and useful for your customers.',
    '',
    "You don't need to answer everything perfectly. Send whatever you have, and we'll organize it.",
    'You can reply with text, attach files, or send links — whatever is easiest.',
    '',
    '1) BRAND ASSETS',
    'Logo files, brand colors, current website, social links, photos, videos, or existing brand materials.',
    '',
    '2) SERVICES & SERVICE AREAS',
    'Main services, cities/areas served, and any best offers, warranties, guarantees, financing, or promotions.',
    '',
    '3) WHAT MAKES YOU DIFFERENT',
    'Why customers choose you, strongest reviews/testimonials, before-and-after examples, certifications, experience, trust builders.',
    '',
    '4) MAIN GOAL FOR THE SITE',
    'More calls, quote requests, bookings, credibility, local visibility, a more premium image, or something else?',
    '',
    '5) INSPIRATION & PREFERENCES',
    'Sites you like, competitors to beat, styles you dislike, and anything you definitely want included or avoided.',
    '',
    "Once we receive your details, we'll review everything and use it to shape your site direction. If anything is missing, we'll follow up with simple questions.",
    '',
    "Reply whenever you're ready — no rush.",
    '',
    '—',
    'Siterra',
    'Premium websites for service businesses',
    SUPPORT_EMAIL,
    SITE_URL,
  ].join('\n');
}
