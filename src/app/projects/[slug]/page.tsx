import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import ProjectImage from "@/components/ProjectImage";
import MetricCard from "@/components/MetricCard";
import Chip from "@/components/Chip";
import { projects, type Project } from "@/data/projects";
import { formatDateRange } from "@/lib/dates";
import { findLiveLink, stripProtocol } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  const url = `https://zkrasner.com/projects/${project.slug}`;
  const ogImage = project.coverImage
    ? {
        url: `https://zkrasner.com${project.coverImage}`,
        width: 1280,
        height: 720,
      }
    : undefined;
  return {
    title: `${project.title} | Zach Krasner`,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} | Zach Krasner`,
      description: project.description,
      url,
      siteName: "Zach Krasner",
      type: "article",
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

function TechList({ tech }: { tech: Project["tech"] }) {
  const categories: { label: string; items?: string[] }[] = [
    { label: "Frontend", items: tech.frontend },
    { label: "Backend", items: tech.backend },
    { label: "Data & Storage", items: tech.data },
    { label: "Infrastructure", items: tech.infrastructure },
    { label: "Testing", items: tech.testing },
    { label: "Other", items: tech.other },
  ].filter((c) => c.items && c.items.length > 0);

  return (
    <div className="columns-2 max-sm:columns-1 gap-6">
      {categories.map((c) => (
        <div key={c.label} className="break-inside-avoid mb-5">
          <div className="text-xs font-bold uppercase tracking-[0.1em] text-accent mb-1.5">
            {c.label}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {c.items!.map((item) => (
              <Chip key={item} interactive>
                {item}
              </Chip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Section({
  heading,
  paragraphs,
}: {
  heading: string;
  paragraphs: string[];
}) {
  return (
    <section className="mb-12 fade-in">
      <SectionHeader>{heading}</SectionHeader>
      <ul className="list-disc pl-5 space-y-3">
        {paragraphs.map((p, i) => (
          <li key={i} className="text-md leading-[1.7] text-body">
            {p}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const typeBadge = project.type === "work" ? "Work" : "Side";
  const liveLink = findLiveLink(project);
  const hasMetrics = project.metrics && project.metrics.length > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `https://zkrasner.com/projects/${project.slug}`,
    author: { "@type": "Person", name: "Zach Krasner" },
    dateCreated: project.startDate,
    ...(project.coverImage && {
      image: `https://zkrasner.com${project.coverImage}`,
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main
        id="main-content"
        className="w-full max-w-[860px] mx-auto px-8 pt-28 pb-16 flex-1"
      >
        {/* Back link */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="text-sm font-semibold text-accent no-underline hover:underline focus-ring rounded-sm"
          >
            &larr; All projects
          </Link>
        </div>

        {/* Hero */}
        <header className="mb-12 fade-in">
          <h1 className="font-heading font-black text-3xl leading-tight mb-2">
            {project.title}
          </h1>
          <p className="text-md text-body leading-relaxed mb-3 max-w-[640px]">
            {project.tagline}
          </p>
          <div className="flex items-center flex-wrap gap-x-2">
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-accent">
              {typeBadge}
            </span>
            <span className="text-xs text-muted">·</span>
            <span className="text-xs text-muted">
              {formatDateRange(project.startDate, project.endDate)}
            </span>
            {project.role && (
              <>
                <span className="text-xs text-muted">·</span>
                <span className="text-xs text-muted">{project.role}</span>
              </>
            )}
            {liveLink && (
              <>
                <span className="text-xs text-muted">·</span>
                <a
                  href={liveLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-accent no-underline hover:underline focus-ring rounded-sm"
                >
                  {stripProtocol(liveLink.url)} ↗
                </a>
              </>
            )}
          </div>
        </header>

        {/* Cover image */}
        {project.coverImage && (
          <div className="mb-12 fade-in">
            <ProjectImage
              src={project.coverImage}
              alt={`${project.title} screenshot`}
            />
          </div>
        )}

        {/* Problem */}
        {project.problem && (
          <Section heading="Problem" paragraphs={project.problem} />
        )}

        {/* Approach */}
        {project.approach && (
          <Section heading="Approach" paragraphs={project.approach} />
        )}

        {/* Tech Stack */}
        <section className="mb-12 fade-in">
          <SectionHeader>Tech Stack</SectionHeader>
          <TechList tech={project.tech} />
        </section>

        {/* Outcomes */}
        {(project.outcomes || hasMetrics) && (
          <section className="mb-12 fade-in">
            <SectionHeader>Outcomes</SectionHeader>
            {project.outcomes && (
              <ul className="list-disc pl-5 space-y-3">
                {project.outcomes.map((p, i) => (
                  <li key={i} className="text-md leading-[1.7] text-body">
                    {p}
                  </li>
                ))}
              </ul>
            )}
            {hasMetrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
                {project.metrics!.map((m) => (
                  <MetricCard key={m.label} metric={m} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Optional freeform sections */}
        {project.sections?.map((s) => (
          <Section key={s.heading} heading={s.heading} paragraphs={[s.body]} />
        ))}
      </main>
      <Footer />
    </>
  );
}
