import { education, skillGroups } from "@/data/resume";

export default function Education() {
  return (
    <div
      id="education"
      className="max-w-[960px] mx-auto px-8 py-16 grid grid-cols-2 gap-12 max-md:grid-cols-1"
    >
      <div className="fade-in">
        <h3 className="font-heading text-[0.85rem] font-bold tracking-[0.15em] uppercase text-accent mb-6 pb-3 border-b-2 border-ink">
          Education
        </h3>
        <div>
          <div className="font-heading font-bold text-[1.2rem]">
            {education.school}
          </div>
          <div className="italic text-body my-1">{education.degree}</div>
          <div className="italic text-body my-1">{education.years}</div>
          <ul className="mt-3 list-none p-0 space-y-1">
            {education.activities.map((activity) => (
              <li
                key={activity}
                className="pl-4 relative text-[0.85rem] text-muted leading-relaxed before:content-[''] before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-1.5 before:bg-accent"
              >
                {activity}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="fade-in">
        <h3 className="font-heading text-[0.85rem] font-bold tracking-[0.15em] uppercase text-accent mb-6 pb-3 border-b-2 border-ink">
          Skills
        </h3>
        <div className="space-y-4">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <div className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-accent mb-1.5">
                {group.label}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-warm rounded-md text-[0.82rem] font-medium text-ink transition-all duration-200 ease-in-out border-l-4 border-l-transparent hover:border-l-accent hover:rounded-[10px] hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
