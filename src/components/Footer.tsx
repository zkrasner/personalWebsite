export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t-2 border-ink max-w-[960px] mx-auto mb-8 px-8 py-4 flex justify-end"
    >
      <div className="text-[0.8rem] text-muted italic">
        &copy; {new Date().getFullYear()} Zachary Krasner
      </div>
    </footer>
  );
}
