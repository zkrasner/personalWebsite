"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Role } from "@/data/resume";

export default function RoleDropdown({
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

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, close]);

  return (
    <div ref={ref} className="relative w-full mb-5 hidden max-md:block">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="w-full text-left px-3.5 pr-10 py-2 rounded-card border-[1.5px] border-rule border-l-4 border-l-accent bg-warm cursor-pointer relative transition-all duration-200 focus-ring"
      >
        <span className="block text-[0.78rem] font-semibold text-ink">
          {active.title}
        </span>
        <span className="block text-[0.68rem] text-muted mt-0.5">
          {active.dates}
        </span>
        <span
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-[calc(100%+4px)] left-0 right-0 bg-paper border-[1.5px] border-rule rounded-card overflow-hidden z-10 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        >
          {roles.map((role) => (
            <div
              key={role.key}
              role="option"
              aria-selected={role.key === activeRole}
              onClick={() => {
                onSelect(role.key);
                close();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(role.key);
                  close();
                }
              }}
              tabIndex={0}
              className={`px-3.5 py-2 cursor-pointer border-b border-rule last:border-b-0 transition-colors duration-200 hover:bg-warm focus-visible:outline-none focus-visible:bg-warm ${
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
