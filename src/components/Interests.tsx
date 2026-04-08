import { interests } from "@/data/resume";

export default function Interests() {
  return (
    <section
      id="interests"
      className="max-w-[960px] mx-auto px-8 py-16 fade-in"
    >
      <div className="font-heading text-[0.85rem] font-bold tracking-[0.15em] uppercase text-accent mb-12 flex items-center gap-4 after:content-[''] after:flex-1 after:h-px after:bg-rule">
        Beyond the Code
      </div>
      <div className="grid grid-cols-4 gap-5 max-md:grid-cols-2 max-sm:grid-cols-1">
        {interests.map((interest) => (
          <div
            key={interest.title}
            className="p-6 bg-warm rounded-[10px] border-l-4 border-l-accent transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
          >
            <h4 className="font-heading font-bold text-[1rem] mb-1.5">
              {interest.title}
            </h4>
            <p className="text-[0.85rem] text-[#555] leading-relaxed">
              {interest.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
