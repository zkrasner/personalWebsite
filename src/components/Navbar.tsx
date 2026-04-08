"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Interests", href: "#interests" },
  ];

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  return (
    <nav className="fixed top-0 w-full z-100 bg-paper border-b border-rule backdrop-blur-sm">
      <div className="max-w-[1100px] mx-auto px-8 py-4 flex justify-between items-center">
        <div className="font-heading font-black text-[1.1rem] tracking-[0.08em] uppercase">
          Z<span className="text-accent">K.</span>
        </div>

        {/* Desktop links */}
        <ul className="flex gap-8 list-none max-md:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="no-underline text-muted text-[0.85rem] font-medium tracking-[0.06em] uppercase transition-colors duration-300 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger button */}
        <button
          className="hidden max-md:flex flex-col justify-between w-[26px] h-[20px] bg-transparent border-none cursor-pointer p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-full h-[2.5px] bg-ink rounded-sm transition-all duration-300 origin-center ${open ? "translate-y-[8.75px] rotate-45" : ""}`}
          />
          <span
            className={`block w-full h-[2.5px] bg-ink rounded-sm transition-all duration-300 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-full h-[2.5px] bg-ink rounded-sm transition-all duration-300 origin-center ${open ? "-translate-y-[8.75px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`hidden max-md:block overflow-hidden transition-all duration-350 ease-in-out ${open ? "max-h-60 opacity-100 border-t border-rule" : "max-h-0 opacity-0"}`}
      >
        <ul className="list-none py-2">
          {links.map((link, i) => (
            <li
              key={link.href}
              className={i < links.length - 1 ? "border-b border-rule" : ""}
            >
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-8 py-3.5 no-underline text-muted text-[0.85rem] font-semibold tracking-[0.1em] uppercase transition-colors duration-200 hover:text-accent hover:bg-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
