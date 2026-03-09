"use client";

import { useState, useMemo } from "react";
import { vendors } from "@/data/mock-data";
import type { Vendor, VendorStatus, VendorTier } from "@/lib/types";
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
  ChevronUp,
  ChevronDown,
  Store,
  Star,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

// ─── Status badge ────────────────────────────────────────────────────────────

function VendorStatusBadge({ status }: { status: VendorStatus }) {
  const config: Record<VendorStatus, { label: string; colorClass: string }> = {
    active: {
      label: "Active",
      colorClass:
        "text-[color:var(--success)] bg-[color:var(--success)]/12 border-0",
    },
    pending_approval: {
      label: "Pending Approval",
      colorClass:
        "text-[color:var(--warning)] bg-[color:var(--warning)]/12 border-0",
    },
    suspended: {
      label: "Suspended",
      colorClass: "text-destructive bg-destructive/12 border-0",
    },
    deactivated: {
      label: "Deactivated",
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

function TierBadge({ tier }: { tier: VendorTier }) {
  const config: Record<VendorTier, { label: string; colorClass: string }> = {
    basic: { label: "Basic", colorClass: "text-muted-foreground bg-muted/60 border-0" },
    pro: {
      label: "Pro",
      colorClass:
        "text-[color:var(--primary)] bg-[color:var(--primary)]/12 border-0",
    },
    enterprise: {
      label: "Enterprise",
      colorClass:
        "text-[color:var(--warning)] bg-[color:var(--warning)]/12 border-0",
    },
  };
  const c = config[tier];
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium rounded-full", c.colorClass)}
    >
      {c.label}
    </Badge>
  );
}

// ─── Expanded vendor detail panel ────────────────────────────────────────────

function VendorDetailPanel({ vendor }: { vendor: Vendor }) {
  return (
    <TableRow>
      <TableCell colSpan={8} className="p-0">
        <div className="border-l-2 border-primary/40 ml-4 pl-4 pr-6 py-4 bg-[color:var(--surface-hover)] grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
              Contact
            </p>
            <p className="font-medium text-foreground">{vendor.contactName}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{vendor.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
              Commission Rate
            </p>
            <p className="font-mono font-medium text-foreground">
              {vendor.commissionRate}%
            </p>
            <p className="text-muted-foreground text-xs mt-0.5">
              Applied to all sales
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
              Category
            </p>
            <p className="font-medium text-foreground">{vendor.category}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
              Member Since
            </p>
            <p className="font-mono text-foreground">
              {new Date(vendor.joinDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          {vendor.suspensionReason && (
            <div className="col-span-2 md:col-span-4 flex items-start gap-2 text-destructive bg-destructive/8 rounded-md px-3 py-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">{vendor.suspensionReason}</p>
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Sort helper ──────────────────────────────────────────────────────────────

type SortKey = "name" | "tier" | "rating" | "totalRevenue" | "listingsCount" | "joinDate";

function sortVendors(
  list: Vendor[],
  key: SortKey,
  dir: "asc" | "desc"
): Vendor[] {
  return [...list].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av < bv) return dir === "asc" ? -1 : 1;
    if (av > bv) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function VendorDirectoryPage() {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | VendorTier>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | VendorStatus>("all");
  const [sortKey, setSortKey] = useState<SortKey>("totalRevenue");
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
    const filtered = vendors.filter((v) => {
      const matchesTier = tierFilter === "all" || v.tier === tierFilter;
      const matchesStatus =
        statusFilter === "all" || v.status === statusFilter;
      const matchesSearch =
        q === "" ||
        v.name.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        v.contactName.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q);
      return matchesTier && matchesStatus && matchesSearch;
    });
    return sortVendors(filtered, sortKey, sortDir);
  }, [search, tierFilter, statusFilter, sortKey, sortDir]);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col)
      return <ChevronUp className="w-3 h-3 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  }

  const cols: { key: SortKey; label: string; sortable: boolean }[] = [
    { key: "name", label: "Vendor", sortable: true },
    { key: "tier", label: "Tier", sortable: true },
    { key: "rating", label: "Rating", sortable: true },
    { key: "totalRevenue", label: "Revenue", sortable: true },
    { key: "listingsCount", label: "Listings", sortable: true },
    { key: "joinDate", label: "Joined", sortable: true },
  ];

  return (
    <div className="p-[var(--content-padding,1.5rem)] space-y-6">
      {/* ── Page header ── */}
      <div className="border-l-4 border-primary pl-4">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              Vendor Directory
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Onboard, review, and manage marketplace sellers.
            </p>
          </div>
          <Button size="sm">Invite Vendor</Button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors by name, ID, or contact…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={tierFilter}
          onValueChange={(v) => setTierFilter(v as typeof tierFilter)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All tiers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tiers</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending_approval">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="deactivated">Deactivated</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground shrink-0">
          {displayed.length}{" "}
          {displayed.length === 1 ? "vendor" : "vendors"}
        </span>
      </div>

      {/* ── Table ── */}
      <div className="border border-border rounded-[var(--radius)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {cols.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      "text-xs font-medium text-muted-foreground",
                      col.sortable &&
                        "cursor-pointer select-none hover:text-foreground transition-colors"
                    )}
                    onClick={
                      col.sortable ? () => handleSort(col.key) : undefined
                    }
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && <SortIcon col={col.key} />}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-xs font-medium text-muted-foreground w-8">
                  Status
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
                    No vendors match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.flatMap((vendor) => [
                  <TableRow
                    key={vendor.id}
                    className={cn(
                      "cursor-pointer hover:bg-[color:var(--surface-hover)] transition-colors",
                      expandedId === vendor.id && "bg-[color:var(--surface-hover)]"
                    )}
                    onClick={() =>
                      setExpandedId(
                        expandedId === vendor.id ? null : vendor.id
                      )
                    }
                  >
                    {/* Vendor name + ID */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-primary font-bold text-xs font-mono">
                            {vendor.avatarInitials}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {vendor.name}
                          </p>
                          <p className="text-xs font-mono tracking-wider text-muted-foreground">
                            {vendor.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    {/* Tier */}
                    <TableCell>
                      <TierBadge tier={vendor.tier} />
                    </TableCell>
                    {/* Rating */}
                    <TableCell>
                      {vendor.rating > 0 ? (
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="w-3.5 h-3.5 text-[color:var(--warning)] fill-[color:var(--warning)]" />
                          <span className="font-mono tabular-nums">
                            {vendor.rating.toFixed(1)}
                          </span>
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    {/* Revenue */}
                    <TableCell className="font-mono tabular-nums text-sm text-right">
                      {vendor.totalRevenue > 0
                        ? `$${vendor.totalRevenue.toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}`
                        : "—"}
                    </TableCell>
                    {/* Listings */}
                    <TableCell className="font-mono tabular-nums text-sm text-center">
                      {vendor.listingsCount}
                    </TableCell>
                    {/* Joined */}
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(vendor.joinDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    {/* Status */}
                    <TableCell>
                      <VendorStatusBadge status={vendor.status} />
                    </TableCell>
                    {/* Expand chevron */}
                    <TableCell>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 text-muted-foreground/50 transition-transform duration-150",
                          expandedId === vendor.id && "rotate-90"
                        )}
                      />
                    </TableCell>
                  </TableRow>,

                  expandedId === vendor.id ? (
                    <VendorDetailPanel key={`${vendor.id}-detail`} vendor={vendor} />
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
