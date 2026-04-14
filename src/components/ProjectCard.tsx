import Link from "next/link";
import type { Project } from "@/data/projects";
import AccentOutline from "@/components/AccentOutline";
import Chip from "@/components/Chip";
import ProjectImage from "@/components/ProjectImage";
import { formatDateRange } from "@/lib/dates";
import { findLiveLink, stripProtocol } from "@/lib/projects";

function flattenTech(tech: Project["tech"]): string[] {
  return [
    ...(tech.frontend ?? []),
    ...(tech.backend ?? []),
    ...(tech.data ?? []),
    ...(tech.infrastructure ?? []),
    ...(tech.testing ?? []),
    ...(tech.other ?? []),
  ];
}

export default function ProjectCard({ project }: { project: Project }) {
  const techStack = flattenTech(project.tech);
  const typeBadge = project.type === "work" ? "Work" : "Side";
  const liveLink = findLiveLink(project);

  return (
    <AccentOutline size="md" variant="filled">
      <div className="relative z-2 p-6 bg-warm rounded-card border border-ink card-hover h-full group">
        {/* Ghost Link covering the card */}
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`View ${project.title} project details`}
          className="absolute inset-0 z-1 rounded-card focus-ring"
        />

        <div className="relative z-2 pointer-events-none flex flex-col sm:flex-row gap-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-x-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-[0.1em] text-accent">
                {typeBadge}
              </span>
              <span className="text-xs text-muted">·</span>
              <span className="text-xs text-muted">
                {formatDateRange(project.startDate, project.endDate)}
              </span>
              {liveLink && (
                <>
                  <span className="text-xs text-muted">·</span>
                  <a
                    href={liveLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-accent no-underline hover:underline pointer-events-auto relative z-3"
                  >
                    {stripProtocol(liveLink.url)} ↗
                  </a>
                </>
              )}
            </div>
            <h3 className="font-heading font-bold text-xl mb-1.5">
              {project.title}
            </h3>
            <p className="font-heading italic text-md text-muted mb-3">
              {project.tagline}
            </p>
            <p className="text-sm text-body leading-relaxed mb-4 max-w-[720px]">
              {project.description}
            </p>
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {techStack.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            )}
          </div>

          {project.coverImage && (
            <div className="sm:w-[280px] shrink-0 order-first sm:order-last">
              <ProjectImage
                src={project.coverImage}
                alt={`${project.title} screenshot`}
              />
            </div>
          )}
        </div>

        <span
          aria-hidden="true"
          className="absolute bottom-3 right-4 text-accent text-base opacity-60 transition-opacity duration-200 group-hover:opacity-100 z-2"
        >
          &rarr;
        </span>
      </div>
    </AccentOutline>
  );
}
