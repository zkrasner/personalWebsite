export default function BookshelfSkeleton() {
  return (
    <div className="fade-in">
      {/* Simulate two year groups */}
      {[0, 1].map((group) => (
        <section key={group} className="mb-12">
          <div className="h-6 w-16 bg-warm rounded animate-pulse mb-4" />
          <div className="grid grid-cols-5 gap-5 max-md:grid-cols-3 max-sm:grid-cols-2">
            {Array.from({ length: group === 0 ? 10 : 5 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[2/3] rounded-card bg-warm border border-rule animate-pulse" />
                <div className="h-4 w-3/4 bg-warm rounded animate-pulse mt-2" />
                <div className="h-3 w-1/2 bg-warm rounded animate-pulse mt-1" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
