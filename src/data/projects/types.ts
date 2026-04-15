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
  // Convention: /projects/{slug}.png — manual 1280×720 (16:9) screenshot
  coverImage?: string;
  // Convention: /projects/{slug}-architecture.svg — system design diagram
  systemDesign?: string;
  links?: ProjectLink[];

  problem?: string[];
  approach?: string[];
  outcomes?: string[];
  metrics?: ProjectMetric[];
  sections?: ProjectSection[];
}
