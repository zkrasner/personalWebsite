import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import BookshelfContent from "@/components/BookshelfContent";

export const metadata: Metadata = {
  title: "Bookshelf | Zach Krasner",
  description: "Books I've read — sci-fi, fantasy, and more.",
  alternates: { canonical: "https://zkrasner.com/bookshelf" },
  openGraph: {
    title: "Bookshelf | Zach Krasner",
    description: "Books I've read — sci-fi, fantasy, and more.",
    url: "https://zkrasner.com/bookshelf",
    siteName: "Zach Krasner",
    type: "website",
  },
};

export default function BookshelfPage() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="max-w-[960px] mx-auto px-8 pt-28 pb-16"
      >
        <SectionHeader>Bookshelf</SectionHeader>
        <BookshelfContent />
      </main>
      <Footer />
    </>
  );
}
