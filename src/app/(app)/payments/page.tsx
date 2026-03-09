"use client";

import { useState, useMemo } from "react";
import { payouts } from "@/data/mock-data";
import type { PayoutStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Search,
  CreditCard,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// ─── Status badge ────────────────────────────────────────────────────────────

function PayoutStatusBadge({ status }: { status: PayoutStatus }) {
  const config: Record<PayoutStatus, { label: string; colorClass: string }> = {
    completed: {
      label: "Completed",
      colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/12 border-0",
    },
    processing: {
      label: "Processing",
      colorClass: "text-[color:oklch(0.62_0.15_230)] bg-[color:oklch(0.62_0.15_230)]/12 border-0",
    },
    pending: {
      label: "Pending",
      colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/12 border-0",
    },
    on_hold: {
      label: "On Hold",
      colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/12 border-0",
    },
    failed: {
      label: "Failed",
      colorClass: "text-destructive bg-destructive/12 border-0",
    },
  };
  const c = config[status];
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium rounded-full", c.colorClass)}
    >
      {c.label}
    </Badge>
  );
}

// ─── Summary stat ──────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  accent,
  subtext,
}: {
  label: string;
  value: string;
  accent?: "success" | "warning" | "destructive" | "neutral";
  subtext?: string;
}) {
  const accentClass =
    accent === "success"
      ? "border-l-[color:var(--success)]"
      : accent === "warning"
      ? "border-l-[color:var(--warning)]"
      : accent === "destructive"
      ? "border-l-destructive"
      : "border-l-[color:oklch(0.58_0.19_149)]";

  return (
    <div
      className={cn(
        "border border-border rounded-[var(--radius)] bg-card px-5 py-4 border-l-4",
        accentClass
      )}
    >
      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
        {label}
      </p>
      <p className="text-2xl font-bold font-mono tabular-nums tracking-tight text-foreground">
        {value}
      </p>
      {subtext && (
        <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
      )}
    </div>
  );
}

// ─── Sort ─────────────────────────────────────────────────────────────────────

type SortKey = "id" | "vendorName" | "amount" | "vendorPayout" | "commission" | "processedAt";

function sortPayouts(list: typeof payouts, key: SortKey, dir: "asc" | "desc") {
  return [...list].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av === undefined || bv === undefined) return 0;
    if (av < bv) return dir === "asc" ? -1 : 1;
    if (av > bv) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

// ─── Page ────────────────────────────────────────────────────────────────────

const statusOptions: PayoutStatus[] = [
  "completed",
  "processing",
  "pending",
  "on_hold",
  "failed",
];

