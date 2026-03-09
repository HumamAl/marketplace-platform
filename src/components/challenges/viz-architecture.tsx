"use client";

import { useState } from "react";
import { Lock, Users, Store, Package, ShoppingCart, MessageSquare, CreditCard } from "lucide-react";

const modules = [
  {
    id: "auth",
    label: "Auth",
    icon: Lock,
    type: "backend" as const,
    note: "JWT + session, no cross-module auth logic",
    dependsOn: [],
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    type: "database" as const,
    note: "Profiles, roles, preferences — no business logic",
    dependsOn: ["auth"],
  },
  {
    id: "vendors",
    label: "Vendors",
    icon: Store,
    type: "backend" as const,
    note: "Onboarding, tiers, commission rates",
    dependsOn: ["users"],
  },
  {
    id: "listings",
    label: "Listings",
    icon: Package,
    type: "backend" as const,
    note: "Polymorphic types, review queue, search index",
    dependsOn: ["vendors"],
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingCart,
    type: "backend" as const,
    note: "Lifecycle, fulfillment, dispute state machine",
    dependsOn: ["listings", "users"],
  },
  {
    id: "messaging",
    label: "Messaging",
    icon: MessageSquare,
    type: "backend" as const,
    note: "Thread model; reads users + orders for context",
    dependsOn: ["users", "orders"],
  },
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
    type: "external" as const,
    note: "Stripe Connect; isolated — no other module writes here",
    dependsOn: ["orders", "vendors"],
  },
];

const typeStyles: Record<string, { bg: string; border: string; text: string }> = {
  backend: {
    bg: "color-mix(in oklch, var(--primary) 8%, transparent)",
    border: "color-mix(in oklch, var(--primary) 25%, transparent)",
    text: "var(--primary)",
  },
  database: {
    bg: "color-mix(in oklch, var(--primary) 4%, transparent)",
    border: "color-mix(in oklch, var(--primary) 15%, transparent)",
    text: "var(--muted-foreground)",
  },
  external: {
    bg: "var(--muted)",
    border: "var(--border)",
    text: "var(--muted-foreground)",
  },
};

export function VizArchitecture() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedModule = modules.find((m) => m.id === selected);
  const highlightedIds = selected
    ? [selected, ...(selectedModule?.dependsOn ?? [])]
    : [];

  return (
    <div className="space-y-3">
      <p className="text-[10px] text-muted-foreground font-mono">Click a module to see its dependencies</p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-4">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const style = typeStyles[mod.type];
          const isHighlighted = highlightedIds.includes(mod.id);
          const isDim = selected !== null && !isHighlighted;

          return (
            <button
              key={mod.id}
              onClick={() => setSelected(selected === mod.id ? null : mod.id)}
              className="rounded-md p-2.5 text-left transition-all duration-100 flex flex-col gap-1"
              style={{
                backgroundColor: style.bg,
                border: `1px solid ${selected === mod.id ? "var(--primary)" : style.border}`,
                opacity: isDim ? 0.4 : 1,
                outline: selected === mod.id ? "2px solid color-mix(in oklch, var(--primary) 40%, transparent)" : "none",
                outlineOffset: "2px",
              }}
            >
              <Icon className="h-3.5 w-3.5" style={{ color: style.text }} />
              <span className="text-[10px] font-semibold leading-tight" style={{ color: style.text }}>
                {mod.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {selectedModule ? (
        <div
          className="rounded-md px-3 py-2.5 space-y-1 transition-all duration-100"
          style={{
            backgroundColor: "color-mix(in oklch, var(--primary) 5%, transparent)",
            border: "1px solid color-mix(in oklch, var(--primary) 15%, transparent)",
          }}
        >
          <p className="text-xs font-semibold text-primary">{selectedModule.label} module</p>
          <p className="text-[10px] text-muted-foreground">{selectedModule.note}</p>
          {selectedModule.dependsOn.length > 0 && (
            <p className="text-[10px] text-muted-foreground">
              Depends on:{" "}
              <span className="font-mono text-foreground/70">
                {selectedModule.dependsOn.join(", ")}
              </span>
            </p>
          )}
          {selectedModule.dependsOn.length === 0 && (
            <p className="text-[10px] font-mono text-muted-foreground">No upstream dependencies</p>
          )}
        </div>
      ) : (
        <div
          className="rounded-md px-3 py-2 text-[10px] text-muted-foreground"
          style={{ border: "1px dashed var(--border)" }}
        >
          Each module owns its own domain logic. Cross-module communication goes through defined interfaces — no direct DB joins between modules.
        </div>
      )}
    </div>
  );
}
