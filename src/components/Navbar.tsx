export default function Navbar() {
  const links = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Interests", href: "#interests" },
  ];

  return (
    <nav className="fixed top-0 w-full z-100 bg-paper border-b border-rule backdrop-blur-sm">
      <div className="max-w-[1100px] mx-auto px-8 py-4 flex justify-between items-center">
        <div className="font-heading font-black text-[1.1rem] tracking-[0.08em] uppercase">
          Zachary <span className="text-accent">K.</span>
        </div>
        <ul className="flex gap-8 list-none">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="no-underline text-muted text-[0.85rem] font-medium tracking-[0.06em] uppercase transition-colors duration-300 hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
