export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t-2 border-ink max-w-[1100px] mx-auto px-8 py-4 flex justify-end w-full"
    >
      <div className="text-sm text-muted italic">
        &copy; {new Date().getFullYear()} Zachary Krasner
      </div>
    </footer>
  );
}
