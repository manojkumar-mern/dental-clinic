/**
 * Dental Clinic Project Constants
 * Centralized design values, transitions, and configuration defaults.
 */

export const SITE_CONFIG = {
  name: "Aura Dental",
  description: "Experience premium, calm, and precision-focused dental care in a state-of-the-art environment.",
  url: "https://auradental.com",
  ogImage: "https://auradental.com/og-image.jpg",
  twitterHandle: "@auradental",
  contact: {
    email: "care@auradental.com",
    phone: "+1 (555) 019-2834",
  },
};

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export const TRANSITIONS = {
  default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  fast: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  },
};

export const SHADOWS = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.01)",
  premium: "0 20px 40px -15px rgba(0, 0, 0, 0.03), 0 1px 3px 0 rgba(0, 0, 0, 0.01)",
};
