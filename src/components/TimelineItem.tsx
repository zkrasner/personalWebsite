"use client";

import { useState } from "react";
import type { Job } from "@/data/resume";
import RoleContent from "@/components/RoleContent";
import RoleDropdown from "@/components/RoleDropdown";
import RoleLabel from "@/components/RoleLabel";
import ToggleButton from "@/components/ToggleButton";

export default function TimelineItem({ job }: { job: Job }) {
  const [activeRole, setActiveRole] = useState(job.roles[0].key);

  return (
    <div className="timeline-dot">
      {/* Desktop: two rows (name/location, desc/dates) */}
      <div className="max-md:hidden">
        <div className="flex justify-between items-baseline gap-2">
          <h3 className="font-heading text-xl font-bold">{job.company}</h3>
          <span className="text-sm text-muted font-medium">{job.location}</span>
        </div>
        <div className="flex justify-between items-baseline gap-2">
          <p className="text-sm text-muted italic">{job.description}</p>
          <span className="text-sm text-muted">{job.overallDates}</span>
        </div>
      </div>
      {/* Mobile: name left, location/dates stacked right, desc below */}
      <div className="hidden max-md:block">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-heading text-lg font-bold">{job.company}</h3>
          <div className="text-right shrink-0">
            <div className="text-xs text-muted font-medium">{job.location}</div>
            <div className="text-xs text-muted">{job.overallDates}</div>
          </div>
        </div>
        <p className="text-sm text-muted italic">{job.description}</p>
      </div>
      <div className="mb-3" />

      {/* Desktop tabs */}
      <div className="flex gap-4 flex-wrap mb-5 max-md:hidden">
        {job.roles.map((role) => (
          <ToggleButton
            key={role.key}
            active={activeRole === role.key}
            onClick={() => setActiveRole(role.key)}
          >
            <RoleLabel title={role.title} dates={role.dates} />
          </ToggleButton>
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
