import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollDirection } from '../hooks/useScrollAnimation';

const navItems = [
  { path: '/', label: 'Início' },
  { path: '/reservas', label: 'Reservas' },
  { path: '/contactos', label: 'Contacto' },
];

export default function Navbar() {
  const location = useLocation();
  const { scrolled, hidden } = useScrollDirection();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out nav-glass ${
        scrolled ? 'scrolled' : 'bg-transparent'
      } ${hidden && !mobileOpen ? 'nav-hidden' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-0.5">
              <span className={`font-display font-bold tracking-tight transition-all duration-300 ${
                scrolled ? 'text-lg' : 'text-xl'
              } text-white`}>
                LYX
              </span>
              <span className={`font-display font-bold tracking-tight transition-all duration-300 ${
                scrolled ? 'text-lg' : 'text-xl'
              } text-[#e2ff00]`}>
                STUDIO
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                  location.pathname === item.path
                    ? 'text-[#e2ff00]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0.5 left-4 right-4 h-[2px] rounded-full transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-[#e2ff00] scale-x-100'
                    : 'bg-[#e2ff00]/50 scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Link
              to="/reservas"
              className="px-5 py-2 text-sm font-semibold bg-[#e2ff00] text-black rounded-lg hover:bg-[#d4ef00] transition-all duration-300"
            >
              Agendar Sessão
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a0a]/98 backdrop-blur-xl border-t border-white/5 shadow-xl animate-[fadeIn_0.2s_ease-out]">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  location.pathname === item.path
                    ? 'bg-[#e2ff00]/10 text-[#e2ff00]'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/reservas"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 mt-2 rounded-lg text-base font-semibold bg-[#e2ff00] text-black text-center"
            >
              Agendar Sessão
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
