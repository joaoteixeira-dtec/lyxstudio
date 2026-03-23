import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import AnimateOnScroll from '../components/AnimateOnScroll';

const ASSET_BASE = '/assets';

const sectionIcons: Record<string, ReactNode> = {
  building: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
  ),
  leaf: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3c0 0 7 2 9 10s-1 8-1 8M5 21c0 0 2-4 5-7M20 3s-2 0-4 1c-4 2-7 6-8 10" />
    </svg>
  ),
  bolt: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  path: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  ),
  handshake: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3C8 3 4.5 5 3 8m18 8c-1.5 3-5 5-9 5" />
    </svg>
  ),
  shield: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
};

export default function Sustainability() {
  const { t } = useTranslation();
  const sections = t('sustainability.sections', { returnObjects: true }) as {
    icon: string;
    title: string;
    text: string;
  }[];

  return (
    <main className="page-enter">
      {/* Page Hero Banner */}
      <div className="relative h-[45vh] min-h-[320px] overflow-hidden">
        <img
          src={`${ASSET_BASE}/images/exterior/exterior-05.jpg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-12 text-center text-white px-4">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-300/80 font-medium mb-3">
            Casa do Posto das Marés
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold max-w-4xl leading-tight">
            {t('sustainability.title')}
          </h1>
          <p className="mt-4 text-stone-300 font-light text-base sm:text-lg max-w-2xl">
            {t('sustainability.subtitle')}
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="space-y-8">
            {sections.map((section, i) => (
              <AnimateOnScroll
                key={i}
                animation={i % 2 === 0 ? 'fade-right' : 'fade-left'}
                delay={i * 80}
              >
                <div className="group relative bg-stone-50 rounded-2xl p-8 md:p-10 border border-stone-100 hover:border-amber-200/50 transition-all duration-500 hover:shadow-lg hover:shadow-amber-50">
                  {/* Decorative number */}
                  <span className="absolute top-6 right-8 text-7xl md:text-8xl font-serif font-bold text-stone-100 group-hover:text-amber-100/60 transition-colors duration-500 select-none pointer-events-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="relative z-10">
                    {/* Icon + Title */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                        {sectionIcons[section.icon] || sectionIcons.shield}
                      </div>
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-stone-800">
                        {section.title}
                      </h3>
                    </div>

                    {/* Divider */}
                    <div className="w-16 h-px bg-gradient-to-r from-amber-300 to-transparent mb-5" />

                    {/* Text */}
                    <p className="text-stone-500 leading-relaxed md:text-[15px] font-light">
                      {section.text}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Closing visual divider */}
      <div className="parallax-section h-[30vh] md:h-[40vh]">
        <img
          src={`${ASSET_BASE}/images/exterior/exterior-07.jpg`}
          alt=""
          className="parallax-bg"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="section-divider" />
    </main>
  );
}
