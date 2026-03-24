export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white py-24 md:py-32" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Logo */}
        <div className="flex justify-center mb-16">
          <img
            src="/logo.png"
            alt="Lyx Studios"
            className="h-48 sm:h-56 md:h-64 w-auto"
          />
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between text-sm text-white/30">
          <p>&copy;2025 CLICKSPOT DESIGN</p>
          <button
            onClick={scrollToTop}
            className="text-white/30 hover:text-white transition-colors duration-300 cursor-pointer uppercase tracking-wider"
          >
            De volta ao topo ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
