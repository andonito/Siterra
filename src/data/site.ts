/** SITERRA — site-wide constants. */

export const SITE = {
  name: 'Siterra',
  domain: 'getsiterra.com',
  url: 'https://getsiterra.com',
  email: 'Hello@getsiterra.com',
  tagline: 'Premium websites for service businesses',
  description:
    'Siterra designs and builds premium, conversion-focused websites for service businesses — so you look established, earn trust in seconds, and turn more visitors into booked work.',
};

export interface Demo {
  name: string;
  displayUrl: string;
  href: string;
  screenshot: string;
  meta: string;
  summary: string;
  tags: string[];
  featured?: boolean;
}

// Sample/demo builds (not paid client case studies). Display URL matches the link
// exactly — no .com shown that we don't actually link to. Screenshots are frame 0
// of each recording, served via Cloudinary with auto format and q_auto.
export const DEMOS: Demo[] = [
  {
    name: 'ASAP Window Tinting',
    displayUrl: 'asap-window-tinting-demo.netlify.app',
    href: 'https://asap-window-tinting-demo.netlify.app/',
    screenshot:
      'https://res.cloudinary.com/dhf8b2oeg/video/upload/so_0,w_1280,q_auto,f_auto/v1781208073/Recording_2026-06-11_155558_occ3xa.jpg',
    meta: 'Automotive & architectural tint · Sanford + Orlando, FL',
    summary:
      'A dark, high-gloss demo for a ceramic tint studio — service pages, financing cues, and tap-to-call everywhere it counts.',
    tags: ['Fast quote CTA', 'Service pages', 'Premium tint studio style'],
    featured: true,
  },
  {
    name: 'Overtime Solutions',
    displayUrl: 'overtime-solutions-demo.netlify.app',
    href: 'https://overtime-solutions-demo.netlify.app/',
    screenshot:
      'https://res.cloudinary.com/dhf8b2oeg/video/upload/so_0,w_1280,q_auto,f_auto/v1781208069/Recording_2026-06-11_155646_zzqivf.jpg',
    meta: 'Irrigation repair & outdoor services · Apopka + Orlando, FL',
    summary:
      'A warm, trade-proud demo for a family-run outdoor services company — clear service areas, direct pricing, instant contact.',
    tags: ['Local service layout', 'Emergency CTA', 'Trust-first structure'],
  },
];

export const TICKER = [
  'Mobile-first design',
  'SEO-ready foundations',
  'Edge-deployed hosting',
  'Conversion-focused copy',
  'Launches in days',
  'You own everything',
  'Clear, upfront pricing',
  'Stripe-secured checkout',
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: 'I get most of my work from referrals. Why does the website matter?',
    a: 'Referrals still look you up before they call. Your website is where a warm recommendation either turns into a booked job or quietly leaks to a competitor who looks more established. A premium site closes the deals your reputation opens.',
  },
  {
    q: 'What exactly happens after I pay?',
    a: 'You get a confirmation right away, then a kickoff email from Hello@getsiterra.com within one business day. We start with your Blueprint — structure and strategy — then design, build on a live staging link you can watch, and launch on schedule.',
  },
  {
    q: 'Why full payment upfront instead of a deposit?',
    a: 'One clean payment gets you priority scheduling, a single handoff, and full ownership from day one — and it is protected by the Design-First Guarantee: you approve the design direction before full build-out, or you get a full refund.',
  },
  {
    q: 'Do I actually own the website?',
    a: 'Completely. The design, code, content, domain, and hosting accounts are yours. No hostage hosting, no licensing games. If we never speak again, your site keeps working.',
  },
  {
    q: 'How fast can we launch?',
    a: 'Launch sites go live in 3–5 business days. Local Sites take 2–3 weeks, Premium Growth 3–4 weeks, and Custom Authority builds 4–6 weeks. Timelines start at kickoff and we keep you posted at every milestone.',
  },
  {
    q: 'What if I already have a website?',
    a: 'Even better — we audit what is working, keep anything worth keeping, and rebuild on a stronger foundation. The switchover happens with zero downtime, and your existing search visibility is preserved or improved.',
  },
  {
    q: 'Are the monthly care plans required?',
    a: 'No — your site keeps running without one. Care plans are optional. First 30 days included. Monthly billing starts after the trial. Cancel before the first monthly charge at no cost.',
  },
  {
    q: 'Do you write the content too?',
    a: 'Yes. Conversion-focused copywriting is included in every package — headlines, service descriptions, calls to action, all of it. You review and approve everything before launch.',
  },
];
