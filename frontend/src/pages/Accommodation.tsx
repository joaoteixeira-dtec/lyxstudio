import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../components/AnimateOnScroll';

const ASSET_BASE = '/assets';

const amenityIcons = [
  { key: 'wifi', icon: '📶' },
  { key: 'pool', icon: '🏊' },
  { key: 'parking', icon: '🅿️' },
  { key: 'accessibility', icon: '♿' },
  { key: 'gardens', icon: '🌿' },
  { key: 'breakfast', icon: '🍳' },
  { key: 'cleaning', icon: '🧹' },
  { key: 'tourism', icon: '🗺️' },
  { key: 'shop', icon: '🛍️' },
];

const photos = [
  `${ASSET_BASE}/images/interior/interior-01.jpg`,
  `${ASSET_BASE}/images/interior/interior-02.jpg`,
  `${ASSET_BASE}/images/interior/interior-03.jpg`,
  `${ASSET_BASE}/images/interior/interior-04.jpg`,
  `${ASSET_BASE}/images/exterior/exterior-01.jpg`,
  `${ASSET_BASE}/images/exterior/exterior-02.jpg`,
];

export default function Accommodation() {
  const { t } = useTranslation();
  const toConfirm = t('accommodation.to_confirm_items', { returnObjects: true }) as string[];

  return (
    <main className="page-enter">
      {/* Page Hero Banner */}
      <div className="relative h-[45vh] min-h-[320px] overflow-hidden">
        <img
          src={`${ASSET_BASE}/images/interior/interior-01.jpg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-12 text-center text-white px-4">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-300/80 font-medium mb-3">Casa do Posto das Marés</span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-3">
            {t('accommodation.title')}
          </h1>
          <p className="text-amber-300 font-medium text-lg">{t('accommodation.typology')}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Description */}
          <div id="accommodation-section">
            <AnimateOnScroll animation="fade-up">
              <p className="text-stone-500 leading-relaxed text-lg font-light mb-10">
                {t('accommodation.description')}
              </p>
            </AnimateOnScroll>

            {/* Price */}
            <AnimateOnScroll animation="fade-up" delay={100}>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/60 rounded-2xl p-8 mb-10">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-amber-800 font-serif">{t('accommodation.price_value')}</span>
                  <span className="text-stone-400 text-sm font-light">/ {t('accommodation.price_label')}</span>
                </div>
                <span className="inline-block mt-3 px-4 py-1.5 bg-amber-200/50 text-amber-700 text-xs font-medium rounded-full tracking-wide">
                  {t('accommodation.price_note')}
                </span>
              </div>
            </AnimateOnScroll>

            {/* Amenities */}
            <AnimateOnScroll animation="fade-up" delay={200}>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-5">{t('accommodation.amenities_title')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {amenityIcons.map((a, i) => (
                  <div key={a.key} className="card-hover flex items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-100/80 transition-all" style={{ animationDelay: `${i * 50}ms` }}>
                    <span className="text-xl" aria-hidden="true">{a.icon}</span>
                    <span className="text-sm text-stone-600">{t(`services.${a.key}`)}</span>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            {/* To confirm */}
            <AnimateOnScroll animation="fade-up" delay={300}>
              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-7">
                <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <span className="text-amber-500">⚠</span>
                  {t('accommodation.to_confirm_title')}
                </h3>
                <ul className="space-y-2.5">
                  {toConfirm.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-stone-500 font-light">
                      <span className="text-amber-400 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Photos */}
          <div>
            <AnimateOnScroll animation="fade-left">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">{t('accommodation.photos_title')}</h2>
            </AnimateOnScroll>
            <div className="grid grid-cols-2 gap-3">
              {photos.map((src, i) => (
                <AnimateOnScroll key={i} animation="zoom-in" delay={i * 80}>
                  <div className={`img-zoom rounded-2xl overflow-hidden shadow-sm ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                    <img
                      src={src}
                      alt={`Alojamento ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
