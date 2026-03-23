import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'pt', label: 'Português', short: 'PT', flag: '🇵🇹' },
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', short: 'FR', flag: '🇫🇷' },
  { code: 'es', label: 'Español', short: 'ES', flag: '🇪🇸' },
];

interface LanguageSwitcherProps {
  scrolled?: boolean;
  variant?: 'navbar' | 'mobile';
}

export default function LanguageSwitcher({ scrolled = false, variant = 'navbar' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Mobile variant — simple horizontal list
  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-2" role="group" aria-label="Language selection">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              i18n.language === lang.code
                ? 'bg-amber-50 text-amber-800'
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
            }`}
          >
            <span className="text-base">{lang.flag}</span>
            <span>{lang.short}</span>
          </button>
        ))}
      </div>
    );
  }

  // Desktop dropdown
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${
          scrolled
            ? 'border-stone-200 text-stone-600 hover:border-stone-300 hover:text-stone-900 bg-white/50'
            : 'border-white/20 text-white/80 hover:border-white/40 hover:text-white bg-white/5'
        }`}
        aria-label="Language selection"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-sm">{current.flag}</span>
        <span className="tracking-wide">{current.short}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-44 bg-white border border-stone-200/80 rounded-xl shadow-xl shadow-stone-200/40 overflow-hidden animate-[fadeIn_0.15s_ease-out] z-50"
          role="listbox"
          aria-label="Select language"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={i18n.language === lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                i18n.language === lang.code
                  ? 'bg-amber-50 text-amber-800 font-medium'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
              {i18n.language === lang.code && (
                <svg className="w-4 h-4 ml-auto text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
