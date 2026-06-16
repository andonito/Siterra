# Siterra

Premium marketing site for **Siterra** — websites for service businesses. Built with Astro 5, Tailwind v4, React islands, and Netlify Functions. Deploys to Netlify as a static site with serverless functions for Stripe checkout and form handling.

---

## Quick start

```bash
npm install
npm run dev        # local dev at http://localhost:4321
npm run build      # production build → dist/
npm run brand      # regenerate all logo/brand assets in public/brand/
```

Node 20+ is required (Netlify is pinned to Node 20 in `netlify.toml`).

---

## Project structure

```
src/
  data/            pricing.ts (single source of truth for prices), site.ts
  layouts/         Base.astro (head/SEO/theme), Legal.astro
  components/      Nav, Footer, Hero, Work, Ticker, Logo (+ islands/)
  components/islands/   Configurator, QuoteForm, StyleStudio (React)
  scripts/         terrain.ts (hero canvas), reveal.ts (scroll reveals)
  pages/           index, start, quote, success, cancel, terms, privacy, refunds, 404
  styles/          global.css (design system + 5 themes)
netlify/functions/ create-checkout-session, stripe-webhook, studio-auth
scripts/brand/     generate_brand.py, render_assets.mjs, make_ico.py
public/brand/      generated logos, favicons, og image
```

---

## Environment variables

Set these in **Netlify → Site settings → Environment variables**. Locally, copy `.env.example` to `.env`. Never commit real secrets.

| Variable | Required | Purpose |
|---|---|---|
| `STRIPE_SECRET_KEY` | for checkout | Stripe secret key (`sk_live_…` / `sk_test_…`) |
| `STRIPE_WEBHOOK_SECRET` | for order emails | Signing secret from the Stripe webhook endpoint (`whsec_…`) |
| `STUDIO_PASSWORD` | for Style Studio | Password gating the hidden theme panel. **Set this only in Netlify**, never in the repo. |
| `RESEND_API_KEY` | optional | Enables order-notification emails via Resend |
| `NOTIFY_EMAIL` | optional | Where order emails go. Defaults to `Hello@getsiterra.com` |
| `FROM_EMAIL` | optional | Verified Resend sender. Defaults to `Siterra <hello@getsiterra.com>` |
| `SITE_URL` | recommended | Canonical site URL, e.g. `https://getsiterra.com` (used for Stripe redirects) |
| `PUBLIC_STUDIO_ENABLED` | optional | Set to `false` to strip the Style Studio from the build entirely |

---

## Stripe setup

Checkout uses **dynamic pricing** — all amounts are computed server-side from `src/data/pricing.ts`, so there are no products to create in the Stripe dashboard, and a tampered client can't change prices.

1. Add `STRIPE_SECRET_KEY` to Netlify env vars.
2. Create a webhook endpoint in **Stripe → Developers → Webhooks**:
   - **URL:** `https://getsiterra.com/api/stripe-webhook`
   - **Event:** `checkout.session.completed`
   - Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
3. Deploy. That's it.

**How orders flow:**
- No care plan selected → Checkout in `payment` mode (one-time charge for package + add-ons).
- Care plan selected → Checkout in `subscription` mode. The monthly plan gets a **30-day trial** (`trial_period_days: 30`), and the one-time project + add-ons are billed immediately as first-invoice items. So the customer pays the project today and the recurring care plan begins in 30 days.

**Testing locally / in test mode:**
```bash
stripe listen --forward-to localhost:4321/api/stripe-webhook   # in one terminal
# use test card 4242 4242 4242 4242, any future expiry, any CVC
```
> The build sandbox can't reach `api.stripe.com`, so live checkout must be tested from a deployed environment or with the Stripe CLI.

---

## Quote form (Netlify Forms)

The `/quote` wizard submits to **Netlify Forms** under the form name `site-blueprint`. A hidden static form in `src/pages/quote.astro` lets Netlify detect the fields at build time; the React wizard posts to it via AJAX.

**To receive submissions by email:**
1. Deploy the site (the form registers automatically on first deploy).
2. **Netlify → Forms → site-blueprint → Settings → Form notifications.**
3. Add an email notification to **Hello@getsiterra.com**.

A honeypot field (`bot-field`) is included for spam protection. No env vars are needed for the form itself.

---

## Email (Resend, optional)

Order-completion emails are sent via Resend from the Stripe webhook. To enable:
1. Create a Resend account and verify the **getsiterra.com** sending domain (add the DNS records Resend provides — SPF/DKIM).
2. Add `RESEND_API_KEY` to Netlify.
3. Confirm `FROM_EMAIL` uses a verified address on that domain.

If `RESEND_API_KEY` is absent, the webhook still returns 200 and simply logs the order instead of emailing — nothing breaks.

> **Inbox check:** make sure **Hello@getsiterra.com** can *receive* mail (valid MX records) so customer replies and Netlify form notifications land.

---

## Domain switch (Netlify)

To point **getsiterra.com** at this site:
1. Deploy this project to its Netlify site.
2. **Site settings → Domain management → Add a custom domain →** `getsiterra.com`.
3. Remove the domain from the old Netlify project first if it's still attached there, then add it here.
4. Netlify provisions SSL automatically. Set `SITE_URL=https://getsiterra.com`.

---

## Style Studio (hidden theme panel)

A hidden control panel lets you switch between 5 themes, shift the accent hue, toggle reduced motion, and export theme tokens as JSON. Changes persist in the visitor's browser (localStorage).

**Open it:** add `?studio` to any URL (e.g. `getsiterra.com/?studio`), or click the footer **©** five times quickly. Enter the studio password to unlock.

**Set the password:** add `STUDIO_PASSWORD` in Netlify env vars. The password is verified server-side by `netlify/functions/studio-auth.mts` and is **never** included in the client bundle. To remove the panel entirely from a build, set `PUBLIC_STUDIO_ENABLED=false`.

Themes: Obsidian (default, dark cyan), Atlas (deep blue), Gallery (light/brass), Terra (earthen amber), Graphite (chrome).

---

## Regenerating brand assets

```bash
npm run brand
```
Runs three steps: `generate_brand.py` (SVG logo system + OG image + brand sheet, wordmark paths extracted from the Sora typeface), `render_assets.mjs` (PNGs via resvg at all needed sizes), `make_ico.py` (multi-size favicon.ico). Output lands in `public/brand/` and `public/favicon.ico`.

---

## Pre-launch checklist

- [ ] `STRIPE_SECRET_KEY` set in Netlify (live key when going live)
- [ ] Stripe webhook created at `/api/stripe-webhook`, `STRIPE_WEBHOOK_SECRET` set
- [ ] Test a full checkout (one-time **and** with a care plan) using the Stripe CLI / test card
- [ ] `STUDIO_PASSWORD` set in Netlify (and confirmed absent from the repo)
- [ ] Netlify Forms notification to **Hello@getsiterra.com** enabled
- [ ] **Hello@getsiterra.com** can send (Resend domain verified) and receive (MX records) mail
- [ ] Legal pages reviewed by an attorney; replace `[Your Legal Entity Name]` in terms/privacy/refunds
- [ ] `SITE_URL` set to `https://getsiterra.com`
- [ ] Custom domain attached and SSL active
- [ ] Demo videos and poster frames load on the live site
- [ ] Run Lighthouse on the deployed URL
```
