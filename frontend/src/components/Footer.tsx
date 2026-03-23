import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ASSET_BASE = '/assets';

const footerLinks = [
  { path: '/', key: 'nav.home' },
  { path: '/alojamento', key: 'nav.accommodation' },
  { path: '/galeria', key: 'nav.gallery' },
  { path: '/historia', key: 'nav.history' },
  { path: '/sustentabilidade', key: 'nav.sustainability' },
  { path: '/reservas', key: 'nav.reservations' },
  { path: '/contactos', key: 'nav.contact' },
];

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0f0f0f] text-stone-400 overflow-hidden" role="contentinfo">
      {/* Subtle top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-serif font-bold text-white mb-1 tracking-wide">
              <span className="text-amber-500 text-2xl">POSTO DAS MARÉS</span>
              <br />
              <span className="text-stone-500 font-light text-sm tracking-wider">by Vanguard Ceremony</span>
            </h3>
            <p className="text-sm italic text-stone-500 mt-2 mb-4">{t('footer.tagline')}</p>
            <div className="section-divider !max-w-[120px] !mx-0 opacity-40" />
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-amber-500/80 uppercase tracking-[0.2em] mb-4">Links</h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.map(({ path, key }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-stone-400 hover:text-amber-400 transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-amber-500 transition-all duration-300" />
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-amber-500/80 uppercase tracking-[0.2em] mb-4">{t('contact.title')}</h4>
            <address className="not-italic text-sm space-y-2">
              <p className="text-stone-400 leading-relaxed">{t('footer.address')}</p>
              <p className="text-stone-400">info@vanguard-cabanas.pt</p>
              <p className="text-stone-400">+351 000 000 000</p>
            </address>
          </div>
        </div>

        {/* Institutional Logos */}
        <div className="mt-12 pt-8 border-t border-stone-800/40">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <img
              src={`${ASSET_BASE}/turismo-logo.png`}
              alt="Turismo de Portugal"
              className="h-12 md:h-14 object-contain brightness-0 invert opacity-60 hover:opacity-90 transition-opacity duration-300"
            />
            <img
              src={`${ASSET_BASE}/fomento-logo.png`}
              alt="Fomento"
              className="h-12 md:h-14 object-contain brightness-0 invert opacity-60 hover:opacity-90 transition-opacity duration-300"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <p>&copy; {year} Casa do Posto das Marés by Vanguard Ceremony — Cabanas de Tavira. {t('footer.rights')}</p>
          <p className="text-stone-700">Crafted with care in the Algarve</p>
        </div>
      </div>
    </footer>
  );
}
