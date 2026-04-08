const bulletClass =
  "pl-5 relative mb-3 text-[0.93rem] leading-[1.7] text-body before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-sm before:bg-accent";

export default function BulletList({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={`list-none p-0 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className={bulletClass}>
          {item}
        </li>
      ))}
    </ul>
  );
}
