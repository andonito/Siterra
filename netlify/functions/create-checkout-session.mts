import Stripe from 'stripe';
import {
  packageById,
  addonById,
  carePlanById,
  CARE_PLAN_TRIAL_DAYS,
} from '../../src/data/pricing.js';

export const config = { path: '/api/create-checkout-session' };

interface Payload {
  packageId?: string;
  addonIds?: string[];
  carePlanId?: string | null;
  customer?: {
    name?: string;
    business?: string;
    email?: string;
    phone?: string;
    website?: string;
    type?: string;
    city?: string;
    notes?: string;
  };
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return json({ error: 'Payments are not configured yet. Please contact us to complete your order.' }, 500);
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  // ── Validate the package against the server's own price list ──
  const pkg = packageById(body.packageId || '');
  if (!pkg) {
    return json({ error: 'Please choose a valid package.' }, 400);
  }
  const email = body.customer?.email?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'A valid email is required.' }, 400);
  }

  const stripe = new Stripe(secret, { apiVersion: '2025-08-27.basil' });
  const siteUrl = process.env.SITE_URL || new URL(req.url).origin;

  // ── One-time line items (recomputed from server data) ──
  const oneTime: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: 'usd',
        product_data: { name: `Siterra — ${pkg.name}`, description: pkg.blurb },
        unit_amount: pkg.price,
      },
      quantity: 1,
    },
  ];

  const addonIds = Array.isArray(body.addonIds) ? body.addonIds : [];
  for (const id of addonIds) {
    const addon = addonById(id);
    if (addon) {
      oneTime.push({
        price_data: {
          currency: 'usd',
          product_data: { name: `Add-on — ${addon.name}` },
          unit_amount: addon.price,
        },
        quantity: 1,
      });
    }
  }

  const care = body.carePlanId ? carePlanById(body.carePlanId) : null;

  // Amount actually charged today = package + one-time add-ons (the care plan is
  // $0 today because of the trial). Stored so the emails can show it accurately.
  const dueTodayCents = oneTime.reduce((sum, li) => sum + (li.price_data?.unit_amount || 0), 0);

  // Shared metadata for the webhook → notification + customer emails.
  const meta: Record<string, string> = {
    package: pkg.name,
    addons: addonIds.map((id) => addonById(id)?.name).filter(Boolean).join(', ') || 'none',
    care_plan: care?.name || 'none',
    due_today_cents: String(dueTodayCents),
    care_monthly_cents: String(care?.price || 0),
    customer_name: body.customer?.name?.slice(0, 200) || '',
    business: body.customer?.business?.slice(0, 200) || '',
    phone: body.customer?.phone?.slice(0, 60) || '',
    city: body.customer?.city?.slice(0, 200) || '',
    business_type: body.customer?.type?.slice(0, 120) || '',
    current_website: body.customer?.website?.slice(0, 300) || '',
    notes: body.customer?.notes?.slice(0, 500) || '',
  };

  const common: Stripe.Checkout.SessionCreateParams = {
    customer_email: email,
    success_url: `${siteUrl}/success`,
    cancel_url: `${siteUrl}/cancel`,
    billing_address_collection: 'auto',
    metadata: meta,
  };

  try {
    let session: Stripe.Checkout.Session;

    if (care) {
      // ── Subscription mode ──
      // Supported Checkout pattern (per Stripe docs):
      //  • The care plan is a RECURRING line item with a 30-day free trial, which
      //    delays the first monthly charge by CARE_PLAN_TRIAL_DAYS days. The
      //    customer can cancel during the trial at no charge.
      //  • The website package and add-ons are ONE-TIME line items. Stripe docs:
      //    combining a trial with one-time prices "will cause an invoice to be cut
      //    immediately for the amount of the one-time item at the beginning of the
      //    trial" — so the setup fees are charged upfront, today.
      // In subscription mode, line_items may contain both recurring and one-time
      // prices (max 20 each); one-time prices land on the initial invoice only.
      // We do NOT use `add_invoice_items` — it is not a Checkout Session parameter.
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        // One-time: website package + add-ons (charged immediately).
        ...oneTime,
        // Recurring: the monthly care plan (first charge after the trial).
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Siterra Care — ${care.name}` },
            unit_amount: care.price,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ];

      session = await stripe.checkout.sessions.create({
        ...common,
        mode: 'subscription',
        line_items: lineItems,
        subscription_data: {
          trial_period_days: CARE_PLAN_TRIAL_DAYS,
          metadata: meta,
        },
        // Collect a card now so the post-trial recurring charge can run off-session.
        payment_method_collection: 'always',
      });
    } else {
      // Payment mode: one-time only.
      session = await stripe.checkout.sessions.create({
        ...common,
        mode: 'payment',
        line_items: oneTime,
        payment_intent_data: { metadata: meta },
      });
    }

    return json({ url: session.url });
  } catch (err) {
    // Log the exact Stripe error so it's visible in the Netlify function logs.
    if (err && typeof err === 'object' && 'type' in err) {
      const e = err as Stripe.errors.StripeError;
      console.error('Stripe checkout error:', {
        type: e.type,
        code: e.code,
        message: e.message,
        param: e.param,
        statusCode: e.statusCode,
        requestId: e.requestId,
      });
      // Stripe's request-validation messages are safe and specific enough to show.
      const clientMsg =
        e.type === 'StripeInvalidRequestError' && e.message
          ? `Checkout couldn't start: ${e.message}`
          : 'We couldn\u2019t start checkout. Please try again, or contact us and we\u2019ll sort it out.';
      return json({ error: clientMsg }, 500);
    }
    console.error('Unexpected checkout error:', err);
    return json(
      { error: 'We couldn\u2019t start checkout. Please try again, or contact us and we\u2019ll sort it out.' },
      500
    );
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
