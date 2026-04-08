export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t-2 border-ink max-w-[960px] mx-auto mb-16 px-8 py-8 flex justify-between items-center"
    >
      <div className="text-[0.8rem] text-muted italic">
        &copy; {new Date().getFullYear()} Zachary Krasner
      </div>
      <div className="flex gap-6">
        <a
          href="https://linkedin.com/in/zkrasner"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.8rem] font-semibold text-ink no-underline tracking-[0.04em] uppercase transition-colors duration-300 hover:text-accent"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/zkrasner"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.8rem] font-semibold text-ink no-underline tracking-[0.04em] uppercase transition-colors duration-300 hover:text-accent"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
