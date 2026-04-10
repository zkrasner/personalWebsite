export default function SectionHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-heading text-base font-bold tracking-[0.15em] uppercase text-accent mb-12 flex items-center gap-4 after:content-[''] after:flex-1 after:h-px after:bg-rule">
      {children}
    </div>
  );
}
