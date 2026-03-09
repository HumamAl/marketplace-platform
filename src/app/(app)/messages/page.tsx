"use client";

import { useState, useMemo } from "react";
import { messages } from "@/data/mock-data";
import type { MessageRole } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search, MessageSquare, Circle } from "lucide-react";

// ─── Role badge ────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: MessageRole }) {
  const config: Record<MessageRole, { label: string; colorClass: string }> = {
    vendor: {
      label: "Vendor",
      colorClass: "text-[color:var(--primary)] bg-[color:var(--primary)]/12 border-0",
    },
    buyer: {
      label: "Buyer",
      colorClass: "text-[color:oklch(0.55_0.18_255)] bg-[color:oklch(0.55_0.18_255)]/12 border-0",
    },
    admin: {
      label: "Admin",
      colorClass: "text-[color:oklch(0.52_0.17_290)] bg-[color:oklch(0.52_0.17_290)]/12 border-0",
    },
    support: {
      label: "Support",
      colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/12 border-0",
    },
  };
  const c = config[role];
  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] font-medium rounded-full px-2", c.colorClass)}
    >
      {c.label}
    </Badge>
  );
}

// ─── Message row ──────────────────────────────────────────────────────────

function MessageRow({
  message,
  selected,
  onSelect,
}: {
  message: typeof messages[number];
  selected: boolean;
  onSelect: () => void;
}) {
  const timeLabel = (() => {
    const d = new Date(message.timestamp);
    const now = new Date("2026-03-08T00:00:00Z");
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  })();

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3.5 cursor-pointer border-b border-border/60 transition-colors duration-100 border-l-4",
        selected
          ? "bg-[color:oklch(0.52_0.17_290)]/6 border-l-[color:oklch(0.52_0.17_290)]"
          : message.read
          ? "border-l-transparent hover:bg-[color:var(--surface-hover)]"
          : "border-l-[color:oklch(0.52_0.17_290)]/50 bg-[color:oklch(0.52_0.17_290)]/4 hover:bg-[color:oklch(0.52_0.17_290)]/8"
      )}
      onClick={onSelect}
    >
      {/* Unread dot */}
      <div className="mt-1.5 shrink-0 w-2 flex justify-center">
        {!message.read && (
          <Circle className="w-2 h-2 fill-[color:oklch(0.52_0.17_290)] text-[color:oklch(0.52_0.17_290)]" />
        )}
      </div>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-[color:oklch(0.52_0.17_290)]/10 flex items-center justify-center shrink-0 text-[color:oklch(0.52_0.17_290)] font-semibold text-xs">
        {message.fromName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={cn(
                "text-sm truncate",
                !message.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"
              )}
            >
              {message.fromName}
            </span>
            <RoleBadge role={message.fromRole} />
          </div>
          <span className="text-xs text-muted-foreground shrink-0">{timeLabel}</span>
        </div>
        <p
          className={cn(
            "text-sm truncate",
            !message.read ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {message.subject}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{message.preview}</p>
      </div>
    </div>
  );
}

// ─── Message detail pane ──────────────────────────────────────────────────

function MessageDetail({ message }: { message: typeof messages[number] }) {
  const dateLabel = new Date(message.timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border/60 px-6 py-4 border-l-4 border-l-[color:oklch(0.52_0.17_290)]">
        <h2 className="text-base font-semibold text-foreground">{message.subject}</h2>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-sm text-muted-foreground">From</span>
          <span className="text-sm font-medium">{message.fromName}</span>
          <RoleBadge role={message.fromRole} />
          <span className="text-muted-foreground text-xs">→</span>
          <span className="text-sm font-medium">{message.toName}</span>
          <RoleBadge role={message.toRole} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{dateLabel}</p>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {message.preview}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-4 italic">
          — Full message thread not shown in this preview.
        </p>
      </div>

      {/* Meta footer */}
      <div className="border-t border-border/60 px-6 py-3 flex items-center gap-3 flex-wrap">
        <span className="text-xs text-muted-foreground font-mono tracking-wider">
          Thread {message.threadId}
        </span>
        <span className="text-xs text-muted-foreground">·</span>
        <span
          className={cn(
            "text-xs",
            message.read
              ? "text-[color:var(--success)]"
              : "text-[color:oklch(0.52_0.17_290)]"
          )}
        >
          {message.read ? "Read" : "Unread"}
        </span>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MessagingPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | MessageRole>("all");
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    messages[0]?.id ?? null
  );

  const displayed = useMemo(() => {
    const q = search.toLowerCase();
    return messages.filter((m) => {
      const matchesRole = roleFilter === "all" || m.fromRole === roleFilter;
      const matchesRead =
        readFilter === "all" ||
        (readFilter === "read" && m.read) ||
        (readFilter === "unread" && !m.read);
      const matchesSearch =
        q === "" ||
        m.fromName.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.preview.toLowerCase().includes(q);
      return matchesRole && matchesRead && matchesSearch;
    });
  }, [search, roleFilter, readFilter]);

  const selectedMessage = messages.find((m) => m.id === selectedId) ?? null;
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="p-[var(--content-padding,1.5rem)] space-y-6">
      {/* Page header */}
      <div className="border-l-4 border-[color:oklch(0.52_0.17_290)] pl-4">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[color:oklch(0.52_0.17_290)]" />
              Messaging
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Buyer-seller communications, support threads, and admin notices.
            </p>
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-[color:oklch(0.52_0.17_290)] bg-[color:oklch(0.52_0.17_290)]/10 px-3 py-1.5 rounded-full">
              <Circle className="w-2 h-2 fill-current" />
              {unreadCount} unread
            </div>
          )}
        </div>
      </div>

      {/* Split panel: list + detail */}
      <div className="border border-border rounded-[var(--radius)] overflow-hidden" style={{ minHeight: "520px" }}>
        <div className="flex h-full" style={{ minHeight: "inherit" }}>
          {/* Left: thread list */}
          <div className="w-full md:w-[360px] md:max-w-[360px] shrink-0 border-r border-border/60 flex flex-col">
            {/* List filters */}
            <div className="p-3 border-b border-border/60 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search threads…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={roleFilter}
                  onValueChange={(v) => setRoleFilter(v as typeof roleFilter)}
                >
                  <SelectTrigger className="flex-1 h-7 text-xs">
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={readFilter}
                  onValueChange={(v) => setReadFilter(v as typeof readFilter)}
                >
                  <SelectTrigger className="flex-1 h-7 text-xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground px-1">
                {displayed.length} {displayed.length === 1 ? "thread" : "threads"}
              </p>
            </div>

            {/* Thread list */}
            <div className="flex-1 overflow-y-auto">
              {displayed.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
                  No threads match this filter.
                </div>
              ) : (
                displayed.map((msg) => (
                  <MessageRow
                    key={msg.id}
                    message={msg}
                    selected={selectedId === msg.id}
                    onSelect={() => setSelectedId(msg.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right: detail pane */}
          <div className="flex-1 hidden md:block">
            {selectedMessage ? (
              <MessageDetail message={selectedMessage} />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                Select a thread to read
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
