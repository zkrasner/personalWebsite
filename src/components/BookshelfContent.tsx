"use client";

import { useEffect, useState, useCallback } from "react";
import type { Book } from "@/types/book";
import BookCard from "@/components/BookCard";
import BookshelfSkeleton from "@/components/BookshelfSkeleton";

const API_URL = process.env.NEXT_PUBLIC_BOOKS_API_URL!;
const CACHE_KEY = "bookshelf-data";

interface YearGroup {
  label: string;
  books: Book[];
}

function groupByYear(books: Book[]): YearGroup[] {
  const dated: Record<number, Book[]> = {};
  const undated: Book[] = [];

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

export default function BookshelfContent() {
  const [books, setBooks] = useState<Book[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setError(null);

    // Check sessionStorage cache first
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        setBooks(JSON.parse(cached));
        return;
      }
    } catch {
      sessionStorage.removeItem(CACHE_KEY);
    }

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Book[] = await res.json();
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load books");
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  if (error) {
    return (
      <div className="text-center py-16 fade-in">
        <p className="text-muted mb-4">Could not load bookshelf.</p>
        <button
          onClick={() => {
            sessionStorage.removeItem(CACHE_KEY);
            fetchBooks();
          }}
          className="text-accent underline hover:no-underline focus-ring"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!books) {
    return <BookshelfSkeleton />;
  }

  const groups = groupByYear(books);

  return (
    <>
      {groups.map(({ label, books }) => (
        <section key={label} className="mb-12 fade-in">
          <h3 className="section-subheader">{label}</h3>
          <div className="grid grid-cols-5 gap-5 max-md:grid-cols-3 max-sm:grid-cols-2">
            {books.map((book) => (
              <BookCard key={book.title} book={book} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
