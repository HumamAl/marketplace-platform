import type { LucideIcon } from "lucide-react";

// ─── Sidebar Navigation ────────────────────────────────────────────────────────

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// ─── Challenge & Proposal (template base) ─────────────────────────────────────

export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

export interface DemoScreen {
  id: string;
  label: string;
  icon?: LucideIcon;
  href: string;
}

export type ConversionVariant = "sidebar" | "inline" | "floating" | "banner";

// ─── Marketplace Domain Types ─────────────────────────────────────────────────

// Vendor (seller on the platform)
export type VendorTier = "basic" | "pro" | "enterprise";
export type VendorStatus = "active" | "pending_approval" | "suspended" | "deactivated";

export interface Vendor {
  id: string;
  name: string;
  contactName: string;
  email: string;
  tier: VendorTier;
  /** Average rating from buyers, 1.0–5.0 */
  rating: number;
  totalRevenue: number;
  listingsCount: number;
  ordersCount: number;
  joinDate: string;
  status: VendorStatus;
  avatarInitials: string;
  category: ListingCategory;
  /** Commission rate percentage applied to this vendor's sales */
  commissionRate: number;
  /** Reason when status === "suspended" */
  suspensionReason?: string;
}

// Listings (products/services posted by vendors)
export type ListingCategory =
  | "Electronics"
  | "Fashion"
  | "Home & Garden"
  | "Services"
  | "Digital Products"
  | "Other";

export type ListingStatus = "active" | "under_review" | "flagged" | "rejected" | "draft";

export interface Listing {
  id: string;
  vendorId: string;
  vendorName: string;
  title: string;
  sku: string;
  category: ListingCategory;
  price: number;
  /** Units in stock; null for services/digital products */
  stock: number | null;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  /** Short description for table/card display */
  thumbnailDescription: string;
  /** Reason when status === "flagged" | "rejected" */
  flagReason?: string;
}

// Orders
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "disputed"
  | "refunded"
  | "cancelled";

export interface OrderLineItem {
  listingId: string;
  title: string;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  buyerName: string;
  buyerEmail: string;
  vendorId: string;
  vendorName: string;
  items: OrderLineItem[];
  subtotal: number;
  platformFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  /** Present when status === "shipped" | "delivered" */
  trackingNumber: string | null;
  /** Dispute reason when status === "disputed" */
  disputeReason?: string;
}

// Payouts
export type PayoutStatus = "pending" | "processing" | "completed" | "failed" | "on_hold";

export interface Payout {
  id: string;
  vendorId: string;
  vendorName: string;
  orderId: string;
  /** Gross order amount */
  amount: number;
  /** Platform commission deducted */
  commission: number;
  /** Net amount paid to vendor */
  vendorPayout: number;
  status: PayoutStatus;
  processedAt: string;
  /** ISO datetime; null if not yet paid out */
  payoutDate: string | null;
  /** Reason when status === "failed" | "on_hold" */
  holdReason?: string;
}

// Messages
export type MessageRole = "vendor" | "buyer" | "admin" | "support";

export interface Message {
  id: string;
  threadId: string;
  fromName: string;
  fromRole: MessageRole;
  toName: string;
  toRole: MessageRole;
  subject: string;
  preview: string;
  timestamp: string;
  read: boolean;
}

// Platform Metrics (dashboard KPI cards)
export interface PlatformMetrics {
  /** Gross Merchandise Value — total sales volume */
  gmv: number;
  gmvChange: number;
  /** Total orders this period */
  monthlyOrders: number;
  monthlyOrdersChange: number;
  /** Vendors with at least one active listing */
  activeVendors: number;
  activeVendorsChange: number;
  /** Total live listings across all vendors */
  activeListings: number;
  activeListingsChange: number;
  /** % of sessions resulting in a completed order */
  conversionRate: number;
  conversionRateChange: number;
  /** % of orders that enter dispute */
  disputeRate: number;
  disputeRateChange: number;
  /** Platform revenue as % of GMV */
  takeRate: number;
  takeRateChange: number;
  /** Average order value in dollars */
  avgOrderValue: number;
  avgOrderValueChange: number;
}

// GMV Time Series (12 months)
export interface GmvDataPoint {
  month: string;
  gmv: number;
  orders: number;
  newVendors: number;
}

// Category Breakdown
export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
  gmvShare: number;
}

// Module Health (2×4 health grid on the main dashboard)
export type ModuleHealthStatus = "healthy" | "warning" | "degraded";

export interface ModuleHealth {
  id: string;
  moduleName: string;
  status: ModuleHealthStatus;
  metricLabel: string;
  metricValue: string;
  /** Brief description shown when status !== "healthy" */
  statusNote?: string;
}

// Recent Activity Feed
export type ActivityType =
  | "vendor_onboarded"
  | "order_fulfilled"
  | "listing_published"
  | "dispute_opened"
  | "payout_sent"
  | "listing_flagged"
  | "vendor_suspended";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  status: "success" | "info" | "warning" | "error";
}

// Generic chart data point
export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
}
