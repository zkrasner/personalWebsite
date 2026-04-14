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
import { algo } from "./projects/algo";
import { shoregrounds } from "./projects/shoregrounds";

export const projects: Project[] = [moosehead, algo, shoregrounds];
