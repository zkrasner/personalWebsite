import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-8">
      <div className="text-center">
        <h1 className="font-heading font-black text-[6rem] leading-none text-accent">
          404
        </h1>
        <p className="font-heading text-[1.25rem] text-muted mt-2 mb-8">
          Page not found
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-warm rounded-card border-[1.5px] border-rule border-l-4 border-l-accent text-ink text-[0.85rem] font-semibold no-underline card-hover focus-ring"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
