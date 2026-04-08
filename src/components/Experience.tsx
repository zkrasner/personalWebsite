import { jobs } from "@/data/resume";
import SectionHeader from "@/components/SectionHeader";
import TimelineItem from "@/components/TimelineItem";

export default function Experience() {
  return (
    <section id="experience" className="max-w-[960px] mx-auto px-8 py-16">
      <SectionHeader>Experience</SectionHeader>

      <div className="relative pl-10 max-md:pl-6 before:content-[''] before:absolute before:left-[calc(6px-1px+3px)] before:top-7 before:bottom-0 before:w-0.5 before:bg-rule max-md:before:left-[calc(4px-1px+6px)]">
        {jobs.map((job) => (
          <TimelineItem key={job.companyKey} job={job} />
        ))}
      </div>
    </section>
  );
}
