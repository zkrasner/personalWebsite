export default function RoleLabel({
  title,
  dates,
}: {
  title: string;
  dates: string;
}) {
  return (
    <>
      <span className="block text-sm font-semibold text-ink">{title}</span>
      <span className="block text-xs text-muted mt-0.5">{dates}</span>
    </>
  );
}
