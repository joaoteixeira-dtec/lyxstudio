import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScrollDirection } from '../hooks/useScrollAnimation';
import LanguageSwitcher from './LanguageSwitcher';

const navItems = [
  { path: '/', key: 'nav.home' },
  { path: '/alojamento', key: 'nav.accommodation' },
  { path: '/galeria', key: 'nav.gallery' },
  { path: '/historia', key: 'nav.history' },
  { path: '/sustentabilidade', key: 'nav.sustainability' },
  { path: '/reservas', key: 'nav.reservations' },
  { path: '/contactos', key: 'nav.contact' },
];

const ASSET_BASE = '/assets';

export default function Navbar() {
  const { t } = useTranslation();
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
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src={`${ASSET_BASE}/revive-logo.jpeg`}
              alt="Revive Natureza"
              className={`rounded transition-all duration-300 ${scrolled ? 'h-8' : 'h-10'}`}
            />
            <span className="flex flex-col leading-tight">
              <span className={`font-serif font-bold tracking-wide transition-all duration-300 ${
                scrolled ? 'text-sm' : 'text-base'
              } ${scrolled ? 'text-stone-900' : 'text-white'}`}>
                <span className="text-amber-500 group-hover:text-amber-400 transition-colors">POSTO DAS MARÉS</span>
              </span>
              <span className={`text-[10px] tracking-wider font-light transition-all duration-300 ${scrolled ? 'text-stone-400' : 'text-white/50'}`}>by Vanguard Ceremony</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-md group ${
                  location.pathname === item.path
                    ? scrolled ? 'text-amber-700' : 'text-amber-300'
                    : scrolled ? 'text-stone-600 hover:text-stone-900' : 'text-white/80 hover:text-white'
                }`}
              >
                {t(item.key)}
                {/* Active underline indicator */}
                <span className={`absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-amber-500 scale-x-100'
                    : 'bg-amber-500/50 scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
          </div>

          {/* Right side — language dropdown */}
          <div className="hidden md:flex items-center">
            <LanguageSwitcher scrolled={scrolled} />
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-full transition-colors ${
              scrolled ? 'text-stone-600 hover:bg-stone-100' : 'text-white hover:bg-white/10'
            }`}
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
        <div className="md:hidden bg-white/98 backdrop-blur-xl border-t border-stone-200 shadow-xl animate-[fadeIn_0.2s_ease-out]">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-all ${
                  location.pathname === item.path
                    ? 'bg-amber-50 text-amber-800'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-stone-100">
            <LanguageSwitcher variant="mobile" />
          </div>
        </div>
      )}
    </nav>
  );
}
