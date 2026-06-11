export interface DemoSite {
  id: string;
  name: string;
  category: string;
  tagline: string;
  accentColor: string;
  darkAccent: string;
  description: string;
  tags: string[];
  mobileLayoutType: "emergency" | "gallery" | "service-matrix";
  phonePlaceholder: string;
  addressPlaceholder: string;
  videoUrl?: string;
  liveUrl?: string;
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  tag: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  price: string;
  description: string;
  popular: boolean;
  features: string[];
  ctaText: string;
  deliveryTime: string;
}

export interface CarePlan {
  name: string;
  price: string;
  features: string[];
  description: string;
  badge?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ClientInquiry {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  website?: string;
  websiteType: string;
  budget: string;
  message: string;
}
