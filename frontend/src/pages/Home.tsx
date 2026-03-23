import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import AnimateOnScroll from '../components/AnimateOnScroll';

const ASSET_BASE = '/assets';

const serviceIcons: Record<string, string> = {
  breakfast: '🍳',
  wifi: '📶',
  pool: '🏊',
  parking: '🅿️',
  accessibility: '♿',
  gardens: '🌿',
  shop: '🛍️',
  cleaning: '🧹',
  tourism: '🗺️',
};

const serviceKeys = Object.keys(serviceIcons);

const previewImages = [
  `${ASSET_BASE}/images/exterior/exterior-01.jpg`,
  `${ASSET_BASE}/images/exterior/exterior-03.jpg`,
  `${ASSET_BASE}/images/interior/interior-01.jpg`,
  `${ASSET_BASE}/images/interior/interior-03.jpg`,
  `${ASSET_BASE}/images/exterior/exterior-05.jpg`,
  `${ASSET_BASE}/images/interior/interior-14.jpg`,
];

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="page-enter">
      {/* Hero */}
      <Hero
        videoSrc={`${ASSET_BASE}/video/hero-video.mp4`}
        fallbackImage={`${ASSET_BASE}/images/exterior/exterior-01.jpg`}
      />

      {/* Concept Section */}
      <section id="concept-section" className="py-24 md:py-32 bg-white relative overflow-hidden">
        {/* Decorative accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-amber-300/40" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AnimateOnScroll animation="fade-up">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-amber-600 font-medium mb-4">
              {t('hero.location')}
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={100}>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-8 leading-tight">
              {t('home.concept_title')}
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={200}>
            <p className="text-lg md:text-xl text-stone-500 leading-relaxed font-light">
              {t('home.concept_text')}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Parallax divider image */}
      <div className="parallax-section h-[40vh] md:h-[50vh]">
        <img
          src={`${ASSET_BASE}/images/exterior/exterior-07.jpg`}
          alt=""
          className="parallax-bg"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Services Section */}
      <section className="py-24 md:py-32 bg-stone-50 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-amber-600 font-medium mb-3">
                Amenities
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900">
                {t('home.services_title')}
              </h2>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {serviceKeys.map((key, i) => (
              <AnimateOnScroll key={key} animation="fade-up" delay={i * 80}>
                <div className="card-hover bg-white rounded-2xl p-7 shadow-sm border border-stone-100/80 group cursor-default">
                  <span className="text-3xl mb-4 block transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
                    {serviceIcons[key]}
                  </span>
                  <p className="text-stone-600 text-sm leading-relaxed">{t(`services.${key}`)}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-amber-600 font-medium mb-3">
                Gallery
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-4">
                {t('home.gallery_title')}
              </h2>
              <p className="text-stone-400 font-light">{t('home.gallery_subtitle')}</p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {previewImages.map((src, i) => (
              <AnimateOnScroll key={i} animation="zoom-in" delay={i * 100}>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden img-zoom shadow-sm">
                  <img
                    src={src}
                    alt={`Casa do Posto das Marés ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="text-center mt-12">
              <Link
                to="/galeria"
                className="btn-magnetic group inline-flex items-center gap-3 border border-stone-300 text-stone-700 hover:border-stone-900 hover:text-stone-900 font-medium py-3 px-8 rounded-full text-sm tracking-wider uppercase transition-all duration-400"
              >
                {t('home.view_all')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Parallax divider image */}
      <div className="parallax-section h-[35vh] md:h-[45vh]">
        <img
          src={`${ASSET_BASE}/images/interior/interior-07.jpg`}
          alt=""
          className="parallax-bg"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Location Section */}
      <section className="py-24 md:py-32 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <AnimateOnScroll animation="fade-up">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-amber-600 font-medium mb-3">
              Location
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              {t('home.location_title')}
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={100}>
            <p className="text-stone-500 mb-10 font-light">Beco Vasco da Gama, nº 1, 8800-595 Cabanas de Tavira</p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="zoom-in" delay={200}>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-stone-200/50">
              <iframe
                title="Localização Casa do Posto das Marés"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3190.5!2d-7.5983!3d37.1275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDA3JzM5LjAiTiA3wrAzNSc1My45Ilc!5e0!3m2!1spt-PT!2spt!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Section divider */}
      <div className="section-divider" />
    </main>
  );
}
