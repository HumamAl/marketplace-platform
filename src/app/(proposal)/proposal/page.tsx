import { APP_CONFIG } from "@/lib/config";
import { profile, portfolioProjects } from "@/data/proposal";
import { SkillsGrid } from "@/components/proposal/skills-grid";
import { TimelineSection } from "@/components/proposal/timeline-section";
import { TrendingUp, ArrowLeft } from "lucide-react";
import Link from "next/link";

// ── Stat component ──────────────────────────────────────────────────────────

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-2xl font-bold font-mono text-white leading-none">
        {value}
      </span>
      <span className="text-xs text-white/50 uppercase tracking-widest font-mono">
        {label}
      </span>
    </div>
  );
}

// ── Section label ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
      {children}
    </p>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function ProposalPage() {
  const projectName = APP_CONFIG.clientName ?? APP_CONFIG.projectName;

  const timelinePhases = profile.approach.map((step, i) => {
    const timelines = ["Day 1–2", "Week 1", "Week 2–6", "Week 7–8"];
    const statuses: Array<"completed" | "active" | "upcoming"> = [
      "completed",
      "active",
      "upcoming",
      "upcoming",
    ];
    return {
      title: step.title,
      description: step.description,
      duration: timelines[i] ?? "TBD",
      status: statuses[i] ?? "upcoming",
    };
  });

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero: Asymmetric Split ────────────────────────────────────────── */}
      <div
        className="w-full"
        style={{ background: "oklch(0.10 0.02 var(--primary-h))" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">

          {/* Left: main content */}
          <div className="space-y-5">
            {/* Pulsing badge */}
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 border border-white/10 text-white/80 px-3 py-1 rounded-full">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              Built this demo for your project
            </span>

            <div>
              <p className="text-sm font-mono text-white/40 uppercase tracking-widest mb-1">
                Hi, I&apos;m
              </p>
              <h1 className="text-4xl font-bold text-white leading-tight">
                {profile.name}
              </h1>
            </div>

            <p className="text-base text-white/70 leading-relaxed max-w-lg">
              {profile.tagline}
            </p>
          </div>

          {/* Right: stats sidebar */}
          <div className="flex flex-row md:flex-col gap-6 md:gap-8 md:border-l md:border-white/10 md:pl-8">
            <StatItem value="24+" label="Projects Shipped" />
            <StatItem value="< 48hr" label="Demo Turnaround" />
            <StatItem value="2–3 wks" label="Typical MVP Start" />
          </div>

        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">

        {/* ── Proof of Work: Stacked Stories ─────────────────────────────── */}
        <section>
          <SectionLabel>Proof of Work</SectionLabel>
          <h2 className="text-xl font-semibold mb-8">
            Relevant projects
          </h2>

          <div className="space-y-6">
            {portfolioProjects.map((project) => (
              <div
                key={project.id}
                className="border border-border/60 bg-card rounded-lg p-5 hover:border-primary/30 transition-colors"
                style={{ transitionDuration: "var(--dur-fast)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{project.title}</h3>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-primary hover:text-primary/70 underline underline-offset-2 transition-colors"
                          style={{ transitionDuration: "var(--dur-fast)" }}
                        >
                          Live demo ↗
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {project.description}
                    </p>
                    {project.relevance && (
                      <p className="text-xs text-primary font-medium mt-2 font-mono">
                        {project.relevance}
                      </p>
                    )}
                  </div>
                </div>

                {project.outcome && (
                  <div className="flex items-start gap-2 mt-4 pt-4 border-t border-border/60">
                    <TrendingUp className="w-3.5 h-3.5 text-[color:var(--success)] mt-0.5 shrink-0" />
                    <p className="text-sm text-[color:var(--success)]">
                      {project.outcome}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-xs rounded-md bg-primary/10 text-primary font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How I Work: Vertical Timeline ──────────────────────────────── */}
        <section>
          <SectionLabel>Process</SectionLabel>
          <h2 className="text-xl font-semibold mb-8">
            How I&apos;d build {projectName}
          </h2>
          <div className="max-w-2xl">
            <TimelineSection phases={timelinePhases} />
          </div>
        </section>

        {/* ── Skills Grid ─────────────────────────────────────────────────── */}
        <section>
          <SectionLabel>Stack</SectionLabel>
          <h2 className="text-xl font-semibold mb-6">
            Relevant tech
          </h2>
          <SkillsGrid categories={profile.skillCategories} />
        </section>

      </div>

      {/* ── CTA: Dark Panel close ────────────────────────────────────────── */}
      <div
        className="w-full mt-4"
        style={{ background: "oklch(0.10 0.02 var(--primary-h))" }}
      >
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-5">

          {/* Availability */}
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)]/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--success)]" />
            </span>
            <span className="text-xs font-mono text-white/50 uppercase tracking-widest">
              Currently available for new projects
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl font-bold text-white max-w-xl leading-snug">
            Ready to turn your platform backend from concept into production-deployed code.
          </h2>

          <p className="text-sm text-white/60 max-w-lg leading-relaxed">
            Your 80% frontend is a real head start. I can pick up the data model, wire the auth layer, and have the first module shipping within two weeks of your reply.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
            <span className="text-sm font-semibold text-primary">
              Reply on Upwork to start
            </span>
            <span className="hidden sm:block text-white/20">·</span>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
              style={{ transitionDuration: "var(--dur-fast)" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to the demo
            </Link>
          </div>

          {/* Signature */}
          <p className="text-sm text-white/30 pt-4 font-mono">— Humam</p>

        </div>
      </div>

    </div>
  );
}
