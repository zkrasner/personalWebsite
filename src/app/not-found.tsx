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
          className="inline-block px-6 py-3 bg-warm rounded-[10px] border-[1.5px] border-rule border-l-4 border-l-accent text-ink text-[0.85rem] font-semibold no-underline transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
