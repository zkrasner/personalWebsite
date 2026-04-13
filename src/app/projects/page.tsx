import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import ProjectsList from "@/components/ProjectsList";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects | Zach Krasner",
  description:
    "Work projects and side projects. What I've built, the problems they solved, and how.",
  alternates: { canonical: "https://zkrasner.com/projects" },
  openGraph: {
    title: "Projects | Zach Krasner",
    description:
      "Work projects and side projects. What I've built, the problems they solved, and how.",
    url: "https://zkrasner.com/projects",
    siteName: "Zach Krasner",
    type: "website",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="w-full max-w-[960px] mx-auto px-8 pt-28 pb-16 flex-1"
      >
        <SectionHeader>Projects</SectionHeader>
        <Suspense fallback={null}>
          <ProjectsList projects={projects} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
