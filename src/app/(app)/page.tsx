"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  ShoppingCart,
  Store,
  Package,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Activity,
  UserPlus,
  Flag,
  MessageSquare,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config";
import {
  platformMetrics,
  gmvTimeSeries,
  moduleHealth,
  recentActivity,
} from "@/data/mock-data";
import type { ModuleHealth, ActivityEvent } from "@/lib/types";
import { MarketplaceGridCanvas } from "@/components/dashboard/marketplace-grid-canvas";

// SSR-safe chart import
const GmvTrendChart = dynamic(
  () =>
    import("@/components/dashboard/gmv-trend-chart").then(
      (m) => m.GmvTrendChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[240px] bg-muted/30 rounded-lg animate-pulse" />
    ),
  }
);

// ─── Animated counter hook ────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1100) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ─── Module Health Card ───────────────────────────────────────────────────────

const MODULE_ICONS: Record<string, React.ElementType> = {
  "MOD-vendors": Store,
  "MOD-listings": Package,
  "MOD-orders": ShoppingCart,
  "MOD-payments": CreditCard,
  "MOD-messages": MessageSquare,
  "MOD-users": UserPlus,
  "MOD-api": Activity,
  "MOD-analytics": TrendingUp,
};

const MODULE_BORDER_COLORS: Record<string, string> = {
  "MOD-vendors": "border-l-[var(--chart-1)]",
  "MOD-listings": "border-l-[var(--chart-2)]",
  "MOD-orders": "border-l-[var(--chart-3)]",
  "MOD-payments": "border-l-[var(--chart-4)]",
  "MOD-messages": "border-l-[var(--chart-5)]",
  "MOD-users": "border-l-[var(--chart-1)]",
  "MOD-api": "border-l-[var(--chart-4)]",
  "MOD-analytics": "border-l-[var(--chart-2)]",
};

function StatusBadge({ status }: { status: ModuleHealth["status"] }) {
  if (status === "healthy") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded"
        style={{ backgroundColor: "color-mix(in oklch, var(--success), transparent 88%)", color: "var(--success)" }}>
        <CheckCircle2 className="w-2.5 h-2.5" />
        Healthy
      </span>
    );
  }
  if (status === "warning") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded"
        style={{ backgroundColor: "color-mix(in oklch, var(--warning), transparent 88%)", color: "oklch(0.60 0.17 70)" }}>
        <AlertTriangle className="w-2.5 h-2.5" />
        Warning
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded"
      style={{ backgroundColor: "color-mix(in oklch, var(--destructive), transparent 88%)", color: "var(--destructive)" }}>
      <XCircle className="w-2.5 h-2.5" />
      Degraded
    </span>
  );
}

