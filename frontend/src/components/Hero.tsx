import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useParallax } from '../hooks/useScrollAnimation';

interface HeroProps {
  videoSrc: string;
  fallbackImage: string;
}

export default function Hero({ videoSrc, fallbackImage }: HeroProps) {
  const { t } = useTranslation();
  const parallaxOffset = useParallax(0.35);

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden" aria-label="Hero">
      {/* Video background with parallax */}
      <div
        className="absolute inset-0 scale-110"
        style={{ transform: `translateY(${parallaxOffset}px) scale(1.1)` }}
      >
        <video
          className="w-full h-full object-cover"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          poster={fallbackImage}
          aria-hidden="true"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Fallback for prefers-reduced-motion */}
        <img
          src={fallbackImage}
          alt="Casa do Posto das Marés — Cabanas de Tavira"
          className="absolute inset-0 w-full h-full object-cover hidden motion-reduce:block"
        />
      </div>

      {/* Cinematic overlay */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Film grain texture */}
      <div className="grain" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-end h-full text-center text-white px-4 pb-24 sm:pb-28 md:justify-center md:pb-0">
        {/* Location badge */}
        <div className="stagger-children mb-8">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.35em] text-amber-200/90 font-medium">
              {t('hero.location')}
            </span>
          </div>
        </div>

        {/* Title with staggered reveal */}
        <div className="stagger-children mb-6">
          <h1 className="font-serif font-bold leading-none">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-wide text-white reveal-line">
              CASA DO POSTO
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-wide text-amber-300/90 mt-1 reveal-line" style={{ animationDelay: '0.2s' }}>
              DAS MARÉS
            </span>
            <span className="block text-sm sm:text-base md:text-lg tracking-[0.35em] text-white/50 font-light mt-3 reveal-line" style={{ animationDelay: '0.5s' }}>
              by Vanguard Ceremony
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <div className="stagger-children">
          <p className="text-base sm:text-lg md:text-xl text-stone-300 mb-12 max-w-xl leading-relaxed font-light italic">
            {t('hero.tagline')}
          </p>
        </div>

        {/* CTA button */}
        <div className="stagger-children">
          <Link
            to="/reservas"
            className="btn-magnetic group relative inline-flex items-center gap-3 bg-transparent border border-white/30 text-white font-medium py-3.5 px-10 rounded-full text-base tracking-wider uppercase transition-all duration-500 hover:bg-white hover:text-stone-900 hover:border-white hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
          >
            {t('hero.cta')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-[float_3s_ease-in-out_infinite]">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}
