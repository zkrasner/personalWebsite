"use client";

import { useState } from "react";
import type { Job } from "@/data/resume";
import RoleContent from "@/components/RoleContent";
import RoleDropdown from "@/components/RoleDropdown";

export default function TimelineItem({ job }: { job: Job }) {
  const [activeRole, setActiveRole] = useState(job.roles[0].key);

  return (
    <div className="timeline-dot">
      {/* Desktop: two rows (name/location, desc/dates) */}
      <div className="max-md:hidden">
        <div className="flex justify-between items-baseline gap-2">
          <h3 className="font-heading text-[1.4rem] font-bold">
            {job.company}
          </h3>
          <span className="text-[0.8rem] text-muted font-medium">
            {job.location}
          </span>
        </div>
        <div className="flex justify-between items-baseline gap-2">
          <p className="text-[0.82rem] text-muted italic">{job.description}</p>
          <span className="text-[0.75rem] text-muted">{job.overallDates}</span>
        </div>
      </div>
      {/* Mobile: name left, location/dates stacked right, desc below */}
      <div className="hidden max-md:block">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-heading text-[1.2rem] font-bold">
            {job.company}
          </h3>
          <div className="text-right shrink-0">
            <div className="text-[0.7rem] text-muted font-medium">
              {job.location}
            </div>
            <div className="text-[0.68rem] text-muted">{job.overallDates}</div>
          </div>
        </div>
        <p className="text-[0.82rem] text-muted italic">{job.description}</p>
      </div>
      <div className="mb-3" />

      {/* Desktop tabs */}
      <div className="flex gap-4 flex-wrap mb-5 max-md:hidden">
        {job.roles.map((role) => (
          <div key={role.key} className="relative">
            <button
              onClick={() => setActiveRole(role.key)}
              className={`relative z-2 text-[0.78rem] font-semibold px-3.5 py-1.5 rounded-card border-[1.5px] cursor-pointer transition-all duration-200 tracking-[0.02em] focus-ring ${
                activeRole === role.key
                  ? "bg-warm border-ink text-ink card-hover"
                  : "border-rule bg-transparent text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {role.title}
              <span className="block font-normal text-[0.68rem] mt-0.5 opacity-70">
                {role.dates}
              </span>
            </button>
            <div
              className={`absolute -bottom-1.5 -left-1.5 w-full h-full border-[1.5px] border-accent rounded-card z-1 transition-opacity duration-200 ${activeRole === role.key ? "opacity-100" : "opacity-0"}`}
            />
          </div>
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
