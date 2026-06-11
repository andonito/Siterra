import { ServiceItem, PricingPackage, CarePlan, FAQItem, DemoSite } from "./types";

export const PROBLEM_CARDS = [
  {
    number: "01",
    metric: "First Impression",
    title: "Outdated website = less trust",
    description: "Your website is your digital storefront. If it looks outdated, slow, or generic, visitors automatically assume your physical services are second-rate too. Modern design builds immediate trust.",
    impact: "Impact: High bounce rate & lost credibility."
  },
  {
    number: "02",
    metric: "Mobile First",
    title: "Weak mobile experience = missed calls",
    description: "Most local searches happen on smartphones. If your pricing lists, address maps, or phone buttons are hard to tap or scale weirdly, prospective clients will tap 'Back' and call a competitor instead.",
    impact: "Impact: Higher friction on mobile phone navigation."
  },
  {
    number: "03",
    metric: "Clear Actions",
    title: "No clear action = fewer quote requests",
    description: "A pretty website without high-contrast click-to-call buttons, clear service outlines, or simple contact forms is a missed opportunity. Your site must guide the eye to take action.",
    impact: "Impact: Paid advert clicks that leave without calling."
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
    description: "Bespoke design custom-tailored to your company. We build premium, original layouts to make your business look like the trusted local choice.",
    tag: "High-End Visuals"
  },
  {
    icon: "Zap",
    title: "Landing Pages",
    description: "High-performance single pages designed around clear calls to action to help turn paid Google or Facebook ad traffic into booked calls.",
    tag: "Paid Ads Catalyst"
  },
  {
    icon: "ShieldCheck",
    title: "Service Business Websites",
    description: "Structured specifically for trades, contractors, and local businesses. Built on a clean layout that guides users directly to request a quote or call.",
    tag: "Conversion-first"
  },
  {
    icon: "Search",
    title: "Local SEO Structure",
    description: "Engineered with clean code, modern title tag architectures, and structured service areas to help search engines understand where and what you serve.",
    tag: "Organic Fuel"
  },
  {
    icon: "Mail",
    title: "Lead Capture Forms",
    description: "Streamlined quote request forms that pre-qualify leads with project details, photos, or contact info before pings reach your phone.",
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
    description: "We migrate your old, slow WordPress or Wix site to a modern, high-performance layout, protecting as much of your existing SEO value as possible.",
    tag: "Zero-Risk Migration"
  },
  {
    icon: "Server",
    title: "Hosting & Launch Setup",
    description: "Reliable high-speed edge hosting. We secure your SSL certificate, configure custom domains, and handle all launch logistics.",
    tag: "Enterprise Speed"
  },
  {
    icon: "BarChart3",
    title: "Analytics & Tracking",
    description: "Google Analytics integration to track your website visits. See exactly which pages or services are driving your customer inquiries.",
    tag: "Pixel-Perfect Audits"
  },
  {
    icon: "TrendingUp",
    title: "Conversion Strategy",
    description: "Clear copywriting, user-friendly forms, and visible click-to-call buttons organized to help grow your local lead pipeline.",
    tag: "Revenue Focus"
  }
];

