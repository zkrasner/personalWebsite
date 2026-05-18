import type { Project } from "./types";

export const applesandbananai: Project = {
  slug: "applesandbananai",
  title: "Applesandbanan.ai",
  tagline:
    "Private AI parenting assistant for couples that tracks baby facts, open questions, and decisions across conversations",
  description:
    "A shared AI companion for new parents. Each family has its own private workspace where the assistant has long-running memory of the baby's facts, the open questions the parents are working through, and the decisions they've made together, so either parent can pick up a conversation in sync with the other.",

  type: "side",
  status: "live",
  startDate: "2026-05",

  role: "Solo",
  teamSize: 1,

  tech: {
    frontend: ["React", "Vite", "TypeScript", "Tailwind", "TanStack Query"],
    backend: ["Python", "FastAPI", "SQLAlchemy", "Alembic"],
    data: ["SQLite"],
    infrastructure: [
      "GCP",
      "GCE",
      "Docker Compose",
      "Caddy",
      "Terraform",
      "Secret Manager",
      "Artifact Registry",
      "Cloud Logging",
    ],
    testing: ["pytest", "vitest"],
    other: [
      "Anthropic API",
      "Resend",
      "GitHub Actions",
      "Workload Identity Federation",
    ],
  },

  problem: [
    "New parents are sleep-deprived information processors. Pediatrician advice, sleep patterns, feeding amounts, and one-off observations arrive faster than they can be retained, and most of it lives in one parent's head while the other is asleep.",
    "Generic chat assistants forget everything between sessions, so each conversation starts from zero: name, age, history, prior decisions all have to be re-explained.",
    "Existing parenting apps are tracking-first (log a feed, log a nap) and don't actually help the couple think through the open questions they're working on together.",
    "Couples fall out of sync, hearing different doctors and trying different things, without a shared place that remembers what 'we' have decided.",
  ],

  approach: [
    "Built a family-scoped workspace where both parents share a single AI context: baby profile, accumulated facts, open questions, and prior decisions persist across every conversation.",
    "Designed an explicit memory model with three kinds of records: facts (e.g. 'sleeps in a Halo swaddle'), open questions ('starting solids next month?'), and decisions ('cardiology follow-up at 6 months'). The assistant's recall is structured rather than vibes-based.",
    "Single-tenant-per-family architecture: each family's data is private, with auth-gated access and granular write permissions for partner accounts.",
    "Shipped on a deliberately boring stack (one GCE VM, Docker Compose, SQLite on a persistent disk, Caddy for TLS), sized for family-scale rather than a SaaS pitch deck.",
    "Operational maturity baked in: Terraform-managed infra, nightly SQLite-to-GCS backups, Workload Identity Federation for keyless CI, structured JSON logs into Cloud Logging, Resend transactional email.",
    "Zero-touch deploys: push to 'main' ships build, DB migration, and container restart in under five minutes.",
  ],

  outcomes: [
    "Running in production with a family using it daily.",
    "AI conversations stay in sync between partners, with no 're-explaining the baby' each session.",
    "Single-VM topology keeps monthly cost under the GCP free tier while still supporting structured logging, monitoring, and nightly backups.",
  ],
};
