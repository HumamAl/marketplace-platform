"use client";

import { useState, useMemo } from "react";
import { orders } from "@/data/mock-data";
import type { OrderStatus } from "@/lib/types";
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
  ShoppingCart,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

// ─── Status badge ────────────────────────────────────────────────────────────

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<OrderStatus, { label: string; colorClass: string }> = {
    pending: {
      label: "Pending",
      colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/12 border-0",
    },
    processing: {
      label: "Processing",
      colorClass: "text-[color:oklch(0.62_0.15_230)] bg-[color:oklch(0.62_0.15_230)]/12 border-0",
    },
    shipped: {
      label: "Shipped",
      colorClass: "text-[color:oklch(0.55_0.18_255)] bg-[color:oklch(0.55_0.18_255)]/12 border-0",
    },
    delivered: {
      label: "Delivered",
      colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/12 border-0",
    },
    disputed: {
      label: "Disputed",
      colorClass: "text-destructive bg-destructive/12 border-0",
    },
    refunded: {
      label: "Refunded",
      colorClass: "text-muted-foreground bg-muted/60 border-0",
    },
    cancelled: {
      label: "Cancelled",
      colorClass: "text-muted-foreground bg-muted/60 border-0",
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

// ─── Expanded order detail ─────────────────────────────────────────────────

function OrderDetailPanel({ order }: { order: typeof orders[number] }) {
  return (
    <TableRow>
      <TableCell colSpan={8} className="p-0">
        <div className="border-l-2 border-[color:oklch(0.55_0.18_255)]/50 ml-4 pl-4 pr-6 py-4 bg-[color:var(--surface-hover)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
                Buyer
              </p>
              <p className="font-medium text-foreground">{order.buyerName}</p>
              <p className="text-xs text-muted-foreground">{order.buyerEmail}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
                Platform Fee
              </p>
              <p className="font-mono font-medium text-foreground">
                ${order.platformFee.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
                Tracking
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                {order.trackingNumber ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
                Last Updated
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                {new Date(order.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Line items */}
          <div className="space-y-1">
            {order.items.map((item) => (
              <div
                key={item.listingId}
                className="flex items-center justify-between text-xs text-muted-foreground bg-muted/40 rounded px-3 py-1.5"
              >
                <span className="font-medium text-foreground">{item.title}</span>
                <span className="font-mono tabular-nums">
                  {item.qty} × ${item.unitPrice.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Dispute reason */}
          {order.disputeReason && (
            <div className="flex items-start gap-2 mt-3 text-destructive bg-destructive/8 rounded-md px-3 py-2 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{order.disputeReason}</p>
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Sort ─────────────────────────────────────────────────────────────────────

type SortKey = "id" | "total" | "createdAt" | "status";

function sortOrders(list: typeof orders, key: SortKey, dir: "asc" | "desc") {
  return [...list].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av < bv) return dir === "asc" ? -1 : 1;
    if (av > bv) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

// ─── Page ────────────────────────────────────────────────────────────────────

const statusOptions: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "disputed",
  "refunded",
  "cancelled",
];

export default function OrderQueuePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
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
    const filtered = orders.filter((o) => {
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      const matchesSearch =
        q === "" ||
        o.id.toLowerCase().includes(q) ||
        o.buyerName.toLowerCase().includes(q) ||
        o.vendorName.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
    return sortOrders(filtered, sortKey, sortDir);
  }, [search, statusFilter, sortKey, sortDir]);

  const disputedCount = orders.filter((o) => o.status === "disputed").length;

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
      <div className="border-l-4 border-[color:oklch(0.55_0.18_255)] pl-4">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[color:oklch(0.55_0.18_255)]" />
              Order Queue
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor fulfillment status and resolve disputes across all vendor orders.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {disputedCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 px-3 py-1.5 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                {disputedCount} disputed
              </div>
            )}
            <Button size="sm" variant="outline">Export</Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, buyer, or vendor…"
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
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground shrink-0">
          {displayed.length} {displayed.length === 1 ? "order" : "orders"}
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
                  <div className="flex items-center gap-1">
                    Order ID <SortIcon col="id" />
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Buyer</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Vendor</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-center">Items</TableHead>
                <TableHead
                  className="text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort("total")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Total <SortIcon col="total" />
                  </div>
                </TableHead>
                <TableHead
                  className="text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Status <SortIcon col="status" />
                  </div>
                </TableHead>
                <TableHead
                  className="text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1">
                    Date <SortIcon col="createdAt" />
                  </div>
                </TableHead>
                <TableHead className="w-6" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No orders match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.flatMap((order) => [
                  <TableRow
                    key={order.id}
                    className={cn(
                      "cursor-pointer hover:bg-[color:var(--surface-hover)] transition-colors",
                      order.status === "disputed" && "bg-destructive/4 hover:bg-destructive/6",
                      expandedId === order.id && "bg-[color:var(--surface-hover)]"
                    )}
                    onClick={() =>
                      setExpandedId(expandedId === order.id ? null : order.id)
                    }
                  >
                    {/* Order ID */}
                    <TableCell>
                      <span className="font-mono text-xs tracking-wider text-foreground font-medium">
                        {order.id}
                      </span>
                      {order.status === "disputed" && (
                        <AlertTriangle className="w-3.5 h-3.5 text-destructive inline ml-1.5" />
                      )}
                    </TableCell>
                    {/* Buyer */}
                    <TableCell className="text-sm">{order.buyerName}</TableCell>
                    {/* Vendor */}
                    <TableCell className="text-sm text-muted-foreground">
                      {order.vendorName}
                    </TableCell>
                    {/* Items */}
                    <TableCell className="text-center font-mono tabular-nums text-sm">
                      {order.items.length}
                    </TableCell>
                    {/* Total */}
                    <TableCell className="font-mono tabular-nums text-sm text-right">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    {/* Status */}
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    {/* Date */}
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    {/* Expand */}
                    <TableCell>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 text-muted-foreground/50 transition-transform duration-150",
                          expandedId === order.id && "rotate-90"
                        )}
                      />
                    </TableCell>
                  </TableRow>,

                  expandedId === order.id ? (
                    <OrderDetailPanel key={`${order.id}-detail`} order={order} />
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
