export const config = { path: '/api/blueprint-request' };

// ── Config (safe defaults; no secrets in the bundle) ─────────────
const SITE_URL = (process.env.SITE_URL || 'https://getsiterra.com').replace(/\/$/, '');
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'Hello@getsiterra.com';
const SUPPORT_EMAIL = 'Hello@getsiterra.com';

// Separate sender so the lead alert doesn't look like hello@ emailing itself.
function formatSender(raw: string): string {
  const value = (raw || '').trim();
  if (!value || value.includes('<')) return value;
  const match = value.match(/^(.*?)\s*([^\s]+@[^\s]+)$/);
  if (!match) return value;
  const name = match[1].trim();
  const addr = match[2].trim();
  return name ? `${name} <${addr}>` : `<${addr}>`;
}
const BLUEPRINT_FROM = formatSender(
  process.env.BLUEPRINT_FROM_EMAIL || 'Siterra Blueprint <blueprint@getsiterra.com>'
);

interface Lead {
  name?: string;
  email?: string;
  phone?: string;
  business?: string;
  type?: string;
  services?: string;
  city?: string;
  website?: string;
  budget?: string;
  timeline?: string;
  contact?: string;
  needs?: string;
  'bot-field'?: string;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let body: Lead;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  // Honeypot: a filled hidden field means a bot. Pretend success, send nothing.
  if (body['bot-field']) {
    console.log('[blueprint] Honeypot tripped — ignoring submission.');
    return json({ ok: true }, 200);
  }

  // ── Server-side validation of required fields ──
  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const business = (body.business || '').trim();
  const type = (body.type || '').trim();

  const missing: string[] = [];
  if (!name) missing.push('name');
  if (!email) missing.push('email');
  if (!business) missing.push('business name');
  if (!type) missing.push('business type');
  if (missing.length) {
    return json(
      { error: `Please complete the required fields: ${missing.join(', ')}.` },
      400
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[blueprint] RESEND_API_KEY not set — cannot send lead email.');
    return json(
      { error: 'We couldn\u2019t send your request right now. Please email Hello@getsiterra.com.' },
      500
    );
  }

  const data = {
    name,
    email,
    business,
    type,
    phone: (body.phone || '').trim(),
    services: (body.services || '').trim(),
    city: (body.city || '').trim(),
    website: (body.website || '').trim(),
    budget: (body.budget || '').trim(),
    timeline: (body.timeline || '').trim(),
    contact: (body.contact || '').trim(),
    needs: (body.needs || '').trim(),
  };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: BLUEPRINT_FROM,
        to: [NOTIFY_EMAIL],
        reply_to: data.email || undefined,
        subject: `New Blueprint Request — ${data.business}`,
        html: leadHtml(data),
        text: leadText(data),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`[blueprint] Resend API error ${res.status}: ${detail}`);
      return json(
        { error: 'We couldn\u2019t send your request right now. Please email Hello@getsiterra.com.' },
        500
      );
    }

    console.log(`[blueprint] lead email sent → ${NOTIFY_EMAIL} (business: ${data.business})`);
    return json({ ok: true }, 200);
  } catch (err) {
    console.error('[blueprint] Resend request threw:', err);
    return json(
      { error: 'We couldn\u2019t send your request right now. Please email Hello@getsiterra.com.' },
      500
    );
  }
}

// ── Email content ────────────────────────────────────────────────
function leadHtml(d: Record<string, string>): string {
  const rows: [string, string][] = [
    ['Name', d.name || '—'],
    ['Email', d.email || '—'],
    ['Phone', d.phone || '—'],
    ['Business name', d.business || '—'],
    ['Business type', d.type || '—'],
    ['Services', d.services || '—'],
    ['Service area', d.city || '—'],
    ['Current website', d.website || '—'],
    ['Budget', d.budget || '—'],
    ['Timeline', d.timeline || '—'],
    ['Preferred contact', d.contact || '—'],
    ['Goals / notes', d.needs || '—'],
  ];
  const trs = rows
    .map(
      ([k, v]) =>
        `<tr>
          <td style="padding:10px 12px;border-bottom:1px solid #eef1f5;font:500 13px/1.5 sans-serif;color:#8a93a1;width:160px;vertical-align:top;">${escapeHtml(k)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eef1f5;font:400 14px/1.5 sans-serif;color:#1a222c;">${escapeHtml(v)}</td>
        </tr>`
    )
    .join('');

  const inner = `
    <p style="margin:0 0 8px;font:600 11px/1 sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:#0e7d93;">New lead</p>
    <h1 style="margin:0 0 16px;font:700 23px/1.25 sans-serif;color:#0b1116;letter-spacing:-0.01em;">Free Site Blueprint request</h1>
    <p style="margin:0 0 18px;font:400 15px/1.6 sans-serif;color:#3d4756;">A new Blueprint request just came in. Reply within 48 hours.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e6eaef;border-radius:12px;overflow:hidden;">
      ${trs}
    </table>`;

  return layout(inner);
}

function leadText(d: Record<string, string>): string {
  return [
    'NEW FREE SITE BLUEPRINT REQUEST',
    '',
    `Name: ${d.name || '-'}`,
    `Email: ${d.email || '-'}`,
    `Phone: ${d.phone || '-'}`,
    `Business name: ${d.business || '-'}`,
    `Business type: ${d.type || '-'}`,
    `Services: ${d.services || '-'}`,
    `Service area: ${d.city || '-'}`,
    `Current website: ${d.website || '-'}`,
    `Budget: ${d.budget || '-'}`,
    `Timeline: ${d.timeline || '-'}`,
    `Preferred contact: ${d.contact || '-'}`,
    `Goals / notes: ${d.needs || '-'}`,
  ].join('\n');
}

function layout(inner: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
</head>
<body style="margin:0;padding:0;background:#f6f8fa;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f8fa;">
    <tr><td align="center" style="padding:28px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e7ebef;">
        <tr><td style="height:3px;background:#16b5cf;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:24px 32px 26px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          ${inner}
        </td></tr>
        <tr><td style="padding:18px 32px 24px 32px;border-top:1px solid #eef1f5;">
          <p style="margin:0;font:400 12px/1.7 sans-serif;color:#8a93a1;">
            <span style="color:#5b6573;font-weight:600;">Siterra</span> &middot; Blueprint lead notification<br>
            <a href="${SITE_URL}" style="color:#0e7d93;text-decoration:none;">${SITE_URL}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c)
  );
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
