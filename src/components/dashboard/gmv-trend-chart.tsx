"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { GmvDataPoint } from "@/lib/types";

function formatGMV(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

interface TooltipEntry {
  color: string;
  name: string;
  value: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-muted-foreground flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name === "gmv" ? "GMV" : "Orders"}:{" "}
          <span className="font-mono font-medium text-foreground">
            {entry.name === "gmv"
              ? formatGMV(entry.value)
              : entry.value.toLocaleString()}
          </span>
        </p>
      ))}
    </div>
  );
};

interface Props {
  data: GmvDataPoint[];
  metric: "gmv" | "orders";
}

export function GmvTrendChart({ data, metric }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="gmvFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.22} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.01} />
          </linearGradient>
          <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.6}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={
            metric === "gmv"
              ? (v: number) => formatGMV(v)
              : (v: number) => v.toLocaleString()
          }
          width={metric === "gmv" ? 52 : 44}
        />
        <Tooltip content={<CustomTooltip />} />
        {metric === "gmv" ? (
          <Area
            type="monotone"
            dataKey="gmv"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#gmvFill)"
            dot={false}
            activeDot={{ r: 3, fill: "var(--primary)" }}
          />
        ) : (
          <Area
            type="monotone"
            dataKey="orders"
            stroke="var(--chart-2)"
            strokeWidth={2}
            fill="url(#ordersFill)"
            dot={false}
            activeDot={{ r: 3, fill: "var(--chart-2)" }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
