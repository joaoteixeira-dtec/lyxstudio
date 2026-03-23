import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import AnimateOnScroll from '../components/AnimateOnScroll';

const studios = [
  {
    id: 'studio-a',
    name: 'Studio A',
    subtitle: 'Gravação',
    description: 'Sala principal de gravação profissional com tratamento acústico premium e equipamento de alta qualidade.',
    features: ['Tratamento acústico', 'Microfones pro', 'Isolamento total'],
    price: '25€/h',
    accent: '#e2ff00',
  },
  {
    id: 'studio-b',
    name: 'Studio B',
    subtitle: 'Produção',
    description: 'Estúdio de produção e mixing equipado com monitores de referência e workstation completa.',
    features: ['Monitores referência', 'DAW completo', 'Plugins premium'],
    price: '20€/h',
    accent: '#e2ff00',
  },
  {
    id: 'studio-c',
    name: 'Studio C',
    subtitle: 'Ensaio',
    description: 'Sala de ensaio ampla com backline incluído, perfeita para bandas e sessões em grupo.',
    features: ['Backline incluído', 'PA system', 'Espaço amplo'],
    price: '15€/h',
    accent: '#e2ff00',
  },
];

export default function Home() {
  return (
    <main className="page-enter">
      {/* Hero */}
      <Hero />

      {/* Studios Section */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] relative">
        {/* Background glow */}
        <div className="absolute top-0 left-0 right-0 accent-line" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-20">
              <span className="inline-block text-xs uppercase tracking-[0.4em] text-[#e2ff00]/60 font-medium mb-4">
                Os Nossos Espaços
              </span>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
                Três Studios.<br />
                <span className="text-white/30">Um standard.</span>
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studios.map((studio, i) => (
              <AnimateOnScroll key={studio.id} animation="fade-up" delay={i * 150}>
                <div className="studio-card group bg-[#111] rounded-2xl border border-white/5 p-8 h-full flex flex-col">
                  {/* Studio letter */}
                  <div className="mb-6">
                    <span className="text-6xl font-display font-bold text-white/[0.03] group-hover:text-[#e2ff00]/10 transition-colors duration-500 block leading-none">
                      {studio.name.split(' ')[1]}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#e2ff00]/60 font-medium">
                      {studio.subtitle}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-white mt-1 mb-3">
                      {studio.name}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-6">
                      {studio.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-8">
                      {studio.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-white/50">
                          <span className="w-1 h-1 rounded-full bg-[#e2ff00]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-2xl font-display font-bold text-white">
                      {studio.price}
                    </span>
                    <Link
                      to="/reservas"
                      className="text-xs uppercase tracking-wider text-[#e2ff00]/70 hover:text-[#e2ff00] transition-colors font-medium"
                    >
                      Agendar →
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
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
