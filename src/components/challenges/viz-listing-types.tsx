import { Check, X, Minus } from "lucide-react";

const listingTypes = [
  { name: "Physical goods", tag: "e.g. Clothing, Electronics" },
  { name: "Digital products", tag: "e.g. Software, Templates" },
  { name: "Services", tag: "e.g. Consulting, Repair" },
];

const approaches = [
  {
    name: "Nullable columns",
    recommended: false,
    cells: {
      "Physical goods": "partial",
      "Digital products": "partial",
      "Services": "partial",
      "New type?": "no",
      "Clean validation": "no",
      "Query performance": "no",
    } as Record<string, "yes" | "no" | "partial">,
  },
  {
    name: "JSON field per type",
    recommended: false,
    cells: {
      "Physical goods": "partial",
      "Digital products": "partial",
      "Services": "partial",
      "New type?": "partial",
      "Clean validation": "partial",
      "Query performance": "partial",
    } as Record<string, "yes" | "no" | "partial">,
  },
  {
    name: "Discriminated union schema",
    recommended: true,
    cells: {
      "Physical goods": "yes",
      "Digital products": "yes",
      "Services": "yes",
      "New type?": "yes",
      "Clean validation": "yes",
      "Query performance": "yes",
    } as Record<string, "yes" | "no" | "partial">,
  },
];

const criteria = [
  "Physical goods",
  "Digital products",
  "Services",
  "New type?",
  "Clean validation",
  "Query performance",
];

function CellIcon({ value }: { value: "yes" | "no" | "partial" }) {
  if (value === "yes") return <Check className="h-3.5 w-3.5 mx-auto text-[color:var(--success)]" />;
  if (value === "no") return <X className="h-3.5 w-3.5 mx-auto text-[color:var(--destructive)]" />;
  return <Minus className="h-3.5 w-3.5 mx-auto text-[color:var(--warning)]" />;
}

export function VizListingTypes() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr>
            <th
              className="text-left px-2 py-1.5 font-medium text-muted-foreground w-40"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              Approach
            </th>
            {criteria.map((c) => (
              <th
                key={c}
                className="px-2 py-1.5 font-medium text-muted-foreground text-center whitespace-nowrap"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {approaches.map((approach, i) => (
            <tr
              key={approach.name}
              style={{
                backgroundColor: approach.recommended
                  ? "color-mix(in oklch, var(--primary) 5%, transparent)"
                  : i % 2 === 0
                  ? "transparent"
                  : "var(--muted)",
                borderLeft: approach.recommended ? "2px solid var(--primary)" : "2px solid transparent",
              }}
            >
              <td className="px-2 py-2 font-medium" style={{ color: approach.recommended ? "var(--primary)" : "var(--foreground)" }}>
                {approach.name}
                {approach.recommended && (
                  <span
                    className="ml-1.5 text-[9px] font-semibold px-1 py-0.5 rounded"
                    style={{
                      backgroundColor: "color-mix(in oklch, var(--primary) 15%, transparent)",
                      color: "var(--primary)",
                    }}
                  >
                    recommended
                  </span>
                )}
              </td>
              {criteria.map((c) => (
                <td key={c} className="px-2 py-2">
                  <CellIcon value={approach.cells[c]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
