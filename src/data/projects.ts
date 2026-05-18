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
import { applesandbananai } from "./projects/applesandbananai";
import { moosehead } from "./projects/moosehead";
import { algo } from "./projects/algo";
import { kalshi } from "./projects/kalshi";
import { shoregrounds } from "./projects/shoregrounds";

export const projects: Project[] = [
  applesandbananai,
  moosehead,
  algo,
  kalshi,
  shoregrounds,
];
