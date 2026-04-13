export default function Chip({
  children,
  interactive = false,
}: {
  children: React.ReactNode;
  interactive?: boolean;
}) {
  const base =
    "px-2.5 py-1 bg-paper rounded-card text-sm font-medium text-ink border border-rule";
  const interactiveClasses = interactive
    ? "hover:border-accent card-hover"
    : "";

  return <span className={`${base} ${interactiveClasses}`}>{children}</span>;
}
