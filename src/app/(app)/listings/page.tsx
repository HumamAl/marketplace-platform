"use client";

import { useState, useMemo } from "react";
import { listings } from "@/data/mock-data";
import type { Listing, ListingCategory, ListingStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Search,
  Package,
  AlertTriangle,
  LayoutGrid,
  List,
  Flag,
} from "lucide-react";

// ─── Status badge ────────────────────────────────────────────────────────────

function ListingStatusBadge({ status }: { status: ListingStatus }) {
  const config: Record<ListingStatus, { label: string; colorClass: string }> = {
    active: {
      label: "Active",
      colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/12 border-0",
    },
    under_review: {
      label: "Under Review",
      colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/12 border-0",
    },
    flagged: {
      label: "Flagged",
      colorClass: "text-destructive bg-destructive/12 border-0",
    },
    rejected: {
      label: "Rejected",
      colorClass: "text-destructive bg-destructive/12 border-0",
    },
    draft: {
      label: "Draft",
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

// ─── Card view ───────────────────────────────────────────────────────────────

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <div
      className={cn(
        "border rounded-[var(--radius)] bg-card p-4 flex flex-col gap-3 transition-colors duration-150 border-l-4",
        listing.status === "flagged"
          ? "border-l-destructive/60 bg-destructive/4"
          : listing.status === "under_review"
          ? "border-l-[color:var(--warning)]/60"
          : listing.status === "draft"
          ? "border-l-muted-foreground/30"
          : "border-l-[color:oklch(0.68_0.14_35)]/60"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
            {listing.title}
          </p>
          <p className="text-[11px] font-mono tracking-wider text-muted-foreground mt-0.5">
            {listing.sku}
          </p>
        </div>
        <ListingStatusBadge status={listing.status} />
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {listing.thumbnailDescription}
      </p>

      <div className="flex items-center justify-between text-xs mt-auto pt-1 border-t border-border/50">
        <span className="text-muted-foreground truncate max-w-[120px]">{listing.vendorName}</span>
        <div className="flex items-center gap-3 shrink-0">
          {listing.stock === null ? (
            <span className="text-muted-foreground">Digital</span>
          ) : listing.stock === 0 ? (
            <span className="text-destructive font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Out of stock
            </span>
          ) : (
            <span className="text-muted-foreground">{listing.stock} in stock</span>
          )}
          <span className="font-mono font-semibold text-foreground">
            ${listing.price.toFixed(2)}
          </span>
        </div>
      </div>

      {listing.flagReason && (
        <div className="flex items-start gap-1.5 text-destructive bg-destructive/8 rounded px-2 py-1.5 text-xs">
          <Flag className="w-3 h-3 shrink-0 mt-0.5" />
          <p className="line-clamp-2">{listing.flagReason}</p>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const categories: ListingCategory[] = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Services",
  "Digital Products",
  "Other",
];

export default function ListingManagerPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | ListingCategory>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ListingStatus>("all");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const displayed = useMemo(() => {
    const q = search.toLowerCase();
    return listings.filter((l) => {
      const matchesCategory = categoryFilter === "all" || l.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || l.status === statusFilter;
      const matchesSearch =
        q === "" ||
        l.title.toLowerCase().includes(q) ||
        l.sku.toLowerCase().includes(q) ||
        l.vendorName.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q);
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [search, categoryFilter, statusFilter]);

  const flaggedCount = listings.filter((l) => l.status === "flagged").length;
  const reviewCount = listings.filter((l) => l.status === "under_review").length;

  return (
    <div className="p-[var(--content-padding,1.5rem)] space-y-6">
      {/* Page header */}
      <div className="border-l-4 border-[color:oklch(0.68_0.14_35)] pl-4">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Package className="w-5 h-5 text-[color:oklch(0.68_0.14_35)]" />
              Listing Manager
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review, moderate, and manage active SKUs across all vendors.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {flaggedCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 px-3 py-1.5 rounded-full">
                <Flag className="w-3.5 h-3.5" />
                {flaggedCount} flagged
              </div>
            )}
            {reviewCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-[color:var(--warning)] bg-[color:var(--warning)]/10 px-3 py-1.5 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                {reviewCount} under review
              </div>
            )}
            <Button size="sm" variant="outline">Export</Button>
          </div>
        </div>
      </div>

      {/* Filters + view toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search listings by title, SKU, or vendor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v as typeof categoryFilter)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
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
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        {/* View toggle */}
        <div className="flex items-center border border-border rounded-[var(--radius)] overflow-hidden shrink-0">
          <button
            onClick={() => setViewMode("card")}
            className={cn(
              "p-2 transition-colors duration-100",
              viewMode === "card"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-[color:var(--surface-hover)]"
            )}
            aria-label="Card view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "p-2 transition-colors duration-100",
              viewMode === "table"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-[color:var(--surface-hover)]"
            )}
            aria-label="Table view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <span className="text-sm text-muted-foreground shrink-0">
          {displayed.length} {displayed.length === 1 ? "listing" : "listings"}
        </span>
      </div>

      {/* Content */}
      {displayed.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-sm text-muted-foreground border border-border rounded-[var(--radius)]">
          No listings match this filter.
        </div>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="border border-border rounded-[var(--radius)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  {["Listing", "Vendor", "Category", "Price", "Stock", "Status"].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        "px-4 py-3 text-xs font-medium text-muted-foreground",
                        i >= 3 && i <= 4 ? "text-center" : i === 3 ? "text-right" : "text-left"
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map((listing) => {
                  const highlighted = listing.status === "flagged" || listing.stock === 0;
                  return (
                    <tr
                      key={listing.id}
                      className={cn(
                        "border-b border-border/60 hover:bg-[color:var(--surface-hover)] transition-colors",
                        highlighted && "bg-destructive/4 hover:bg-destructive/6"
                      )}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground line-clamp-1">{listing.title}</p>
                        <p className="text-[11px] font-mono tracking-wider text-muted-foreground mt-0.5">{listing.sku}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{listing.vendorName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{listing.category}</td>
                      <td className="px-4 py-3 font-mono tabular-nums text-right">${listing.price.toFixed(2)}</td>
                      <td className="px-4 py-3 font-mono tabular-nums text-center">
                        {listing.stock === null ? (
                          <span className="text-muted-foreground text-xs">—</span>
                        ) : listing.stock === 0 ? (
                          <span className="text-destructive text-xs font-medium">0</span>
                        ) : (
                          listing.stock
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <ListingStatusBadge status={listing.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
