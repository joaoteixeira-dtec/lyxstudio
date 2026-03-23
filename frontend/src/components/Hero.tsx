import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-[#0a0a0a]" aria-label="Hero">
      {/* Abstract dark background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />
        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#e2ff00]/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Grain texture */}
      <div className="grain" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <div className="stagger-children">
          {/* Accent tag */}
          <div className="mb-8">
            <span className="inline-block px-4 py-1.5 text-xs uppercase tracking-[0.4em] text-[#e2ff00]/80 font-medium border border-[#e2ff00]/20 rounded-full">
              Estúdios Profissionais
            </span>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="font-display font-bold leading-none">
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tight text-white">
                LYX
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tight text-[#e2ff00] glow-text mt-1">
                STUDIO
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="mb-12">
            <p className="text-lg sm:text-xl md:text-2xl text-white/40 max-w-2xl leading-relaxed font-light">
              Três salas. Um som. A tua visão ganha vida aqui.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              to="/reservas"
              className="btn-magnetic inline-flex items-center gap-3 bg-[#e2ff00] text-black font-semibold py-4 px-10 rounded-lg text-sm tracking-wider uppercase transition-all duration-500 hover:shadow-[0_0_40px_rgba(226,255,0,0.25)]"
            >
              Agendar Sessão
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/contactos"
              className="inline-flex items-center gap-3 border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-medium py-4 px-10 rounded-lg text-sm tracking-wider uppercase transition-all duration-500"
            >
              Contactar
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-[float_3s_ease-in-out_infinite]">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
