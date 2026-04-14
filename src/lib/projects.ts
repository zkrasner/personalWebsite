import type { Project } from "@/data/projects";

export function findLiveLink(project: Project) {
  return project.links?.find((l) => l.label.toLowerCase().includes("live"));
}

export function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
