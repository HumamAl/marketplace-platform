"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const before = {
  label: "Current state",
  items: [
    "Components mixed with page-level state and API calls",
    "No consistent data-fetching pattern (mix of useEffect + SWR)",
    "Shared UI elements duplicated across 12+ files",
    "No clear separation between feature logic and presentation",
    "Ad hoc prop drilling 4–5 levels deep",
  ],
};

const after = {
  label: "Proposed structure",
  items: [
    "Feature folders: each module owns its components, hooks, and types",
    "Unified data layer via server components + client boundaries",
    "Shared component library with documented props and variants",
    "Business logic isolated in custom hooks — components render only",
    "Context at feature level, not global — no prop drilling",
  ],
};

export function VizBeforeAfter() {
  const [view, setView] = useState<"before" | "after">("before");

  const isBefore = view === "before";
  const panel = isBefore ? before : after;

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div className="flex items-center gap-1 p-1 rounded-md w-fit" style={{ backgroundColor: "var(--muted)" }}>
        <button
          onClick={() => setView("before")}
          className="px-3 py-1 rounded text-xs font-medium transition-all"
          style={{
            backgroundColor: isBefore ? "var(--card)" : "transparent",
            color: isBefore ? "var(--foreground)" : "var(--muted-foreground)",
            boxShadow: isBefore ? "0 1px 2px oklch(0 0 0 / 0.06)" : "none",
          }}
        >
          Current state
        </button>
        <button
          onClick={() => setView("after")}
          className="px-3 py-1 rounded text-xs font-medium transition-all"
          style={{
            backgroundColor: !isBefore ? "var(--card)" : "transparent",
            color: !isBefore ? "var(--foreground)" : "var(--muted-foreground)",
            boxShadow: !isBefore ? "0 1px 2px oklch(0 0 0 / 0.06)" : "none",
          }}
        >
          Proposed
        </button>
      </div>

      {/* Panel */}
      <div
        className="rounded-md p-4 space-y-2 transition-all duration-100"
        style={
          isBefore
            ? {
                backgroundColor: "color-mix(in oklch, var(--destructive) 6%, transparent)",
                border: "1px solid color-mix(in oklch, var(--destructive) 18%, transparent)",
              }
            : {
                backgroundColor: "color-mix(in oklch, var(--success) 6%, transparent)",
                border: "1px solid color-mix(in oklch, var(--success) 18%, transparent)",
              }
        }
      >
        <div className="flex items-center gap-1.5 mb-3">
          {isBefore ? (
            <AlertTriangle className="h-3.5 w-3.5 text-[color:var(--destructive)]" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5 text-[color:var(--success)]" />
          )}
          <span
            className="text-xs font-semibold"
            style={{ color: isBefore ? "var(--destructive)" : "var(--success)" }}
          >
            {panel.label}
          </span>
        </div>
        {panel.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span
              className="font-mono text-[10px] mt-0.5 shrink-0"
              style={{ color: isBefore ? "var(--destructive)" : "var(--success)" }}
            >
              {isBefore ? "✕" : "✓"}
            </span>
            <p className="text-xs text-foreground/80">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
