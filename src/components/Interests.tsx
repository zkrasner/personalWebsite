import { interests } from "@/data/resume";
import SectionHeader from "@/components/SectionHeader";

export default function Interests() {
  return (
    <section
      id="interests"
      className="max-w-[960px] mx-auto px-8 py-16 fade-in"
    >
      <SectionHeader>Beyond the Code</SectionHeader>
      <div className="grid grid-cols-4 gap-5 max-md:grid-cols-2 max-sm:grid-cols-1">
        {interests.map((interest) => (
          <div
            key={interest.title}
            className="p-6 bg-warm rounded-card border-l-4 border-l-accent card-hover"
          >
            <h4 className="font-heading font-bold text-[1rem] mb-1.5">
              {interest.title}
            </h4>
            <p className="text-[0.85rem] text-body leading-relaxed">
              {interest.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
