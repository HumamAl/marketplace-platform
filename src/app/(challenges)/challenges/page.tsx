import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { executiveSummary, challenges } from "@/data/challenges";
import { OutcomeBadge } from "@/components/challenges/outcome-badge";
import { VizBeforeAfter } from "@/components/challenges/viz-before-after";
import { VizRbacFlow } from "@/components/challenges/viz-rbac-flow";
import { VizArchitecture } from "@/components/challenges/viz-architecture";
import { VizListingTypes } from "@/components/challenges/viz-listing-types";

export default function ChallengesPage() {
  const c0 = challenges.find((c) => c.id === "frontend-restructure")!;
  const c1 = challenges.find((c) => c.id === "rbac")!;
  const c2 = challenges.find((c) => c.id === "modular-monolith")!;
  const c3 = challenges.find((c) => c.id === "listing-types")!;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>

      {/* ── Executive Summary — dark panel ───────────────────── */}
      <div
        className="px-6 py-12 sm:px-12"
        style={{ backgroundColor: "oklch(0.10 0.02 var(--primary-h))" }}
      >
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 mb-8 font-mono"
            style={{ transition: "color var(--dur-fast) var(--ease-snappy)" }}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to the live demo
          </Link>

          <p className="text-xs font-mono text-primary/60 uppercase tracking-widest mb-3">
            My Approach
          </p>

          <h1
            className="text-3xl font-bold text-white/95 mb-6"
            style={{ letterSpacing: "-0.025em" }}
          >
            Building for Scale
          </h1>

          <div
            className="w-10 h-px mb-6"
            style={{ backgroundColor: "color-mix(in oklch, var(--primary) 45%, transparent)" }}
          />

          <p className="text-sm text-white/45 leading-relaxed mb-3">
            {executiveSummary.commonApproach}
          </p>
          <p className="text-sm text-white/80 leading-relaxed">
            I design the module boundaries, permission layers, and schema flexibility{" "}
            <span className="text-primary font-semibold">{executiveSummary.accentPhrase}</span>
            {" "}— so Phase 1 ships clean and Phase 2 doesn&apos;t require a rewrite.
          </p>
        </div>
      </div>

      {/* ── Challenge sections ───────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 py-16 space-y-20">

        {/* 01 — Frontend Restructure — Primary, text left / viz right */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <span className="text-6xl font-extralight text-primary/12 block mb-4 leading-none select-none">
              {c0.number}
            </span>
            <h2 className="text-xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>
              {c0.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {c0.description}
            </p>
            <OutcomeBadge text={c0.outcome} />
          </div>
          <div
            className="rounded-lg p-5"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--card)",
            }}
          >
            <VizBeforeAfter />
          </div>
        </section>

        <div className="border-t border-border/40" />

        {/* 02 — RBAC — Standard, viz left / text right (alternating) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div
            className="rounded-lg p-5 order-2 lg:order-1"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--card)",
            }}
          >
            <VizRbacFlow />
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-6xl font-extralight text-primary/12 block mb-4 leading-none select-none">
              {c1.number}
            </span>
            <h2 className="text-xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>
              {c1.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {c1.description}
            </p>
            <OutcomeBadge text={c1.outcome} />
          </div>
        </section>

        {/* 03 — Modular Monolith — Primary, tinted section, text left / viz right */}
        <section
          className="-mx-6 sm:-mx-12 px-6 sm:px-12 py-14 rounded-xl"
          style={{
            backgroundColor: "color-mix(in oklch, var(--primary) 4%, transparent)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <span className="text-6xl font-extralight text-primary/12 block mb-4 leading-none select-none">
                {c2.number}
              </span>
              <h2 className="text-xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>
                {c2.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {c2.description}
              </p>
              <OutcomeBadge text={c2.outcome} />
            </div>
            <div
              className="rounded-lg p-5"
              style={{
                border: "1px solid color-mix(in oklch, var(--primary) 18%, transparent)",
                backgroundColor: "var(--card)",
              }}
            >
              <VizArchitecture />
            </div>
          </div>
        </section>

        {/* 04 — Listing Types — Supporting, compact single column */}
        <section className="space-y-5">
          <div className="flex items-start gap-5">
            <span className="text-6xl font-extralight text-primary/12 leading-none select-none shrink-0">
              {c3.number}
            </span>
            <div>
              <h2 className="text-xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>
                {c3.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {c3.description}
              </p>
            </div>
          </div>
          <div
            className="rounded-lg p-5"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--card)",
            }}
          >
            <VizListingTypes />
          </div>
          <OutcomeBadge text={c3.outcome} />
        </section>

        {/* ── CTA Closer ───────────────────────────────────────── */}
        <div className="border-t border-border/40 pt-10 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            These aren&apos;t hypotheticals — they&apos;re the actual problems I&apos;d tackle on day one.
          </p>
          <div className="flex items-center justify-center flex-wrap gap-4">
            <Link
              href="/proposal"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
              style={{ transition: "color var(--dur-fast) var(--ease-snappy)" }}
            >
              See how I work
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <span className="text-xs text-border">|</span>
            <span className="text-xs text-muted-foreground">
              Or reply on Upwork to start a conversation
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