export default function PaymentsPayoutsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PayoutStatus>("all");
  const [sortKey, setSortKey] = useState<SortKey>("processedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const displayed = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = payouts.filter((p) => {
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesSearch =
        q === "" ||
        p.id.toLowerCase().includes(q) ||
        p.vendorName.toLowerCase().includes(q) ||
        p.orderId.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
    return sortPayouts(filtered, sortKey, sortDir);
  }, [search, statusFilter, sortKey, sortDir]);

  // Summary stats
  const totalCompleted = payouts
    .filter((p) => p.status === "completed")
    .reduce((s, p) => s + p.vendorPayout, 0);
  const totalCommission = payouts
    .filter((p) => p.status === "completed")
    .reduce((s, p) => s + p.commission, 0);
  const failedCount = payouts.filter((p) => p.status === "failed").length;
  const pendingAmount = payouts
    .filter((p) => p.status === "pending" || p.status === "processing")
    .reduce((s, p) => s + p.vendorPayout, 0);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  }

  return (
    <div className="p-[var(--content-padding,1.5rem)] space-y-6">
      {/* Page header */}
      <div className="border-l-4 border-[color:oklch(0.58_0.19_149)] pl-4">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[color:oklch(0.58_0.19_149)]" />
              Payments & Payouts
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track vendor disbursements, commission splits, and failed transfers.
            </p>
          </div>
          <Button size="sm" variant="outline">Export</Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Disbursed"
          value={`$${totalCompleted.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
          accent="success"
          subtext="Completed payouts"
        />
        <StatCard
          label="Platform Commission"
          value={`$${totalCommission.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
          accent="neutral"
          subtext="From completed orders"
        />
        <StatCard
          label="Failed Payouts"
          value={String(failedCount)}
          accent="destructive"
          subtext={failedCount > 0 ? "Requires vendor action" : "All clear"}
        />
        <StatCard
          label="Pending Amount"
          value={`$${pendingAmount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
          accent="warning"
          subtext="Awaiting processing"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by payout ID, vendor, or order ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground shrink-0">
          {displayed.length} {displayed.length === 1 ? "record" : "records"}
        </span>
      </div>

      {/* Table */}
      <div className="border border-border rounded-[var(--radius)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead
                  className="text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center gap-1">Payout ID <SortIcon col="id" /></div>
                </TableHead>
                <TableHead
                  className="text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort("vendorName")}
                >
                  <div className="flex items-center gap-1">Vendor <SortIcon col="vendorName" /></div>
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Order ID</TableHead>
                <TableHead
                  className="text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center justify-end gap-1">Amount <SortIcon col="amount" /></div>
                </TableHead>
                <TableHead
                  className="text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort("commission")}
                >
                  <div className="flex items-center justify-end gap-1">Commission <SortIcon col="commission" /></div>
                </TableHead>
                <TableHead
                  className="text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort("vendorPayout")}
                >
                  <div className="flex items-center justify-end gap-1">Vendor Payout <SortIcon col="vendorPayout" /></div>
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead
                  className="text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort("processedAt")}
                >
                  <div className="flex items-center gap-1">Processed <SortIcon col="processedAt" /></div>
                </TableHead>
                <TableHead className="w-6" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No payout records match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.flatMap((payout) => [
                  <TableRow
                    key={payout.id}
                    className={cn(
                      "cursor-pointer hover:bg-[color:var(--surface-hover)] transition-colors",
                      payout.status === "failed" && "bg-destructive/4 hover:bg-destructive/6",
                      payout.status === "on_hold" && "bg-[color:var(--warning)]/4",
                      expandedId === payout.id && "bg-[color:var(--surface-hover)]"
                    )}
                    onClick={() =>
                      setExpandedId(expandedId === payout.id ? null : payout.id)
                    }
                  >
                    {/* Payout ID */}
                    <TableCell>
                      <span className="font-mono text-xs tracking-wider font-medium text-foreground">
                        {payout.id}
                      </span>
                    </TableCell>
                    {/* Vendor */}
                    <TableCell className="text-sm">{payout.vendorName}</TableCell>
                    {/* Order ID */}
                    <TableCell>
                      <span className="font-mono text-xs tracking-wider text-muted-foreground">
                        {payout.orderId}
                      </span>
                    </TableCell>
                    {/* Amount */}
                    <TableCell className="font-mono tabular-nums text-sm text-right">
                      ${payout.amount.toFixed(2)}
                    </TableCell>
                    {/* Commission */}
                    <TableCell className="font-mono tabular-nums text-sm text-right text-muted-foreground">
                      ${payout.commission.toFixed(2)}
                    </TableCell>
                    {/* Vendor Payout */}
                    <TableCell className="font-mono tabular-nums text-sm text-right font-semibold">
                      ${payout.vendorPayout.toFixed(2)}
                    </TableCell>
                    {/* Status */}
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <PayoutStatusBadge status={payout.status} />
                        {payout.status === "failed" && (
                          <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                        )}
                      </div>
                    </TableCell>
                    {/* Processed date */}
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(payout.processedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    {/* Expand */}
                    <TableCell>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 text-muted-foreground/50 transition-transform duration-150",
                          expandedId === payout.id && "rotate-90"
                        )}
                      />
                    </TableCell>
                  </TableRow>,

                  expandedId === payout.id ? (
                    <TableRow key={`${payout.id}-detail`}>
                      <TableCell colSpan={9} className="p-0">
                        <div className="border-l-2 border-[color:oklch(0.58_0.19_149)]/50 ml-4 pl-4 pr-6 py-4 bg-[color:var(--surface-hover)] grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">Payout Date</p>
                            <p className="font-mono text-foreground">
                              {payout.payoutDate
                                ? new Date(payout.payoutDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">Order ID</p>
                            <p className="font-mono text-xs tracking-wider text-foreground">{payout.orderId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">Net to Vendor</p>
                            <p className="font-mono font-bold text-lg text-foreground">${payout.vendorPayout.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">Payout ID</p>
                            <p className="font-mono text-xs tracking-wider text-foreground">{payout.id}</p>
                          </div>
                          {payout.holdReason && (
                            <div className={cn(
                              "col-span-2 md:col-span-4 flex items-start gap-2 rounded-md px-3 py-2 text-xs",
                              payout.status === "failed"
                                ? "text-destructive bg-destructive/8"
                                : "text-[color:var(--warning)] bg-[color:var(--warning)]/8"
                            )}>
                              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                              <p className="leading-relaxed">{payout.holdReason}</p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null,
                ])
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
