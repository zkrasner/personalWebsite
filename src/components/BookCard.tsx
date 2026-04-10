"use client";

import { useState } from "react";
import { Book } from "@/data/books";

export default function BookCard({ book }: { book: Book }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="card-hover">
      <div className="aspect-[2/3] rounded-card overflow-hidden bg-warm border border-rule">
        {imgFailed ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <span className="font-heading font-bold text-base leading-tight text-ink">
              {book.title}
            </span>
            <span className="text-xs text-muted mt-1">{book.author}</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={`${book.title} by ${book.author}`}
            className="w-full h-full object-cover"
            onError={() => setImgFailed(true)}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth <= 1) setImgFailed(true);
            }}
          />
        )}
      </div>
      <p className="font-heading font-bold text-sm leading-tight mt-2 text-ink">
        {book.title}
      </p>
      <p className="text-xs text-muted">{book.author}</p>
    </div>
  );
}
