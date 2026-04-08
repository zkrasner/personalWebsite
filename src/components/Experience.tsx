"use client";

import { useState, useEffect, useRef } from "react";
import { jobs } from "@/data/resume";
import type { Job, Role } from "@/data/resume";

function RoleContent({ role }: { role: Role }) {
  const bulletsBefore = role.products
    ? role.bullets.slice(0, -1)
    : role.bullets;
  const bulletAfter = role.products
    ? role.bullets[role.bullets.length - 1]
    : null;

  return (
    <div>
      <ul className="list-none p-0">
        {bulletsBefore.map((bullet, i) => (
          <li
            key={i}
            className="pl-5 relative mb-3 text-[0.93rem] leading-[1.7] text-body before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-sm before:bg-accent"
          >
            {bullet}
          </li>
        ))}
      </ul>

      {role.products && (
        <div className="grid grid-cols-2 gap-2.5 my-3 ml-5 max-md:grid-cols-1">
          {role.products.map((product) => (
            <div
              key={product.name}
              className="bg-warm rounded-[10px] px-3.5 py-2.5 text-[0.82rem] leading-[1.45] text-body"
            >
              <strong className="block text-ink font-bold text-[0.8rem]">
                {product.name}
              </strong>
              {product.description}
            </div>
          ))}
        </div>
      )}

      {bulletAfter && (
        <ul className="list-none p-0 mt-3">
          <li className="pl-5 relative mb-3 text-[0.93rem] leading-[1.7] text-body before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-sm before:bg-accent">
            {bulletAfter}
          </li>
        </ul>
      )}
    </div>
  );
}

function RoleDropdown({
  roles,
  activeRole,
  onSelect,
}: {
  roles: Role[];
  activeRole: string;
  onSelect: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = roles.find((r) => r.key === activeRole) ?? roles[0];

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  return (
    <div ref={ref} className="relative w-full mb-5 hidden max-md:block">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-3.5 pr-10 py-2 rounded-[10px] border-[1.5px] border-rule border-l-4 border-l-accent bg-warm cursor-pointer relative transition-all duration-200"
      >
        <span className="block text-[0.78rem] font-semibold text-ink">
          {active.title}
        </span>
        <span className="block text-[0.68rem] text-muted mt-0.5">
          {active.dates}
        </span>
        <span
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-paper border-[1.5px] border-rule rounded-[10px] overflow-hidden z-10 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          {roles.map((role) => (
            <div
              key={role.key}
              onClick={() => {
                onSelect(role.key);
                setOpen(false);
              }}
              className={`px-3.5 py-2 cursor-pointer border-b border-rule last:border-b-0 transition-colors duration-150 hover:bg-warm ${
                role.key === activeRole ? "bg-accent-light" : ""
              }`}
            >
              <span className="block text-[0.78rem] font-semibold text-ink">
                {role.title}
              </span>
              <span className="block text-[0.68rem] text-muted mt-0.5">
                {role.dates}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TimelineItem({ job }: { job: Job }) {
  const [activeRole, setActiveRole] = useState(job.roles[0].key);

  return (
    <div className="relative mb-12 before:content-[''] before:absolute before:-left-10 before:top-2 before:w-5 before:h-5 before:bg-accent before:rounded-full before:border-3 before:border-paper before:shadow-[0_0_0_2px_var(--color-accent)] before:z-2 first:before:animate-[pulse_2s_ease-in-out_infinite] max-md:before:-left-6">
      <div className="flex justify-between items-baseline flex-wrap gap-2">
        <h3 className="font-heading text-[1.4rem] font-bold">{job.company}</h3>
        <span className="text-[0.8rem] text-muted font-medium">
          {job.overallDates}
        </span>
      </div>
      <p className="text-[0.82rem] text-muted italic mb-3">{job.description}</p>

      {/* Desktop tabs */}
      <div className="flex gap-2 flex-wrap mb-5 max-md:hidden">
        {job.roles.map((role) => (
          <button
            key={role.key}
            onClick={() => setActiveRole(role.key)}
            className={`text-[0.78rem] font-semibold px-3.5 py-1.5 rounded-[10px] border-[1.5px] border-l-4 cursor-pointer transition-all duration-250 tracking-[0.02em] ${
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

export default function Experience() {
  return (
    <section id="experience" className="max-w-[960px] mx-auto px-8 py-16">
      <div className="font-heading text-[0.85rem] font-bold tracking-[0.15em] uppercase text-accent mb-12 flex items-center gap-4 after:content-[''] after:flex-1 after:h-px after:bg-rule">
        Experience
      </div>

      <div className="relative pl-10 max-md:pl-6 before:content-[''] before:absolute before:left-[calc(6px-1px+3px)] before:top-7 before:bottom-0 before:w-0.5 before:bg-rule max-md:before:left-[calc(4px-1px+3px)]">
        {jobs.map((job) => (
          <TimelineItem key={job.companyKey} job={job} />
        ))}
      </div>
    </section>
  );
}
