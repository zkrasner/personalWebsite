export type ProjectType = "work" | "side";
export type ProjectStatus = "wip" | "live" | "archived";

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectSection {
  heading: string;
  body: string;
}

export type ProjectMetric =
  | { label: string; value: string }
  | { label: string; before: string; after: string };

export interface ProjectTech {
  frontend?: string[];
  backend?: string[];
  data?: string[];
  infrastructure?: string[];
  testing?: string[];
  other?: string[];
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;

  type: ProjectType;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;

  company?: string;
  role?: string;
  teamSize?: number;

  tech: ProjectTech;
  coverImage?: string;
  links?: ProjectLink[];

  problem?: string[];
  approach?: string[];
  outcomes?: string[];
  metrics?: ProjectMetric[];
  sections?: ProjectSection[];
}

// Curated filter list for the /projects page tech dropdown.
// Keep this focused. Not every tech a project uses should be here.
export const TECH_FILTERS = [
  "Python",
  "TypeScript",
  "JavaScript",
  "React",
  "Vue",
  "GCP",
  "Firebase",
  "BigQuery",
  "Mapbox",
] as const;

export type TechFilter = (typeof TECH_FILTERS)[number];

export const projects: Project[] = [
  {
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
      "Dropbox synced to every analyst laptop, so the entire dataset could walk out the door on a single machine.",
      "Stata runs a single process at a time, so each query took 10 to 15 minutes. Analysts often needed several iterations before a client ask was correctly filtered, turning a morning request into a multi-hour afternoon scramble.",
      "New analysts took roughly a month before they could be trusted to write production queries, and query quality was bespoke to each analyst, producing inconsistent client deliverables.",
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
      "Single query time dropped from 15 minutes to under 15 seconds.",
      "End-to-end client deliverable cycles went from hours to single-digit minutes.",
      "Hundreds of analyst-hours saved per week.",
      "Still actively used, with thousands of queries per day, roughly 10,000 requests per week, and hundreds of client data exports.",
      "Client continuity no longer depends on email threads and manual Google Sheets. Assignments, history, and outputs live in the system and are shared across the analyst team.",
    ],

    metrics: [
      { label: "Query time", before: "15 min", after: "< 15 sec" },
      { label: "Deliverable cycle", before: "hours", after: "minutes" },
      { label: "Weekly requests", value: "~10,000" },
      { label: "Analyst time saved", value: "100s of hrs/week" },
    ],

    links: [],
  },

  {
    slug: "shoregrounds",
    title: "ShoreGrounds",
    tagline:
      "A map of independent coffee shops and roasters on Boston's North Shore",
    description:
      "A personal side project born from weekend coffee trips with my wife and newborn son. A single-page map that surfaces independent coffee shops, roasters, and bean sources on the North Shore of Boston, intended to help others support local over big coffee.",

    type: "side",
    status: "live",
    startDate: "2026-01",

    role: "Solo",
    teamSize: 1,

    tech: {
      frontend: ["React", "TypeScript", "Vite", "Mapbox GL"],
      infrastructure: ["Firebase Hosting", "Firebase Analytics"],
      testing: ["Vitest"],
      other: ["GitHub Actions"],
    },

    problem: [
      "My wife and I wanted to stop buying Keurig cups, cut back on plastic waste, and support more local businesses. We also had a newborn son and needed low-effort reasons to get out of the house during the winter.",
      "Good independent coffee shops on the North Shore of Boston are scattered and hard to discover. There was no single place to see them all, let alone find which ones sold beans, had good reviews, or were worth a weekend drive.",
    ],

    approach: [
      "Built a single-page map showing every independent coffee shop between Boston and the New Hampshire border. Each pin surfaces shop details, social links, and direct Google Maps directions.",
      "Sourced shop data (ratings, addresses, hours, coordinates) using the Google Places API during development, then hard-coded the results in the frontend for fast load times, since the shop list rarely changes.",
      "Kept the runtime stack intentionally minimal: Vite and React, no SSR or routing. Chose Mapbox over Google Maps because it allows much richer map styling.",
      "Hosted on Firebase so I could stand it up fast and iterate on my own time.",
    ],

    outcomes: [
      "First iteration shipped and live at shoregrounds.com.",
      "My wife and I use it ourselves every weekend to find new shops to visit and beans to try at home.",
    ],

    sections: [
      {
        heading: "What's next",
        body: "Longer term I'd like to grow this into a small community: a newsletter, partnerships with local roasters for giveaways or a monthly bean club, and an AI chatbot that asks about flavor preferences and recommends a local roaster and specific bean to match.",
      },
    ],

    links: [{ label: "Live site", url: "https://shoregrounds.com" }],
  },
];
