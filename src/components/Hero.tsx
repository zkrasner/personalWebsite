import { summary } from "@/data/resume";
import Image from "next/image";
import AccentOutline from "@/components/AccentOutline";

export default function Hero() {
  return (
    <section
      id="about"
      className="max-w-[1100px] mx-auto px-8 pt-40 pb-16 grid grid-cols-[1fr_320px] gap-16 items-center max-md:grid-cols-1 max-md:pt-28 max-md:gap-8"
    >
      <div className="fade-in">
        <h1 className="font-heading font-black text-4xl leading-[0.95] tracking-tight mb-1 max-md:text-3xl max-sm:text-2xl">
          {summary.name.first}
          <span className="block text-accent">{summary.name.last}</span>
        </h1>
        <p className="font-heading italic text-lg text-muted mb-6 pt-4 border-t-2 border-ink">
          {summary.tagline}
        </p>
        <p className="text-md leading-[1.75] text-body max-w-[540px]">
          {summary.bio}
        </p>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-rule">
          <div className="flex gap-4 items-center">
            <a
              href={summary.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink transition-colors duration-300 hover:text-accent focus-ring rounded-sm"
              aria-label="LinkedIn"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href={summary.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink transition-colors duration-300 hover:text-accent focus-ring rounded-sm"
              aria-label="GitHub"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-base font-semibold text-ink tracking-[0.04em] uppercase">
            {summary.location}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent"
              aria-hidden="true"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        </div>
      </div>

      <AccentOutline
        size="lg"
        variant="outline"
        className="fade-in max-md:order-first max-md:max-w-[250px] max-sm:max-w-[200px]"
      >
        <div className="relative w-full aspect-[3/4] overflow-hidden border-3 border-ink rounded-card z-2 card-hover">
          <Image
            src="/photo.jpeg"
            alt="Zachary Krasner"
            fill
            className="object-cover grayscale-[20%] contrast-[1.05]"
            sizes="(max-width: 768px) 250px, 320px"
            priority
          />
        </div>
      </AccentOutline>
    </section>
  );
}
