import { ServiceItem, PricingPackage, CarePlan, FAQItem, DemoSite } from "./types";

export const PROBLEM_CARDS = [
  {
    number: "01",
    metric: "81% of Local Leads",
    title: "Outdated website = less trust",
    description: "Your website is your digital storefront. If it looks outdated, slow, or generic, visitors automatically assume your physical services are second-rate too. Modern design is the premium tax on high-value contracts.",
    impact: "Impact: High bounce rate & lost credibility."
  },
  {
    number: "02",
    metric: "Over 68% Mobile Views",
    title: "Weak mobile experience = missed leads",
    description: "Most local searches happen on the move or from a couch. If your pricing lists, address maps, or phone buttons are hard to tap or scale weirdly on a phone, prospective clients will tap 'Back' and call the next listing.",
    impact: "Impact: 2x higher friction on quote submissions."
  },
  {
    number: "03",
    metric: "90% Lost Response",
    title: "No clear action = fewer client calls",
    description: "A pretty website without high-contrast click-to-call banners, localized maps, structured quote wizards, or calendar endpoints is a missed opportunity. Your site must guide they eye to a transaction, not just look nice.",
    impact: "Impact: Costly ad clicks that fail to generate phone alerts."
  }
];

export const DEMO_SITES: DemoSite[] = [
  {
    id: "tinting",
    name: "ASAP Window Tinting",
    category: "Window Tinting Website",
    tagline: "Prestige Nano-Ceramic Window Tinting & Protection",
    accentColor: "#10B981", // Emerald green/cyan touch
    darkAccent: "#064E3B",
    description: "A sleek, high-contrast black & emerald showcase built for a high-end vehicle customization studio. Complete with custom interactive shade sliders, tiered multi-service booking, and mobile touch dials.",
    tags: ["Ceramic Pro Tint", "Interactive Tint Visualizer", "Instant Match Form", "Speed Optimized"],
    mobileLayoutType: "gallery",
    phonePlaceholder: "(555) 846-8771",
    addressPlaceholder: "1098 Auto Plaza Blvd, Suite 4",
    videoUrl: "https://res.cloudinary.com/dhf8b2oeg/video/upload/q_auto/f_auto/v1781208073/Recording_2026-06-11_155558_occ3xa.mp4",
    liveUrl: "https://taupe-dusk-bf215b.netlify.app/"
  },
  {
    id: "sprinkler",
    name: "Overtime Solutions",
    category: "Sprinkler Repair Website",
    tagline: "Certified Irrigation Repair & Smart Sprinkler Systems",
    accentColor: "#2563FF", // Sharp cobalt
    darkAccent: "#1E3A8A",
    description: "An emergency-optimized, ultra-clean home service portal. Features prominent instant-call dials, immediate localized technician tracking alerts, dynamic repair request forms, and active coverage map overlays.",
    tags: ["Emergency Dispatch", "No-Leak Diagnostics", "Worry-Free Warranty", "5-Star Local Rating"],
    mobileLayoutType: "emergency",
    phonePlaceholder: "(555) 278-2356",
    addressPlaceholder: "Serving Your Local Metro Area",
    videoUrl: "https://res.cloudinary.com/dhf8b2oeg/video/upload/q_auto/f_auto/v1781208069/Recording_2026-06-11_155646_zzqivf.mp4",
    liveUrl: "https://overtimesolutions.netlify.app/"
  },
  {
    id: "landscaping",
    name: "Verdant Heights Luxury Landscaping",
    category: "Landscaping Website",
    tagline: "Exceptional Outdoor Architecture & Estate Management",
    accentColor: "#D97706", // Premium Amber / Gold
    darkAccent: "#78350F",
    description: "A high-end landscape and pool architectural landing page designed around premium photography, high-end hardscaping project calculators, custom consultation scheduling, and custom detail specs.",
    tags: ["Landscape Architect", "Outdoor Living Design", "3D Render Consult", "Premium Estates"],
    mobileLayoutType: "service-matrix",
    phonePlaceholder: "(555) 912-4402",
    addressPlaceholder: "Luxury Residential Service"
  }
];

