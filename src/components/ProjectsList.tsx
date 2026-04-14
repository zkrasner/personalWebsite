"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Project } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import ToggleButton from "@/components/ToggleButton";

type TypeFilter = "all" | "work" | "side";

function projectYears(project: Project): number[] {
  const start = Number(project.startDate.split("-")[0]);
  const end = project.endDate
    ? Number(project.endDate.split("-")[0])
    : new Date().getFullYear();
  const years: number[] = [];
  for (let y = start; y <= end; y++) years.push(y);
  return years;
}

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawType = searchParams.get("type") ?? "all";
  const type: TypeFilter =
    rawType === "work" || rawType === "side" ? rawType : "all";
  const year = searchParams.get("year") ?? "all";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    for (const p of projects) {
      for (const y of projectYears(p)) years.add(y);
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [projects]);

  const filtered = useMemo(() => {
    return projects
      .filter((p) => type === "all" || p.type === type)
      .filter((p) => year === "all" || projectYears(p).includes(Number(year)))
      .sort((a, b) => b.startDate.localeCompare(a.startDate));
  }, [projects, type, year]);

  const isFiltered = type !== "all" || year !== "all";
  const reset = () => {
    router.replace(pathname, { scroll: false });
  };

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-4">
        {/* Type toggle */}
        <div className="flex flex-wrap gap-4">
          {(["all", "work", "side"] as TypeFilter[]).map((t) => (
            <ToggleButton
              key={t}
              active={type === t}
              onClick={() => updateParam("type", t)}
              className="text-xs font-semibold uppercase"
            >
              {t}
            </ToggleButton>
          ))}
        </div>

        {/* Year dropdown */}
        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
          Year
          <select
            value={year}
            onChange={(e) => updateParam("year", e.target.value)}
            className="px-2 py-2 min-h-[44px] bg-warm border border-rule rounded-card text-xs font-medium text-ink cursor-pointer focus-ring"
          >
            <option value="all">All</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        {isFiltered && (
          <button
            onClick={reset}
            className="text-xs font-semibold text-accent cursor-pointer hover:underline focus-ring rounded-sm min-h-[44px]"
          >
            Reset
          </button>
        )}
      </div>

      <div aria-live="polite">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted italic">
            No projects match these filters.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
