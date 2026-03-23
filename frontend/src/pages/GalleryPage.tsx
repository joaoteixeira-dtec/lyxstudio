import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../components/AnimateOnScroll';

const ASSET_BASE = '/assets';

interface GalleryImage {
  src: string;
  category: 'exterior' | 'interior';
  alt: string;
}

const images: GalleryImage[] = [
  ...Array.from({ length: 14 }, (_, i) => ({
    src: `${ASSET_BASE}/images/exterior/exterior-${String(i + 1).padStart(2, '0')}.jpg`,
    category: 'exterior' as const,
    alt: `Exterior ${i + 1}`,
  })),
  ...Array.from({ length: 13 }, (_, i) => ({
    src: `${ASSET_BASE}/images/interior/interior-${String(i + 1).padStart(2, '0')}.jpg`,
    category: 'interior' as const,
    alt: `Interior ${i + 1}`,
  })),
];

type Filter = 'all' | 'exterior' | 'interior';

export default function GalleryPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === 'all' ? images : images.filter((img) => img.category === filter)),
    [filter]
  );

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : filtered.length - 1);
    }
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex < filtered.length - 1 ? lightboxIndex + 1 : 0);
    }
  };

  return (
    <main className="page-enter">
      {/* Page Hero Banner */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <img
          src={`${ASSET_BASE}/images/exterior/exterior-09.jpg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-12 text-center text-white px-4">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-300/80 font-medium mb-3">Casa do Posto das Marés</span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold">
            {t('gallery.title')}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        {/* Filters */}
        <AnimateOnScroll animation="fade-up">
          <div className="flex justify-center gap-3 mb-12">
            {(['all', 'exterior', 'interior'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                  filter === f
                    ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/20'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
                }`}
              >
                {t(`gallery.${f}`)}
              </button>
            ))}
          </div>
        </AnimateOnScroll>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filtered.map((img, i) => (
            <AnimateOnScroll key={img.src} animation="zoom-in" delay={Math.min(i * 50, 400)}>
              <button
                onClick={() => openLightbox(i)}
                className="img-zoom aspect-square rounded-2xl overflow-hidden group focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 shadow-sm"
                aria-label={`${t('gallery.title')} - ${img.alt}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            </AnimateOnScroll>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
          }}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-6 right-6 text-white/60 hover:text-white p-2 z-10 transition-colors"
            aria-label={t('gallery.close')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 sm:left-8 text-white/60 hover:text-white p-2 transition-colors"
            aria-label={t('gallery.previous')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <img
            src={filtered[lightboxIndex].src}
            alt={filtered[lightboxIndex].alt}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 sm:right-8 text-white/60 hover:text-white p-2 transition-colors"
            aria-label={t('gallery.next')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-6 text-white/40 text-sm font-light tracking-wider">
            {lightboxIndex + 1} / {filtered.length}
          </div>
        </div>
      )}
    </main>
  );
}
