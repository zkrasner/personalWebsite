import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Interests from "@/components/Interests";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import FadeInObserver from "@/components/FadeInObserver";

export default function Home() {
  return (
    <>
      <FadeInObserver />
      <Navbar />
      <main id="main-content">
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
