"use client";

import { useState } from "react";
import type { Job } from "@/data/resume";
import RoleContent from "@/components/RoleContent";
import RoleDropdown from "@/components/RoleDropdown";

export default function TimelineItem({ job }: { job: Job }) {
  const [activeRole, setActiveRole] = useState(job.roles[0].key);

  return (
    <div className="timeline-dot">
      <div className="flex justify-between items-baseline flex-wrap gap-2">
        <h3 className="font-heading text-[1.4rem] font-bold">{job.company}</h3>
        <span className="text-[0.8rem] text-muted font-medium">
          {job.location}
        </span>
      </div>
      <div className="flex justify-between items-baseline flex-wrap gap-2">
        <p className="text-[0.82rem] text-muted italic">{job.description}</p>
        <span className="text-[0.75rem] text-muted">{job.overallDates}</span>
      </div>
      <div className="mb-3" />

      {/* Desktop tabs */}
      <div className="flex gap-2 flex-wrap mb-5 max-md:hidden">
        {job.roles.map((role) => (
          <button
            key={role.key}
            onClick={() => setActiveRole(role.key)}
            className={`text-[0.78rem] font-semibold px-3.5 py-1.5 rounded-card border-[1.5px] border-l-4 cursor-pointer transition-all duration-200 tracking-[0.02em] focus-ring ${
              activeRole === role.key
                ? "bg-warm border-rule border-l-accent text-ink"
                : "border-rule border-l-rule bg-transparent text-muted hover:border-l-accent hover:text-accent"
            }`}
          >
            {role.title}
            <span className="block font-normal text-[0.68rem] mt-0.5 opacity-70">
              {role.dates}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile dropdown */}
      <RoleDropdown
        roles={job.roles}
        activeRole={activeRole}
        onSelect={setActiveRole}
      />

      {job.roles.map((role) =>
        activeRole === role.key ? (
          <RoleContent key={role.key} role={role} />
        ) : null,
      )}
    </div>
  );
}