export const SERVICES: ServiceItem[] = [
  {
    icon: "Layout",
    title: "Custom Website Design",
    description: "Bespoke digital architecture. No generic themes. We design original visual structures crafted to position your brand as the supreme local authority.",
    tag: "High-End Visuals"
  },
  {
    icon: "Zap",
    title: "Landing Pages",
    description: "Hyper-focused, lighting-fast single pages engineered strictly to convert paid Google/Facebook ad traffic directly into inbound phone calls.",
    tag: "Paid Ads Catalyst"
  },
  {
    icon: "ShieldCheck",
    title: "Service Business Websites",
    description: "Structured specifically for contractors, detailers, spas, and clinics. Built on an optimized user path that prioritizes confidence and calls.",
    tag: "Conversion-first"
  },
  {
    icon: "Search",
    title: "Local SEO Structure",
    description: "Engineered with semantic HTML headers, schema markup, and neighborhood directory hooks so Google rewards your site with top-tier rankings.",
    tag: "Organic Fuel"
  },
  {
    icon: "Mail",
    title: "Lead Capture Forms",
    description: "Sleek multi-step wizards that pre-qualify leads with budget, scope, and vehicle/home details before they ever ping your phone.",
    tag: "Smart Pipelines"
  },
  {
    icon: "Calendar",
    title: "Booking & CRM Integrations",
    description: "Sync your site directly with Housecall Pro, ServiceTitan, Calendly, or Jobber, letting clients book appointments on autopilot.",
    tag: "Business Sync"
  },
  {
    icon: "RefreshCw",
    title: "Website Redesigns",
    description: "We migrate your old, slow, Wordpress or Wix site to a modern high-performance layout, saving all your indexed Google rankings in the process.",
    tag: "Zero-Risk Migration"
  },
  {
    icon: "Server",
    title: "Hosting & Launch Setup",
    description: "Blazing fast global Edge network deployment. Secure SSL keys, custom domains, and instant cache updates included with every build.",
    tag: "Enterprise Speed"
  },
  {
    icon: "BarChart3",
    title: "Analytics & Tracking",
    description: "Full Google Analytics (GA4) and Meta Pixel events setup. Monitor precisely which page, button, or device earned you each client.",
    tag: "Pixel-Perfect Audits"
  },
  {
    icon: "TrendingUp",
    title: "Conversion Strategy",
    description: "Professional copywriting, design triggers, and micro-interactions optimized to increase your lead count by 30% to 150%+.",
    tag: "Revenue Focus"
  }
];

export const PACKAGES: PricingPackage[] = [
  {
    id: "launch",
    name: "Siterra Launch",
    price: "$997",
    description: "Best for new start-ups or small local contractors needing an immediate, elite single-page digital storefront.",
    popular: false,
    ctaText: "Start with Launch",
    deliveryTime: "3-5 Business Days",
    features: [
      "1-Page Premium Landing Page",
      "Mobile-First Fluid Layout",
      "Interactive Contact Form",
      "Click-to-Call Buttons",
      "Basic On-Page SEO Setup",
      "Netlify Deployment Setup",
      "1 Structured Revision Round",
      "Modern Typography & Micro-Animations"
    ]
  },
  {
    id: "local",
    name: "Siterra Local",
    price: "$2,500",
    description: "Our core service package designed for local specialty trades wanting to dominate their service area.",
    popular: false,
    ctaText: "Build My Local Site",
    deliveryTime: "2-3 Weeks",
    features: [
      "4 to 6 Page Premium Website",
      "Homepage + Individual Service Pages",
      "Custom About Page & Project Gallery",
      "Interactive Google Maps Embed",
      "Targeted Premium Local Copywriting",
      "Mobile Touch Targets & Dials",
      "Advanced SEO Semantic Structure",
      "2 Structured Revision Rounds"
    ]
  },
  {
    id: "pro",
    name: "Siterra Pro",
    price: "$5,000",
    description: "For thriving businesses seeking consistent top-dollar leads, fully branded design direction, and smart integrations.",
    popular: true,
    ctaText: "Go Pro & Dominate",
    deliveryTime: "3-4 Weeks",
    features: [
      "6 to 10 Custom Structured Pages",
      "Bespoke High-End Design System",
      "Hyper-Targeted Service & City Pages",
      "Psychology-Back Copywriting Suite",
      "Multi-Step Pre-Qualifying Quote Form",
      "Dynamic Rich Media Gallery",
      "GA4 Analytics & Meta Pixel Tracking",
      "Search Console & Sitemap Submission",
      "Housecall Pro / Jobber / Calendly Sync",
      "3 Revision Rounds & Live Testing"
    ]
  },
  {
    id: "authority",
    name: "Siterra Authority",
    price: "$10,000+",
    description: "The complete premium corporate system. Designed for established companies demanding absolute market dominance.",
    popular: false,
    ctaText: "Request Custom Quote",
    deliveryTime: "4-6 Weeks",
    features: [
      "Elite Full Website Strategy Workshop",
      "Deep-Dive Competitor SEO Map",
      "10 to 15 Dedicated High-Value Pages",
      "Sleek High-End Physics-Based Animations",
      "Smart Multi-Route Forms & Automation Logs",
      "Custom Dashboard / Intake Portals",
      "Advanced Search Intent SEO Engine",
      "Live Dedicated Support & Training",
      "Netlify / AWS Cloud Scaling Pipeline"
    ]
  }
];

