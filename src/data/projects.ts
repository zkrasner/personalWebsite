export type {
  Project,
  ProjectType,
  ProjectStatus,
  ProjectLink,
  ProjectSection,
  ProjectMetric,
  ProjectTech,
} from "./projects/types";

import type { Project } from "./projects/types";
import { moosehead } from "./projects/moosehead";
import { shoregrounds } from "./projects/shoregrounds";

export const projects: Project[] = [moosehead, shoregrounds];
