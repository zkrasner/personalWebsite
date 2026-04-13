import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Interests from "@/components/Interests";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 w-full">
        <Hero />
        <SectionDivider />
        <Experience />
        <SectionDivider />
        <Education />
        <SectionDivider />
        <Interests />
      </main>
      <Footer />
    </>
  );
}
