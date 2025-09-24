export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white/60">
      <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-slate-600 flex items-center justify-between">
        <p>
          © {new Date().getFullYear()} <span className="text-indigo-600">FleetLink</span> -
          Logistics Vehicle Booking System
        </p>
        <p className="italic">
          Built with passion by{" "}
          <a
            href="https://www.linkedin.com/in/j-sheikh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-300 underline underline-offset-4"
          >
            Jahid Sheikh | Full Stack Developer
          </a>
        </p>
      </div>
    </footer>
  );
}
