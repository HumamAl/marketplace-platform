import type { Profile, PortfolioProject } from "@/lib/types";

export const profile: Profile = {
  name: "Humam",
  tagline:
    "Full-stack developer who builds marketplaces — vendor management, listing pipelines, RBAC, and the PostgreSQL schemas that hold it all together.",
  bio: "I build multi-tenant platforms where the data model IS the product. For this MVP I'd start from your existing 80% frontend, map the module boundaries, and build the backend layer piece by piece — auth first, then vendors, then listings, then orders. Each module is independently testable and the whole thing deploys on Vercel day one.",
  approach: [
    {
      title: "Architecture Audit",
      description:
        "Review your existing 80% frontend, map module boundaries, identify integration points. Start with what exists — no blank-slate rewrites.",
    },
    {
      title: "Schema Design",
      description:
        "PostgreSQL schema with migration strategy — vendors, listings, orders, payouts, RBAC roles. Designed for the queries you'll actually run, not the queries that look clean in a diagram.",
    },
    {
      title: "Module-by-Module Build",
      description:
        "Auth and RBAC first. Then vendor onboarding, listing management, order flow, payout tracking. Each module ships with tests before the next begins.",
    },
    {
      title: "Integration & Hardening",
      description:
        "RBAC enforcement across all endpoints, Redis caching for hot paths, i18n wiring, performance profiling. Production-ready — not prototype-ready.",
    },
  ],
  skillCategories: [
    {
      name: "Platform Architecture",
      skills: [
        "Modular Monolith",
        "PostgreSQL",
        "System Design",
        "Database Schema",
        "RBAC",
        "REST API Design",
      ],
    },
    {
      name: "Frontend & UI",
      skills: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "shadcn/ui",
      ],
    },
    {
      name: "Infrastructure",
      skills: [
        "Node.js",
        "Redis",
        "Vercel",
        "GitHub Actions",
        "Stripe Connect",
      ],
    },
  ],
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "lynt-marketplace",
    title: "Lynt Marketplace",
    description:
      "Full marketplace architecture — vendor onboarding, listing management, and transaction tracking built as a production-ready platform.",
    outcome:
      "Full marketplace architecture — vendor onboarding, listing management, and transaction tracking ready for production",
    tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
    relevance: "Direct match — this is the architecture pattern for your MVP.",
    liveUrl: "https://lynt-marketplace.vercel.app",
  },
  {
    id: "dealer-hub",
    title: "DealerHub — Automotive SaaS",
    description:
      "Multi-tenant dealership platform with vehicle inventory management, AI-powered lead scoring, appraisals, and reconditioning pipeline tracking.",
    outcome:
      "Full dealership ops platform — inventory, leads, appraisals, and reconditioning all in one place",
    tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui", "Recharts"],
    relevance:
      "Multi-tenant architecture and inventory management — same structural challenge as vendor/listing management.",
    liveUrl: "https://dealer-platform-neon.vercel.app",
  },
  {
    id: "sienna-vendor-admin",
    title: "Sienna Charles — Vendor Admin",
    description:
      "Luxury vendor management platform with vendor directory, map-based discovery, AI-powered search, and booking management with spend analytics.",
    outcome:
      "Vendor discovery and booking platform with map view, category filters, and spend tracking per booking",
    tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui", "Recharts"],
    relevance:
      "Two-sided platform — vendor-facing workflows and admin management panel built together.",
    liveUrl: "https://sienna-vendor-admin.vercel.app",
  },
  {
    id: "tri-gear-market",
    title: "Tri-Gear Market",
    description:
      "Verified triathlon equipment marketplace with gear listings, seller verification, and category browsing.",
    outcome:
      "Niche marketplace with seller verification, gear categorization, and listing management",
    tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
    relevance:
      "Seller verification flow and listing management — the exact patterns your vendor onboarding needs.",
    liveUrl: "https://tri-gear-market.vercel.app",
  },
];
