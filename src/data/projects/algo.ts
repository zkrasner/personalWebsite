import type { Project } from "./types";

export const algo: Project = {
  slug: "algo",
  title: "Algo",
  tagline:
    "Data pipeline processing hundreds of millions of donation records into unified donor profiles",
  description:
    "The core data product at Grassroots Analytics. Replaced a legacy Stata-on-desktop process that took 2-3 weeks per run with an Airflow-orchestrated cloud pipeline delivering incremental updates throughout the day and nightly batch analytics across 40M+ donor profiles.",

  type: "work",
  status: "live",
  startDate: "2021-01",

  company: "grassroots",
  role: "Architect & Lead",
  teamSize: 8,

  tech: {
    backend: ["Python", "Apache Airflow"],
    data: ["BigQuery", "DuckDB", "Cloud Storage", "Pub/Sub"],
    infrastructure: ["GCP", "Cloud Composer", "Cloud Functions", "Terraform"],
    testing: ["pytest", "syrupy", "sqlglot"],
    other: ["Docker", "GitHub Actions"],
  },

  problem: [
    "The existing analytics process was a chain of Stata scripts running on a single Mac desktop tower in the office. A full run took 2-3 weeks.",
    "There was no change management. The data science team was improving analytics while the process was running, causing frequent breakages and restarts.",
    "Observability was almost nonexistent. Reviewing intermediate data outputs required manual inspection, and failures were discovered late.",
    "Donation data was scattered across incompatible sources: state databases, ActBlue, email platforms, SMS systems, and manual CSV imports, with no automated ingestion.",
    "The same donor could appear under different names, addresses, and formats across sources with no shared identifier, leading to unreliable totals and duplicate profiles.",
  ],

  approach: [
    "Identified the scope of the migration early as a board advisor, then transitioned to CTO to lead the effort full-time with a dedicated engineering team.",
    "Performed open heart surgery on a moving target: pushed data to the cloud first to support the Moosehead project, then worked inward from both ends, automating data ingestion upstream and replacing processing branches with Airflow DAGs and BigQuery SQL downstream.",
    "Maintained business continuity throughout. The legacy Stata process ran in parallel for ~3 months after the new system reached feature parity, validating data outputs before a hard cutover.",
    "Built a custom TaskGraph abstraction that decouples business logic from Airflow infrastructure, making SQL and Python tasks independently testable.",
    "Automated connections to database replication instances and APIs to eliminate manual exports, reducing the number of manual data sinks required.",
    "After the migration, invested heavily in identity resolution: better heuristics, fuzzy matching, and manual curation layers to significantly reduce profile duplication and improve data quality.",
  ],

  outcomes: [
    "Replaced a 2-3 week batch process with incremental daily ingestion and nightly analytics runs.",
    "Initial build took ~15 months with a team that grew from 1 to 4 engineers plus 4 data scientists.",
    "Processes 40M+ donor profiles into a unified warehouse via 200+ orchestrated pipeline tasks.",
    "Powers all downstream analytics, reporting, and client deliverables at Grassroots.",
    "Transformed data quality from opaque and error-prone to auditable: automated schema validation, snapshot testing, and Google Chat alerting replaced manual data inspection that previously required pausing the entire pipeline.",
    "Enabled the company to scale from serving a handful of clients to a full enterprise sales motion.",
  ],

  metrics: [
    { label: "Process time", before: "2+ weeks", after: "< 10 min" },
    { label: "Donor profiles", before: "25M", after: "40M+" },
    { label: "Pipeline tasks", value: "200+" },
    { label: "Attributes per profile", value: "600+" },
  ],
};
