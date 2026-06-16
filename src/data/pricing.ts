/**
 * SITERRA — pricing source of truth.
 *
 * This file is imported by:
 *   1. The homepage (display)
 *   2. The /start configurator island (selection + totals)
 *   3. netlify/functions/create-checkout-session.mts (server-side validation)
 *
 * Checkout totals are ALWAYS recomputed on the server from these values,
 * so a tampered client can never change what Stripe charges.
 * All amounts are in USD cents.
 */

export type PackageId = 'launch' | 'local' | 'growth' | 'authority';
export type AddonId = 'crm' | 'seo' | 'wizard' | 'speed';
export type CarePlanId = 'essential' | 'growth-care' | 'scale';

export interface Pkg {
  id: PackageId;
  name: string;
  price: number; // cents; 0 = quote-only
  priceLabel: string;
  delivery: string;
  blurb: string;
  features: string[];
  cta: string;
  recommended?: boolean;
  quoteOnly?: boolean;
}

export const PACKAGES: Pkg[] = [
  {
    id: 'launch',
    name: 'Launch',
    price: 99700,
    priceLabel: '$997',
    delivery: '3–5 business days',
    blurb: 'A premium one-page site that makes the right first impression — live by next week.',
    features: [
      '1-page premium landing page',
      'Mobile-first fluid layout',
      'Interactive contact form',
      'Click-to-call buttons',
      'Basic on-page SEO setup',
      'Netlify deployment setup',
      '1 structured revision round',
      'Modern typography & micro-animations',
    ],
    cta: 'Start with Launch',
  },
  {
    id: 'local',
    name: 'Local Site',
    price: 250000,
    priceLabel: '$2,500',
    delivery: '2–3 weeks',
    blurb: 'The full local presence: service pages, local copy, and structure built to win your area.',
    features: [
      '4–6 page premium website',
      'Homepage + individual service pages',
      'Custom about page & project gallery',
      'Interactive Google Maps embed',
      'Targeted premium local copywriting',
      'Mobile touch targets & tap-to-dial',
      'Advanced semantic SEO structure',
      '2 structured revision rounds',
    ],
    cta: 'Build my Local Site',
    recommended: true,
  },
  {
    id: 'growth',
    name: 'Premium Growth',
    price: 500000,
    priceLabel: '$5,000',
    delivery: '3–4 weeks',
    blurb: 'A bespoke design system with city pages, tracking, and booking integrations — built to scale.',
    features: [
      '6–10 custom structured pages',
      'Bespoke high-end design system',
      'Hyper-targeted service & city pages',
      'Psychology-backed copywriting',
      'Multi-step pre-qualifying quote form',
      'Dynamic rich media gallery',
      'GA4 analytics & Meta Pixel tracking',
      'Search Console & sitemap submission',
      'Housecall Pro / Jobber / Calendly sync',
      '3 revision rounds & live testing',
    ],
    cta: 'Go Premium & Grow',
  },
  {
    id: 'authority',
    name: 'Custom Authority Build',
    price: 0,
    priceLabel: '$10,000+',
    delivery: '4–6 weeks',
    blurb: 'A market-dominating flagship, scoped around a deep strategy and competitor audit.',
    features: [
      'Full website strategy session',
      'Deep-dive competitor search audit',
      '10–15 dedicated high-value pages',
      'Sleek premium scroll transitions',
      'Pre-qualifying lead pathways',
      'Custom brand style guide',
      'Advanced search-intent SEO setup',
      'Live dedicated support & walkthrough',
      'Speed-optimized edge deployment',
    ],
    cta: 'Request custom quote',
    quoteOnly: true,
  },
];

export interface Addon {
  id: AddonId;
  name: string;
  price: number; // cents
  priceLabel: string;
  description: string;
}

export const ADDONS: Addon[] = [
  {
    id: 'crm',
    name: 'Smart CRM Sync — Jobber / Calendly',
    price: 45000,
    priceLabel: '+$450',
    description: 'Auto-synced bookings, client notifications, and calendar logs.',
  },
  {
    id: 'seo',
    name: 'Locational Keyword Schema — SEO',
    price: 55000,
    priceLabel: '+$550',
    description: 'Optimized city pages that help search engines understand your service areas.',
  },
  {
    id: 'wizard',
    name: 'Pre-Qualifying Multi-Step Wizard',
    price: 35000,
    priceLabel: '+$350',
    description: 'Sleek card-based client filtering by budget, size, and timing constraints.',
  },
  {
    id: 'speed',
    name: 'High-Speed Server Tuning',
    price: 25000,
    priceLabel: '+$250',
    description: 'Complete asset lazy-loads, clean minification, and global edge-cache deployment for strong performance scores.',
  },
];

export interface CarePlan {
  id: CarePlanId;
  name: string;
  price: number; // cents per month
  priceLabel: string;
  popular?: boolean;
  openEnded?: boolean; // "$499+" style
  features: string[];
}

export const CARE_PLANS: CarePlan[] = [
  {
    id: 'essential',
    name: 'Essential Care',
    price: 9900,
    priceLabel: '$99/mo',
    features: [
      'Secure hosting management',
      'Automatic daily backups',
      'Active SSL certificate checks',
      'Secure form endpoint monitoring',
      'Up to 30 minutes of content edits',
    ],
  },
  {
    id: 'growth-care',
    name: 'Growth Care',
    price: 24900,
    priceLabel: '$249/mo',
    popular: true,
    features: [
      'Everything in Essential Care',
      'Up to 2 hours of design & content edits',
      'Monthly page performance audits',
      'Search Console indexing reports',
      'Subtle conversion layout optimizations',
      'Priority email support',
    ],
  },
  {
    id: 'scale',
    name: 'Scale Care',
    price: 49900,
    priceLabel: '$499+/mo',
    openEnded: true,
    features: [
      'Everything in Growth Care',
      'New service or location page drafts',
      'CRM & booking gateway support',
      'Conversion lead tracking setup',
      'Dedicated monthly performance review',
      'Fast support update turnaround',
    ],
  },
];

/** Days before the care-plan subscription starts billing (Stripe trial). */
export const CARE_PLAN_TRIAL_DAYS = 30;

// ── Lookup helpers (used server-side) ──────────────────────────
export const packageById = (id: string) => PACKAGES.find((p) => p.id === id && !p.quoteOnly);
export const addonById = (id: string) => ADDONS.find((a) => a.id === id);
export const carePlanById = (id: string) => CARE_PLANS.find((c) => c.id === id);

export const fmtUSD = (cents: number) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
