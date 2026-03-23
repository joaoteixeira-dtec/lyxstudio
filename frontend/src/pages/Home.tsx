import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import AnimateOnScroll from '../components/AnimateOnScroll';

export default function Home() {
  return (
    <main className="page-enter">
      {/* Hero */}
      <Hero />

      {/* Section 2 — Reserva. Vive. */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">

            {/* Left column — Text */}
            <div>
              <AnimateOnScroll animation="fade-up">
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span className="text-sm text-white/80 tracking-wide">LYX Studios</span>
                </div>

                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-16">
                  Reserva. Vive.<br />
                  Sem perguntas.
                </h2>
              </AnimateOnScroll>

              <AnimateOnScroll animation="fade-up" delay={100}>
                <div className="mb-12">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    Privado, higienizado, insonorizado
                  </h3>
                  <p className="text-white/40 text-base leading-relaxed max-w-lg">
                    Do suave ao intenso, os nossos studios proporcionam um cenário seguro e estético para explorar. Discreto, higienizado e fácil de usar, da entrada à saída.
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll animation="fade-up" delay={200}>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    Marcação rápida, acesso discreto, pagamento simples.
                  </h3>
                  <p className="text-white/40 text-base leading-relaxed max-w-lg">
                    Três salas, três intensidades. Marca em minutos, recebe o acesso no teu email e vive a experiência num espaço pensado ao detalhe
                  </p>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Right column — Image + Card */}
            <div className="relative">
              <AnimateOnScroll animation="fade-up" delay={150}>
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src="/bed.avif"
                    alt="Suite LYX Studios"
                    className="w-full h-[500px] lg:h-[600px] object-cover"
                  />
                </div>

                {/* Como Agendar card */}
                <div className="bg-white text-black rounded-2xl p-8 mt-[-80px] mx-4 sm:mx-8 relative z-10 shadow-2xl">
                  <h4 className="text-xl font-bold text-center mb-4 uppercase tracking-wide">
                    Como Agendar
                  </h4>
                  <p className="text-center text-sm text-black/70 leading-relaxed mb-6">
                    Escolhe a sala e a duração. Marca no calendário e confirma o pagamento. Recebe o código de acesso seguro por email. Entra, usa e sai. A limpeza é imediata após a sessão.
                  </p>
                  <Link
                    to="/reservas"
                    className="block w-full bg-black text-white text-center font-semibold py-4 rounded-full text-sm tracking-wider uppercase transition-all duration-300 hover:bg-black/80"
                  >
                    Ver disponibilidade
                  </Link>
                </div>
              </AnimateOnScroll>
            </div>

          </div>
        </div>
      </section>

      {/* Features / Why Section */}
      <section className="py-24 md:py-32 bg-[#080808] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#e2ff00]/[0.02] rounded-full blur-[100px] translate-x-1/2" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.4em] text-[#e2ff00]/60 font-medium mb-4">
                Porquê LYX Studio
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                Feito para criar.<br />
                <span className="text-white/30">Sem compromissos.</span>
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: '🎛️', title: 'Equipamento Pro', desc: 'Microfones, pré-amps e monitores de nível profissional em todas as salas.' },
              { icon: '🔇', title: 'Isolamento Total', desc: 'Tratamento acústico profissional para um som limpo sem interferências.' },
              { icon: '⚡', title: 'Reserva Rápida', desc: 'Agenda online em tempo real. Escolhe a sala, o horário e confirma em segundos.' },
              { icon: '🕐', title: 'Horário Flexível', desc: 'Disponibilidade alargada, incluindo fins de semana e horários noturnos.' },
            ].map((item, i) => (
              <AnimateOnScroll key={i} animation="fade-up" delay={i * 100}>
                <div className="card-hover flex gap-5 bg-[#111] rounded-xl border border-white/5 p-6 group cursor-default">
                  <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] relative">
        <div className="accent-line w-full absolute top-0" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AnimateOnScroll animation="fade-up">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Pronto para gravar?
            </h2>
            <p className="text-white/40 text-lg mb-10 font-light">
              Escolhe o teu estúdio e reserva a tua sessão em poucos cliques.
            </p>
            <Link
              to="/reservas"
              className="btn-magnetic inline-flex items-center gap-3 bg-[#e2ff00] text-black font-semibold py-4 px-12 rounded-lg text-sm tracking-wider uppercase transition-all duration-500"
            >
              Ver Disponibilidade
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  );
}
