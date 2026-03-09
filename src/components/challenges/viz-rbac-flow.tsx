import { ShieldCheck, Store, ShoppingBag, Settings } from "lucide-react";

const roles = [
  {
    label: "Admin",
    icon: Settings,
    color: "var(--primary)",
    permissions: ["Full platform access", "Vendor management", "Dispute resolution", "Financial reports"],
  },
  {
    label: "Vendor",
    icon: Store,
    color: "var(--accent)",
    permissions: ["Own listings only", "Own order data", "Own payout history", "Buyer messaging"],
  },
  {
    label: "Buyer",
    icon: ShoppingBag,
    color: "var(--muted-foreground)",
    permissions: ["Browse listings", "Own orders only", "Vendor messaging", "Review & dispute"],
  },
];

const layers = [
  { label: "Route guard", description: "Next.js middleware — blocks unauthenticated requests at the edge" },
  { label: "Session claims", description: "JWT includes role + userId — no DB round-trip per request" },
  { label: "Resource ownership", description: "Every query scoped to userId — cross-user reads return 403" },
  { label: "Action whitelist", description: "Explicit action enum per role — deny-by-default for unlisted actions" },
];

export function VizRbacFlow() {
  return (
    <div className="space-y-4">
      {/* Role cards */}
      <div className="grid grid-cols-3 gap-2">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <div
              key={role.label}
              className="rounded-md p-3 space-y-2"
              style={{
                border: "1px solid color-mix(in oklch, var(--border) 80%, transparent)",
                backgroundColor: "var(--card)",
              }}
            >
              <div className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" style={{ color: role.color }} />
                <span className="text-xs font-semibold" style={{ color: role.color }}>
                  {role.label}
                </span>
              </div>
              <ul className="space-y-0.5">
                {role.permissions.map((p) => (
                  <li key={p} className="text-[10px] text-muted-foreground leading-tight">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Arrow down */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-px h-4 bg-border/60" />
          <ShieldCheck className="h-4 w-4 text-primary" />
          <p className="text-[10px] font-mono text-muted-foreground">enforced by</p>
          <div className="w-px h-2 bg-border/60" />
        </div>
      </div>

      {/* Permission layers */}
      <div className="rounded-md overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        {layers.map((layer, i) => (
          <div
            key={layer.label}
            className="flex items-start gap-3 px-3 py-2"
            style={{
              backgroundColor: i % 2 === 0 ? "var(--muted)" : "var(--card)",
              borderTop: i > 0 ? "1px solid var(--border)" : "none",
            }}
          >
            <span className="font-mono text-[10px] text-primary/60 mt-0.5 shrink-0 w-20">{layer.label}</span>
            <p className="text-[10px] text-muted-foreground">{layer.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