function ModuleCard({
  module,
  index,
}: {
  module: ModuleHealth;
  index: number;
}) {
  const Icon = MODULE_ICONS[module.id] ?? Activity;
  const borderColor = MODULE_BORDER_COLORS[module.id] ?? "border-l-[var(--chart-1)]";

  return (
    <div
      className={cn(
        "aesthetic-card border-l-4 p-4 animate-fade-up-in",
        borderColor
      )}
      style={{
        animationDelay: `${index * 60}ms`,
        animationDuration: "150ms",
        animationFillMode: "both",
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-semibold text-foreground tracking-tight">
            {module.moduleName}
          </span>
        </div>
        <StatusBadge status={module.status} />
      </div>
      <p className="text-[10px] text-muted-foreground mb-0.5">
        {module.metricLabel}
      </p>
      <p className="font-mono text-sm font-semibold tracking-wide text-foreground">
        {module.metricValue}
      </p>
      {module.statusNote && (
        <p className="text-[10px] text-muted-foreground mt-1.5 leading-snug">
          {module.statusNote}
        </p>
      )}
    </div>
  );
}

// ─── Activity Feed Item ───────────────────────────────────────────────────────

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  vendor_onboarded: UserPlus,
  order_fulfilled: CheckCircle2,
  listing_published: Package,
  dispute_opened: AlertCircle,
  payout_sent: CreditCard,
  listing_flagged: Flag,
  vendor_suspended: XCircle,
};

function ActivityRow({ event }: { event: ActivityEvent }) {
  const Icon = ACTIVITY_ICONS[event.type] ?? Activity;
  const timeAgo = useMemo(() => {
    const now = new Date("2026-03-08T00:00:00Z");
    const ts = new Date(event.timestamp);
    const diffDays = Math.round(
      (now.getTime() - ts.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  }, [event.timestamp]);

  const iconColor =
    event.status === "success"
      ? "var(--success)"
      : event.status === "warning"
      ? "var(--warning)"
      : event.status === "error"
      ? "var(--destructive)"
      : "var(--muted-foreground)";

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0 aesthetic-hover px-1 rounded">
      <div
        className="mt-0.5 shrink-0 w-6 h-6 rounded flex items-center justify-center"
        style={{
          backgroundColor: `color-mix(in oklch, ${iconColor}, transparent 88%)`,
        }}
      >
        <Icon className="w-3 h-3" style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-foreground leading-snug">
          {event.description}
        </p>
      </div>
      <span className="text-[10px] text-muted-foreground shrink-0 font-mono mt-0.5">
        {timeAgo}
      </span>
    </div>
  );
}

// ─── Hero metric with countup ─────────────────────────────────────────────────

function HeroGMV({ value, change }: { value: number; change: number }) {
  const { count, ref } = useCountUp(Math.round(value));
  const positive = change >= 0;
  return (
    <div ref={ref}>
      <p className="text-xs font-medium tracking-wide uppercase mb-1" style={{ color: "color-mix(in oklch, var(--primary), oklch(0.3 0 0) 35%)" }}>
        Gross Merchandise Value
      </p>
      <p className="text-4xl font-bold font-mono tracking-tight text-foreground">
        ${count.toLocaleString()}
      </p>
      <div className="flex items-center gap-1 mt-1">
        {positive ? (
          <TrendingUp className="w-3 h-3" style={{ color: "var(--success)" }} />
        ) : (
          <TrendingDown className="w-3 h-3 text-destructive" />
        )}
        <span
          className="text-xs font-mono"
          style={{ color: positive ? "var(--success)" : "var(--destructive)" }}
        >
          {positive ? "+" : ""}
          {change}% · MTD vs prior period
        </span>
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  change,
  index,
}: {
  label: string;
  value: number;
  change: number;
  index: number;
}) {
  const { count, ref } = useCountUp(value, 900);
  const positive = change >= 0;
  return (
    <div
      ref={ref}
      className="animate-fade-up-in"
      style={{
        animationDelay: `${index * 80}ms`,
        animationDuration: "150ms",
        animationFillMode: "both",
      }}
    >
      <p className="text-[10px] text-muted-foreground/80 uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="text-xl font-bold font-mono text-foreground">
        {count.toLocaleString()}
      </p>
      <p
        className="text-[10px] font-mono mt-0.5"
        style={{ color: positive ? "var(--success)" : "var(--destructive)" }}
      >
        {positive ? "+" : ""}
        {change}%
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type ChartMetric = "gmv" | "orders";
type StatusFilter = "all" | "healthy" | "warning" | "degraded";

export default function DashboardPage() {
  const [chartMetric, setChartMetric] = useState<ChartMetric>("gmv");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredModules = useMemo(() => {
    if (statusFilter === "all") return moduleHealth;
    return moduleHealth.filter((m) => m.status === statusFilter);
  }, [statusFilter]);

  const chartData = useMemo(() => gmvTimeSeries, []);

  const healthCounts = useMemo(() => {
    const healthy = moduleHealth.filter((m) => m.status === "healthy").length;
    const warning = moduleHealth.filter((m) => m.status === "warning").length;
    const degraded = moduleHealth.filter((m) => m.status === "degraded").length;
    return { healthy, warning, degraded };
  }, []);

  return (
    <div className="page-container space-y-6">
      {/* ── Hero Section with Canvas ────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-lg border border-border/60 bg-card"
        style={{ minHeight: "200px" }}
      >
        <MarketplaceGridCanvas />
        <div className="relative z-10 p-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <HeroGMV
              value={platformMetrics.gmv}
              change={platformMetrics.gmvChange}
            />
            <div className="flex items-start sm:items-end gap-6 sm:gap-8">
              <MiniMetric
                label="Monthly Orders"
                value={platformMetrics.monthlyOrders}
                change={platformMetrics.monthlyOrdersChange}
                index={0}
              />
              <MiniMetric
                label="Active Vendors"
                value={platformMetrics.activeVendors}
                change={platformMetrics.activeVendorsChange}
                index={1}
              />
              <MiniMetric
                label="Active Listings"
                value={platformMetrics.activeListings}
                change={platformMetrics.activeListingsChange}
                index={2}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Module Health Grid ───────────────────────────────────────── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Platform Modules
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {healthCounts.healthy} healthy · {healthCounts.warning} warning ·{" "}
              {healthCounts.degraded} degraded
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(
              [
                { value: "all", label: "All" },
                { value: "healthy", label: "Healthy" },
                { value: "warning", label: "Warning" },
                { value: "degraded", label: "Degraded" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={cn(
                  "px-2.5 py-1 text-xs rounded border transition-colors",
                  "duration-[var(--dur-fast)] ease-[var(--ease-snappy)]",
                  statusFilter === opt.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {filteredModules.length === 0 ? (
          <div className="text-xs text-muted-foreground py-8 text-center border border-dashed border-border/50 rounded-lg">
            No modules match this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredModules.map((module, i) => (
              <ModuleCard key={module.id} module={module} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ── GMV Trend Chart ──────────────────────────────────────────── */}
      <div className="aesthetic-card" style={{ padding: "var(--card-padding)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Volume Trend
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              12-month GMV and order volume — Nov spike from Black Friday
            </p>
          </div>
          <div className="flex gap-1.5">
            {(
              [
                { value: "gmv", label: "GMV ($)" },
                { value: "orders", label: "Orders" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setChartMetric(opt.value)}
                className={cn(
                  "px-2.5 py-1 text-xs rounded border transition-colors",
                  "duration-[var(--dur-fast)] ease-[var(--ease-snappy)]",
                  chartMetric === opt.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <GmvTrendChart data={chartData} metric={chartMetric} />
      </div>

      {/* ── Bottom Row: Activity + Platform Health Summary ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Feed */}
        <div
          className="aesthetic-card lg:col-span-2"
          style={{ padding: "var(--card-padding)" }}
        >
          <h2 className="text-base font-semibold tracking-tight text-foreground mb-3">
            Platform Activity
          </h2>
          <div>
            {recentActivity.slice(0, 7).map((event) => (
              <ActivityRow key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* Quick metrics summary */}
        <div
          className="aesthetic-card"
          style={{ padding: "var(--card-padding)" }}
        >
          <h2 className="text-base font-semibold tracking-tight text-foreground mb-4">
            Marketplace Health
          </h2>
          <div className="space-y-4">
            <MetricRow
              label="Conversion Rate"
              value={`${platformMetrics.conversionRate}%`}
              change={platformMetrics.conversionRateChange}
              suffix="of sessions → order"
            />
            <MetricRow
              label="Take Rate"
              value={`${platformMetrics.takeRate}%`}
              change={platformMetrics.takeRateChange}
              suffix="platform revenue / GMV"
            />
            <MetricRow
              label="Avg Order Value"
              value={`$${platformMetrics.avgOrderValue}`}
              change={platformMetrics.avgOrderValueChange}
              suffix="per completed order"
            />
            <MetricRow
              label="Dispute Rate"
              value={`${platformMetrics.disputeRate}%`}
              change={platformMetrics.disputeRateChange}
              suffix="target < 4.0%"
              invertChange
            />
          </div>
        </div>
      </div>

      {/* ── Proposal Banner ──────────────────────────────────────────── */}
      <div className="mt-2 p-4 rounded-lg border border-primary/15 bg-gradient-to-r from-primary/5 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">
            Live demo built for{" "}
            {APP_CONFIG.clientName ?? APP_CONFIG.projectName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Humam · Full-Stack Developer · Available now
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/challenges"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-[var(--dur-fast)]"
          >
            My approach →
          </a>
          <a
            href="/proposal"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors duration-[var(--dur-fast)]"
          >
            Work with me
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Metric row helper ────────────────────────────────────────────────────────

function MetricRow({
  label,
  value,
  change,
  suffix,
  invertChange = false,
}: {
  label: string;
  value: string;
  change: number;
  suffix: string;
  invertChange?: boolean;
}) {
  // For dispute rate: lower is better, so negative change is green
  const isPositive = invertChange ? change <= 0 : change >= 0;
  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{suffix}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-mono text-sm font-semibold text-foreground">
          {value}
        </p>
        <p
          className="text-[10px] font-mono"
          style={{
            color: isPositive ? "var(--success)" : "var(--destructive)",
          }}
        >
          {change > 0 ? "+" : ""}
          {change}%
        </p>
      </div>
    </div>
  );
}
