import type { Project } from "./types";

export const moosehead: Project = {
  slug: "moosehead",
  title: "Moosehead",
  tagline:
    "Internal querying platform replacing Stata + Dropbox for analyst data extraction",
  description:
    "The first initiative I started at Grassroots Analytics. Replaced a single-process, single-user Stata workflow over Dropbox-hosted data with a secure cloud-based querying platform. Brought single query times from 15 minutes to 15 seconds and is still used thousands of times per day.",

  type: "work",
  status: "live",
  startDate: "2022-08",

  company: "grassroots",
  role: "Team Lead & Implementer",
  teamSize: 4,

  tech: {
    frontend: ["Vue", "JavaScript", "PrimeVue"],
    backend: ["Python", "Flask"],
    data: ["BigQuery", "Firestore", "Cloud Storage"],
    infrastructure: [
      "GCP",
      "Cloud Run",
      "Cloud Functions",
      "Firebase Hosting",
      "Firebase Auth",
      "Firebase Analytics",
      "Secret Manager",
      "Artifact Registry",
    ],
    testing: ["Playwright", "pytest"],
    other: ["Docker", "GitHub Actions"],
  },

  problem: [
    "Analysts at Grassroots used Stata as their primary data extraction tool, pulling from CSV, JSON, and XML files on Dropbox.",
    "Dropbox synced to every analyst laptop, so posed a security risk.",
    "Stata runs a single process at a time, so each query took 10 to 15 minutes. Analysts often needed several iterations before a client ask was correctly filtered, turning a morning request into a multi-hour afternoon scramble.",
    "New analysts took roughly a month before they could be trusted to write production queries, and query quality and workflow varied wildly with each analyst, producing inconsistent client deliverables.",
    "The existing tech was the bottleneck preventing Grassroots from continuing to scale.",
  ],

  approach: [
    "Moved all analyst data to the cloud, pulled Dropbox access, and tied data access to individual identities with real enforcement mechanisms instead of implicit trust.",
    "Built a querying UI on top of our output schema so analysts could generate SQL through the portal instead of writing Stata code. Rolled it out iteratively, covering the 80 to 90 percent of common client asks first, then chipping away at complex cases.",
    "Added client hierarchy and tenants, per-query permissions, shared query history, rerunnable queries, and a secure file exchange for client deliverables and source material.",
    "Chose Vue, GCP, and BigQuery because that matched the existing team's skills. Rather than slow everyone down teaching them a new stack, I learned Vue and GCP myself and led the team in what they already knew.",
    "On the backend, much of my hands-on work was translating a Pydantic model of the output schema into valid, optimized BigQuery SQL.",
  ],

  outcomes: [
    "End-to-end client deliverable cycles went from hours to single-digit minutes.",
    "Client continuity no longer depends on email threads and manual Google Sheets. Assignments, history, and outputs live in the system and are shared across the analyst team.",
    "Eliminated local data exposure by moving to identity-based access controls. No analyst laptop holds a copy of the dataset.",
    "Unlocked company growth from ~$5M to more than $30M in ARR.",
  ],

  metrics: [
    { label: "Query time", before: "15 min", after: "< 15 sec" },
    { label: "Deliverable cycle", before: "hours", after: "minutes" },
    { label: "Weekly requests", value: "10,000+" },
    { label: "Analyst time saved", value: "100s of hrs/week" },
  ],
};
