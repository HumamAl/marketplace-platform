export const executiveSummary = {
  commonApproach:
    "Most marketplace builds treat architecture as an afterthought — features ship fast, but module boundaries blur, permission logic scatters across controllers, and 'multiple listing types' becomes a pile of nullable columns.",
  differentApproach:
    "I design the module boundaries, permission layers, and schema flexibility upfront — so Phase 1 ships clean and Phase 2 doesn't require a rewrite.",
  accentPhrase: "upfront",
};

export const challenges = [
  {
    id: "frontend-restructure",
    number: "01",
    title: "Restructuring 80% Without Losing It",
    description:
      "Existing frontend was built during early experimentation — component boundaries are unclear, state management is ad hoc, and there's no consistent data-fetching pattern. A full rewrite discards months of work; doing nothing compounds technical debt.",
    vizType: "before-after" as const,
    outcome:
      "Could preserve usable components while establishing clean architecture boundaries — reducing rework by an estimated 60% vs. a full rewrite.",
    weight: "primary" as const,
  },
  {
    id: "rbac",
    number: "02",
    title: "Three User Surfaces, One API Layer",
    description:
      "Vendor, buyer, and admin roles each need completely different data access. A single REST API layer without explicit permission boundaries is the most common early-marketplace security gap — vendors reading each other's revenue, or buyers triggering admin actions.",
    vizType: "flow" as const,
    outcome:
      "Could eliminate permission bleed between vendor and admin actions — a security gap that typically surfaces only after a breach.",
    weight: "standard" as const,
  },
  {
    id: "modular-monolith",
    number: "03",
    title: "Seven Modules That Don't Tangle",
    description:
      "Auth, users, vendors, listings, orders, messaging, and payments need to ship together but evolve independently. Without explicit module boundaries, the codebase becomes a distributed monolith — tightly coupled logic masquerading as separate concerns.",
    vizType: "architecture" as const,
    outcome:
      "Could allow individual modules to be extracted into microservices later without a full rewrite — protecting the Phase 1 investment.",
    weight: "primary" as const,
  },
  {
    id: "listing-types",
    number: "04",
    title: "Flexible Listings Without Schema Sprawl",
    description:
      "Physical goods, digital products, and services each need different required fields, fulfillment logic, and pricing models. The naive approach — nullable columns for every possible field — degrades query performance and makes validation logic impossible to maintain.",
    vizType: "comparison-table" as const,
    outcome:
      "Could support new listing types without schema migrations — protecting development velocity as the product evolves beyond its initial three categories.",
    weight: "supporting" as const,
  },
];
