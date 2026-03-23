import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../components/AnimateOnScroll';

const ASSET_BASE = '/assets';

export default function History() {
  const { t } = useTranslation();
  const timeline = t('history.timeline', { returnObjects: true }) as { year: string; text: string }[];

  return (
    <main className="page-enter">
      {/* Page Hero Banner */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <img
          src={`${ASSET_BASE}/images/exterior/exterior-04.jpg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-12 text-center text-white px-4">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-300/80 font-medium mb-3">Casa do Posto das Marés</span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold">
            {t('history.title')}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div id="history-content">
          <AnimateOnScroll animation="fade-up">
            <p className="text-lg md:text-xl text-stone-500 leading-relaxed text-center mb-20 max-w-3xl mx-auto font-light">
              {t('history.intro')}
            </p>
          </AnimateOnScroll>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-amber-300/0 via-amber-300/60 to-amber-300/0" />

            <div className="space-y-16">
              {timeline.map((item, i) => (
                <AnimateOnScroll
                  key={i}
                  animation={i % 2 === 0 ? 'fade-right' : 'fade-left'}
                  delay={i * 100}
                >
                  <div
                    className={`relative flex items-start gap-6 ${
                      i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100 z-10 transition-transform hover:scale-150" />

                    {/* Content card */}
                    <div className={`ml-12 md:ml-0 md:w-[45%] ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full mb-3 tracking-wide">
                        {item.year}
                      </span>
                      <p className="text-stone-500 leading-relaxed font-light">{item.text}</p>
                    </div>

                    {/* Spacer for the other side */}
                    <div className="hidden md:block md:w-[45%]" />
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