export const PACKAGES: PricingPackage[] = [
  {
    id: "launch",
    name: "Launch Site",
    price: "$997",
    description: "Best for new start-ups or small local contractors needing an immediate, premium single-page digital storefront.",
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
    name: "Local Website",
    price: "$2,500",
    description: "Our core service package designed for local specialty trades wanting to look highly trusted in their service area.",
    popular: true,
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
    name: "Premium Growth Site",
    price: "$5,000",
    description: "For thriving businesses seeking consistent, high-value leads, fully custom design direction, and smart integrations.",
    popular: false,
    ctaText: "Go Premium & Grow",
    deliveryTime: "3-4 Weeks",
    features: [
      "6 to 10 Custom Structured Pages",
      "Bespoke High-End Design System",
      "Hyper-Targeted Service & City Pages",
      "Psychology-Backed Copywriting",
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
    name: "Authority Website",
    price: "$10,000+",
    description: "The complete premium corporate system. Designed for established companies demanding absolute market dominance.",
    popular: false,
    ctaText: "Request Custom Quote",
    deliveryTime: "4-6 Weeks",
    features: [
      "Full Website Strategy Session",
      "Deep-Dive Competitor Search Audit",
      "10 to 15 Dedicated High-Value Pages",
      "Sleek Premium Scroll Transitions",
      "Pre-qualifying Lead Pathways",
      "Custom Brand Style Guide",
      "Advanced Search Intent SEO Setup",
      "Live Dedicated Support & Walkthrough",
      "Speed Optimized Edge Deployment"
    ]
  }
];

export const CARE_PLANS: CarePlan[] = [
  {
    name: "Essential Care",
    price: "$99/mo",
    description: "Worry-free maintenance, secure backups, and small updates on demand.",
    features: [
      "Secure Hosting Management",
      "Automatic Daily Backups",
      "Active SSL Certificate Checks",
      "Secure Form Endpoint Monitoring",
      "Up to 30 Minutes of Content Edits"
    ]
  },
  {
    name: "Growth Care",
    price: "$249/mo",
    description: "Ideal for growth-oriented companies actively adjusting services or pricing.",
    badge: "Most Popular Option",
    features: [
      "Everything in Essential Care",
      "Up to 2 Hours of Custom Design & Content Edits",
      "Monthly Page Performance Audits",
      "Google Search Console Indexing Reports",
      "Subtle Layout Optimizations for Conversions",
      "Priority Email & text/phone Support"
    ]
  },
  {
    name: "Scale Care",
    price: "$499+/mo",
    description: "Continuous organic scaling, technical SEO support, and software integration.",
    features: [
      "Everything in Growth Care",
      "New Service or Location Page Drafts",
      "CRM & Booking Gateway Support",
      "Conversion Lead Tracking Setup",
      "Dedicated Monthly Performance Call",
      "Fast Support Update Turnaround"
    ]
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "How fast can you build my website?",
    answer: "Our Siterra Launch single-page sites can be delivered in just 3 to 5 business days from receiving your assets. Full custom websites like Siterra Pro usually require 3 to 4 weeks depending on how custom the copywriting, design systems, and software configurations are. We agree on a strict launch date before any deposit is paid."
  },
  {
    question: "Do I need to provide the copy and photography?",
    answer: "You can supply images or drafts if you have them, but you don't need to. Siterra specializes in high-quality local service copywriting and layout structures. We select premium, high-resolution license-free local trade photography and write clear copy designed around building trust and outlining your services. All of this is ready to preview on our first review."
  },
  {
    question: "Can you redesign my existing website?",
    answer: "Yes, this is one of our primary solutions. We recreate slow, outdated WordPress, Wix, or Squarespace sites into high-speed, modern React frameworks. We map your current page paths carefully to protect as much of your existing SEO value as possible while improving your website's ability to turn visitors into leads."
  },
  {
    question: "Do you work with businesses outside Florida?",
    answer: "Siterra works with quality contractors, home service companies, tradesmen, and local firms across the entire country. Regardless of your location, we keep production streamlined, clear, and efficient using our modern interactive visual previews."
  },
  {
    question: "Can you connect form leads, booking systems, or CRM tools?",
    answer: "Absolutely. We routinely integrate tools like Housecall Pro, Jobber, ServiceTitan, Calendly, Acuity, Mailchimp, and Zapier custom webhooks. We make sure that whenever a prospective client submits a request on your site, you instantly get an email notification or a new entry inside your business pipeline."
  },
  {
    question: "Do you offer website hosting?",
    answer: "Yes. Siterra websites are built with static, modern static frameworks, then hosted on premium globally distributed server networks (Netlify/Vercel CDN). This delivers outstanding performance scores on Google Lighthouse, ensuring minimal loading delay for your visitors and a solid technical SEO foundation."
  },
  {
    question: "Why do custom website prices vary so much?",
    answer: "A simple landing page is a single layout designed to capture instant inquiries. A custom multi-page package, conversely, requires extensive competitor research, dedicated page structures for your distinct services, localized forms, copywriting, and custom layouts. We match our services strictly to your business scale to ensure your investment drives clear revenue."
  }
];
