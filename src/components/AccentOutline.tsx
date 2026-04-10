export default function AccentOutline({
  children,
  size = "sm",
  variant = "filled",
  className = "",
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "filled" | "outline";
  className?: string;
}) {
  const offset = {
    sm: "-bottom-1.5 -left-1.5",
    md: "-bottom-2 -left-2",
    lg: "-bottom-3 -left-3",
  }[size];

  const fill = {
    filled: "bg-accent",
    outline: "border-3 border-accent",
  }[variant];

  return (
    <div className={`relative ${className}`}>
      {children}
      <div
        className={`absolute ${offset} w-full h-full ${fill} rounded-card z-1`}
      />
    </div>
  );
}
