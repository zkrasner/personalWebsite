import { interests } from "@/data/resume";
import SectionHeader from "@/components/SectionHeader";
import AccentOutline from "@/components/AccentOutline";

export default function Interests() {
  return (
    <section
      id="interests"
      className="max-w-[960px] mx-auto px-8 py-16 fade-in"
    >
      <SectionHeader>Beyond the Code</SectionHeader>
      <div className="grid grid-cols-4 gap-5 max-md:grid-cols-2 max-sm:grid-cols-1">
        {interests.map((interest) => {
          const content = (
            <>
              <h4 className="font-heading font-bold text-md mb-1.5">
                {interest.title}
              </h4>
              <p className="text-base text-body leading-relaxed">
                {interest.description}
              </p>
              {interest.href && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-3 right-4 text-accent text-base opacity-60 transition-opacity duration-200 group-hover:opacity-100"
                >
                  &rarr;
                </span>
              )}
            </>
          );

          const className =
            "relative p-6 bg-warm rounded-card border-3 border-ink card-hover";

          return (
            <AccentOutline key={interest.title} size="md">
              {interest.href ? (
                <a
                  href={interest.href}
                  className={`${className} block group no-underline text-ink relative z-2`}
                >
                  {content}
                </a>
              ) : (
                <div className={`${className} h-full relative z-2`}>
                  {content}
                </div>
              )}
            </AccentOutline>
          );
        })}
      </div>
    </section>
  );
}
