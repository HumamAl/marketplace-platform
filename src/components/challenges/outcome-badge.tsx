import { TrendingUp } from "lucide-react";

interface OutcomeBadgeProps {
  text: string;
}

export function OutcomeBadge({ text }: OutcomeBadgeProps) {
  return (
    <div
      className="flex items-start gap-2 rounded-md px-3 py-2 mt-4"
      style={{
        backgroundColor: "color-mix(in oklch, var(--success) 8%, transparent)",
        border: "1px solid color-mix(in oklch, var(--success) 20%, transparent)",
      }}
    >
      <TrendingUp className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[color:var(--success)]" />
      <p className="text-xs font-medium text-[color:var(--success)]">{text}</p>
    </div>
  );
}
