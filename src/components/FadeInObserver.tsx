"use client";

import { useEffect } from "react";

export default function FadeInObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 },
    );

    const revealAndObserve = () => {
      document.querySelectorAll(".fade-in:not(.visible)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (
          rect.bottom < 0 ||
          (rect.top < window.innerHeight && rect.bottom > 0)
        ) {
          // Already scrolled past or currently in viewport — show immediately
          el.classList.add("visible");
        } else {
          observer.observe(el);
        }
      });
    };

    revealAndObserve();

    // Re-run when page is restored from bfcache (back/forward navigation)
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) revealAndObserve();
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return null;
}
