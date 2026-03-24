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

export default function ScrollCarousel({ studioName, items, direction }: ScrollCarouselProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const wrapperH = wrapper.offsetHeight;
    const viewH = window.innerHeight;

    // scrollable distance = wrapper height - viewport height (the sticky travel)
    const scrollable = wrapperH - viewH;
    if (scrollable <= 0) return;

    // How far the top of the wrapper has scrolled past the top of the viewport
    const scrolled = -rect.top;
    const raw = Math.max(0, Math.min(1, scrolled / scrollable));
    setProgress(raw);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, [updateProgress]);

  // Calculate how far the track needs to translate
  const getTranslateX = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const trackW = track.scrollWidth;
    const viewW = window.innerWidth;
    const maxShift = trackW - viewW;
    if (maxShift <= 0) return 0;

    if (direction === 'left-to-right') {
      // Start from left (showing first items), move to show last items
      return -(maxShift * progress);
    } else {
      // Start from right (showing last items), move to show first items
      return -(maxShift * (1 - progress));
    }
  };

  return (
    // Tall wrapper — its height creates the "scroll runway" for the pinned section
    <div ref={wrapperRef} style={{ height: '300vh' }} className="relative">
      {/* Sticky container — pins to viewport while wrapper scrolls */}
      <div className="sticky top-0 h-screen flex flex-col justify-center bg-[#0a0a0a] overflow-hidden">
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
            <div key={i} className="flex-shrink-0 w-[45vw] md:w-[35vw] lg:w-[30vw] relative group">
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Number overlay */}
                <span className="absolute top-4 right-6 text-7xl md:text-8xl font-display font-bold text-white/15 leading-none select-none">
                  {item.number}
                </span>
                {/* Text overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
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
