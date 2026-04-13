import AccentOutline from "@/components/AccentOutline";

// A segmented-control button styled to match the accent-outline + dimmed
// pattern used by role tabs and project filters. Text size/weight come from
// children or an optional className passthrough so consumers can vary it.
export default function ToggleButton({
  active,
  onClick,
  children,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AccentOutline
      size="sm"
      className={
        active
          ? "[&>:last-child]:opacity-100"
          : "[&>:last-child]:opacity-30 hover:[&>:last-child]:opacity-60"
      }
    >
      <button
        onClick={onClick}
        className={`relative z-2 px-3.5 py-1.5 rounded-card border bg-warm cursor-pointer transition-all duration-200 tracking-[0.02em] focus-ring card-hover ${
          active
            ? "text-ink border-ink"
            : "text-muted border-ink/40 hover:text-ink hover:border-ink"
        } ${className}`}
      >
        {children}
      </button>
    </AccentOutline>
  );
}
