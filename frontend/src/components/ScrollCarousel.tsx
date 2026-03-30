import { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface CarouselItem {
  image: string;
  title: string;
  description: string;
  number: string;
}

interface ScrollCarouselProps {
  studioName: string;
  items: CarouselItem[];
  direction: 'left-to-right' | 'right-to-left';
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

export default function ScrollCarousel({ studioName, items, direction }: ScrollCarouselProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();

  const updateProgress = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const wrapperH = wrapper.offsetHeight;
    const viewH = window.innerHeight;

    const scrollable = wrapperH - viewH;
    if (scrollable <= 0) return;

    const scrolled = -rect.top;
    const raw = Math.max(0, Math.min(1, scrolled / scrollable));
    setProgress(raw);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, [updateProgress, isMobile]);

  // Mobile scroll snap tracking
  useEffect(() => {
    if (!isMobile) return;
    const track = mobileTrackRef.current;
    if (!track) return;
    const onScroll = () => {
      const scrollLeft = track.scrollLeft;
      const cardWidth = track.firstElementChild?.clientWidth || 1;
      const gap = 16;
      setActiveIndex(Math.round(scrollLeft / (cardWidth + gap)));
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  const getTranslateX = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const trackW = track.scrollWidth;
    const viewW = window.innerWidth;
    const maxShift = trackW - viewW;
    if (maxShift <= 0) return 0;

    if (direction === 'left-to-right') {
      return -(maxShift * progress);
    } else {
      return -(maxShift * (1 - progress));
    }
  };

  // Mobile layout — swipeable horizontal scroll with snap
  if (isMobile) {
    return (
      <section className="py-16 bg-[#0a0a0a]">
        {/* Header */}
        <div className="px-5 mb-6">
          <h2 className="font-display text-2xl font-bold text-white italic mb-4">
            {studioName} Studio
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {items.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/20'
                  }`}
                />
              ))}
            </div>
            <Link
              to="/reservas"
              className="text-sm text-white/60 border border-white/15 px-4 py-1.5 rounded-full hover:bg-white/5 transition-colors"
            >
              Reservar
            </Link>
          </div>
        </div>

        {/* Swipeable track */}
        <div
          ref={mobileTrackRef}
          className="flex gap-4 px-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {items.map((item, i) => (
            <div key={i} className="flex-shrink-0 w-[75vw] snap-center">
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-4 text-5xl font-display font-bold text-white/15 leading-none select-none">
                  {item.number}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="font-display text-lg font-bold text-white mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Desktop layout — scroll-driven horizontal animation
  return (
    <div ref={wrapperRef} style={{ height: '300vh' }} className="relative">
      <div className="sticky top-0 h-screen flex flex-col justify-center bg-[#0a0a0a] overflow-hidden px-6 py-20 md:py-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 mb-10">
          <div className="flex items-center gap-6">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white italic whitespace-nowrap">
              {studioName} Studio
            </h2>
            <div className="flex-1 h-[2px] bg-white/10 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-white"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <Link
              to="/reservas"
              className="whitespace-nowrap bg-white text-black font-medium py-2.5 px-6 rounded-full text-sm transition-all duration-300 hover:bg-white/90"
            >
              Reservar sala
            </Link>
          </div>
        </div>

        {/* Carousel track */}
        <div
          ref={trackRef}
          className="flex gap-5 px-6 will-change-transform"
          style={{ transform: `translateX(${getTranslateX()}px)` }}
        >
          {items.map((item, i) => (
            <div key={i} className="flex-shrink-0 w-[35vw] lg:w-[30vw] relative group">
              <div className="relative overflow-hidden rounded-2xl aspect-[5/6]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 right-6 text-7xl md:text-8xl font-display font-bold text-white/15 leading-none select-none">
                  {item.number}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
