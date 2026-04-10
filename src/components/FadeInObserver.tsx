"use client";

import { useEffect } from "react";

export default function FadeInObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 },
    );

    const reveal = (el: Element) => {
      const rect = el.getBoundingClientRect();
      if (
        rect.bottom < 0 ||
        (rect.top < window.innerHeight && rect.bottom > 0)
      ) {
        el.classList.add("visible");
      } else {
        io.observe(el);
      }
    };

    // Handle existing elements
    document.querySelectorAll(".fade-in:not(.visible)").forEach(reveal);

    // Watch for new .fade-in elements (e.g. restored from router cache)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (
            node.classList.contains("fade-in") &&
            !node.classList.contains("visible")
          ) {
            reveal(node);
          }
          node.querySelectorAll?.(".fade-in:not(.visible)").forEach(reveal);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Handle bfcache restoration
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        document.querySelectorAll(".fade-in:not(.visible)").forEach(reveal);
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return null;
}
