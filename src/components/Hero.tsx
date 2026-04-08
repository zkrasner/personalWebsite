import { summary } from "@/data/resume";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="about"
      className="max-w-[1100px] mx-auto px-8 pt-40 pb-20 grid grid-cols-[1fr_320px] gap-16 items-end max-md:grid-cols-1 max-md:pt-28"
    >
      <div className="fade-in">
        <h1 className="font-heading font-black text-[5.5rem] leading-[0.95] tracking-tight mb-1 max-md:text-[3.5rem]">
          {summary.name.first}
          <span className="block text-accent">{summary.name.last}</span>
        </h1>
        <p className="font-heading italic text-[1.25rem] text-muted mb-6 pt-4 border-t-2 border-ink">
          {summary.tagline}
        </p>
        <p className="text-[1.05rem] leading-[1.75] text-body max-w-[540px]">
          {summary.bio}
        </p>
        <div className="flex gap-6 mt-6 pt-4 border-t border-rule">
          <a
            href={summary.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.85rem] font-semibold text-ink no-underline tracking-[0.04em] uppercase transition-colors duration-300 hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href={summary.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.85rem] font-semibold text-ink no-underline tracking-[0.04em] uppercase transition-colors duration-300 hover:text-accent"
          >
            GitHub
          </a>
          <span className="text-[0.85rem] font-semibold text-ink tracking-[0.04em] uppercase">
            {summary.location}
          </span>
        </div>
      </div>

      <div className="relative fade-in max-md:order-first max-md:max-w-[250px]">
        <div className="relative w-full aspect-[3/4] overflow-hidden border-3 border-ink z-2">
          <Image
            src="/photo.jpeg"
            alt="Zachary Krasner"
            fill
            className="object-cover grayscale-[20%] contrast-[1.05]"
            priority
          />
        </div>
        <div className="absolute -bottom-3 -right-3 w-full h-full border-3 border-accent z-1" />
      </div>
    </section>
  );
}