export const CARE_PLANS: CarePlan[] = [
  {
    name: "Care Plan",
    price: "$99/mo",
    description: "Worry-free maintenance, secure backups, and small updates on demand.",
    features: [
      "Ultra-Secure Hosting Management",
      "Automatic Daily Backups",
      "Active SSL Certificate Auditing",
      "Secure Form Endpoint Monitoring",
      "Up to 30 Minutes of Content Edits"
    ]
  },
  {
    name: "Growth Plan",
    price: "$249/mo",
    description: "Ideal for growth-oriented companies actively adjusting services or pricing.",
    badge: "Most Popular Option",
    features: [
      "Everything in Basic Care",
      "Up to 2 Hours of Custom Design & Content Edits",
      "Monthly Page Performance Diagnostics",
      "Google Search Console Indexing Audits",
      "Subtle UX Adjustments for Conversions",
      "Priority Email & Slack Support"
    ]
  },
  {
    name: "Scale Plan",
    price: "$499+/mo",
    description: "Continuous organic scaling, technical SEO support, and software integration.",
    features: [
      "Everything in Growth Plan",
      "New City or Locational Page Drafts",
      "CRM & Booking Gateway Support",
      "Conversion Event Lead Tracking Logs",
      "Dedicated Monthly Performance Call",
      "1-Hour Guaranteed Update Turnaround"
    ]
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "How fast can you build my website?",
    answer: "Our Siterra Launch single-page sites can be delivered in just 3 to 5 business days from receiving your assets. Full custom websites like of 'Siterra Pro' pack usually require 3 to 4 weeks depending on how custom the copywriting, design systems, and software configurations are. We agree on a strict launch date before any deposit is paid."
  },
  {
    question: "Do I need to provide the copy and photography?",
    answer: "You can supply images or drafts if you have them, but you don't need to. Siterra specializes in high-fidelity copywriting and layout structures. We select premium, high-resolution license-free local trade photography and write copy designed around trust and local Google searches. All of this is ready to preview on our first review layout."
  },
  {
    question: "Can you redesign my existing website?",
    answer: "Yes, this is one of our primary solutions. We recreate slow, outdated Wordpress, Wix, or Squarespace sights into high-speed, modern React frameworks. We map your current URLs carefully so that you preserve 100% of your existing SEO ranks and backlinks while instantly boosting your conversion rate."
  },
  {
    question: "Do you work with businesses outside Florida?",
    answer: "Siterra works with high-value contractors, auto service companies, tradesmen, and commercial firms across the entire United States and Canada. By operating entirely digitally with our high-tech interactive preview simulators, we keep production streamlined, clear, and efficient."
  },
  {
    question: "Can you connect form leads, booking systems, or CRM tools?",
    answer: "Absolutely. We routinely integrate tools like Housecall Pro, Jobber, ServiceTitan, Calendly, Acuity, Mailchimp, and Zapier custom webhooks. We make sure that whenever a prospective client types a request on your site, you instantly get a phone text notification or a new entry inside your business pipeline."
  },
  {
    question: "Do you offer premium website hosting?",
    answer: "Yes. Siterra websites are built with static, modern edge-optimized frameworks, then hosted on premium globally distributed server networks (Netlify/Vercel CDN). This yields 100/100 performance scores on Google Lighthouse, ensuring zero loading delay for your visitors and maximum SEO organic ranking points."
  },
  {
    question: "Why do custom website prices vary so much?",
    answer: "A simple landing page is a single layout designed to capture instant inquiry metrics. A custom multi-page 'Authority' platform, conversely, requires extensive competitor SEO auditing, custom service page structures for many distinct branches, localized booking triggers, interactive widgets, copywriting, and custom branding architectures. We match our services strictly to your business scale to ensure your investment drives clear revenue."
  }
];
