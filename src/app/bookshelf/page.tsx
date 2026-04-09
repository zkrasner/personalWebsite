import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeInObserver from "@/components/FadeInObserver";
import SectionHeader from "@/components/SectionHeader";
import BookCard from "@/components/BookCard";
import { books, Book } from "@/data/books";
import overrides from "@/data/book-overrides.json";

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

function groupByYear(books: typeof import("@/data/books").books) {
  const dated: Record<number, typeof books> = {};
  const undated: typeof books = [];

  for (const book of books) {
    const year = book.dateRead ? Number(book.dateRead.split("-")[0]) : null;
    if (year) {
      (dated[year] ??= []).push(book);
    } else {
      undated.push(book);
    }
  }

  const years = Object.entries(dated)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, books]) => ({ label: year, books }));

  if (undated.length > 0) {
    years.push({ label: "Previously", books: undated });
  }

  return years;
}

export default function BookshelfPage() {
  const allBooks = [...books, ...(overrides as Book[])].sort((a, b) => {
    if (a.dateRead && b.dateRead) return b.dateRead.localeCompare(a.dateRead);
    if (a.dateRead) return -1;
    if (b.dateRead) return 1;
    return 0;
  });
  const groups = groupByYear(allBooks);

  return (
    <>
      <FadeInObserver />
      <Navbar />
      <main
        id="main-content"
        className="max-w-[960px] mx-auto px-8 pt-28 pb-16"
      >
        <SectionHeader>Bookshelf</SectionHeader>

        {groups.map(({ label, books }) => (
          <section key={label} className="mb-12 fade-in">
            <h2 className="section-subheader">{label}</h2>
            <div className="grid grid-cols-5 gap-5 max-md:grid-cols-3 max-sm:grid-cols-2">
              {books.map((book) => (
                <BookCard key={book.title} book={book} />
              ))}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
