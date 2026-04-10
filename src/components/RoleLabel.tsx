export default function RoleLabel({
  title,
  dates,
}: {
  title: string;
  dates: string;
}) {
  return (
    <>
      <span className="block text-sm font-semibold">{title}</span>
      <span className="block text-xs opacity-60 mt-0.5">{dates}</span>
    </>
  );
}
