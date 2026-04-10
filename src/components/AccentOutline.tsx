export default function AccentOutline({
  children,
  size = "sm",
  className = "",
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const offset = {
    sm: "-bottom-1.5 -left-1.5",
    md: "-bottom-2 -left-2",
    lg: "-bottom-3 -left-3",
  }[size];

  return (
    <div className={`relative ${className}`}>
      {children}
      <div
        className={`absolute ${offset} w-full h-full bg-accent rounded-card z-1`}
      />
    </div>
  );
}
