import type { ProjectMetric } from "@/data/projects";
import AccentOutline from "@/components/AccentOutline";

function isBeforeAfter(
  m: ProjectMetric,
): m is { label: string; before: string; after: string } {
  return "before" in m;
}

export default function MetricCard({ metric }: { metric: ProjectMetric }) {
  return (
    <AccentOutline size="sm" variant="filled" className="h-full">
      <div
        className="relative z-2 p-5 bg-warm rounded-card border-3 border-ink h-full"
        role="group"
        aria-label={metric.label}
      >
        <div className="text-xs font-bold uppercase tracking-[0.1em] text-accent mb-2">
          {metric.label}
        </div>
        {isBeforeAfter(metric) ? (
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xs sm:text-sm text-muted">
              {metric.before}
            </span>
            <span className="text-accent font-bold" aria-hidden="true">
              &rarr;
            </span>
            <span className="font-heading font-black text-md sm:text-lg text-ink">
              {metric.after}
            </span>
          </div>
        ) : (
          <div className="font-heading font-black text-md sm:text-lg text-ink">
            {metric.value}
          </div>
        )}
      </div>
    </AccentOutline>
  );
}
