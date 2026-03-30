import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-black" aria-label="Hero">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/background.avif"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        {/* Logo */}
        <Link to="/" className="mb-16 block">
          <img
            src="/logo.png"
            alt="Lyx Studios"
            className="h-24 sm:h-28 md:h-32 w-auto mx-auto"
          />
        </Link>

        {/* Heading */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white mb-10">
          Elegante, Puro e<br />
          Visionário.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-xl leading-relaxed font-light mb-12">
          Três salas, uma experiência fluida: escolha simples, acesso discreto, tudo pronto à chegada.
        </p>

        {/* CTA */}
        <Link
          to="/reservas"
          className="inline-flex items-center gap-3 bg-white text-black font-semibold py-4 px-10 rounded-full text-sm tracking-wider uppercase transition-all duration-500 hover:bg-white/90"
        >
          Reservar
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-[float_3s_ease-in-out_infinite]">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
