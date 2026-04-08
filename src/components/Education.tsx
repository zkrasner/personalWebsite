import { education, skillGroups } from "@/data/resume";
import BulletList from "@/components/BulletList";

export default function Education() {
  return (
    <div
      id="education"
      className="max-w-[960px] mx-auto px-8 py-16 grid grid-cols-2 gap-12 max-md:grid-cols-1 max-md:gap-8"
    >
      <div className="fade-in">
        <h3 className="section-subheader">Education</h3>
        <div>
          <div className="font-heading font-bold text-[1.2rem]">
            {education.school}
          </div>
          <div className="italic text-body my-1">{education.degree}</div>
          <div className="italic text-body my-1">{education.years}</div>
          <BulletList items={education.activities} className="mt-3" />
        </div>
      </div>

      <div className="fade-in">
        <h3 className="section-subheader">Skills</h3>
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
                    className="px-2.5 py-1 bg-warm rounded-card text-[0.82rem] font-medium text-ink border-l-4 border-l-transparent hover:border-l-accent card-hover"
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
