import { Link } from 'react-router-dom';
import { useState } from 'react';
import Hero from '../components/Hero';
import AnimateOnScroll from '../components/AnimateOnScroll';
import ScrollCarousel from '../components/ScrollCarousel';

const veludo = [
  { image: '/studio1.jpeg', title: 'Cabeceira Luminosa', description: 'Cabeceira em veludo com luz ambiente difusa para um mood elegante.', number: '01' },
  { image: '/studio2.jpeg', title: 'Cama & Têxteis Premium', description: 'Lençóis de algodão egípcio e manta pesada para conforto absoluto.', number: '02' },
  { image: '/studio3.jpeg', title: 'Iluminação Regulável', description: 'Candeeiros de parede e dimmer para ajustar a intensidade em segundos.', number: '03' },
  { image: '/studio4.jpeg', title: 'Som & Silêncio', description: 'Isolamento acústico discreto e som ambiente para foco total.', number: '04' },
  { image: '/studio5.jpeg', title: 'Higiene Selada', description: 'Amenidades individuais seladas sobre bandeja, tudo pronto e seguro.', number: '05' },
];

const obsidiana = [
  { image: '/studio6.jpeg', title: 'Mobiliário Modular', description: 'Banco estofado e módulos versáteis para diferentes configurações.', number: '01' },
  { image: '/studio7.jpeg', title: 'Pontos De Fixação Discretos', description: 'Fixações integradas e invisíveis quando não usadas.', number: '02' },
  { image: '/studio8.jpeg', title: 'Luz Por Zonas', description: 'Trilhos de luz independentes para criar cenários distintos.', number: '03' },
  { image: '/studio9.jpeg', title: 'Cabeceira Luminosa', description: 'Cabeceira em veludo com luz ambiente difusa para um mood elegante.', number: '04' },
  { image: '/studio10.jpeg', title: 'Higiene Selada', description: 'Amenidades individuais seladas sobre bandeja, tudo pronto e seguro.', number: '05' },
];

const eclipse = [
  { image: '/studio11.jpeg', title: 'Mobiliário Modular', description: 'Banco estofado e módulos versáteis para diferentes configurações.', number: '01' },
  { image: '/studio12.jpeg', title: 'Pontos De Fixação Discretos', description: 'Fixações integradas e invisíveis quando não usadas.', number: '02' },
  { image: '/studio13.jpeg', title: 'Luz Por Zonas', description: 'Trilhos de luz independentes para criar cenários distintos.', number: '03' },
  { image: '/studio14.jpeg', title: 'Cabeceira Luminosa', description: 'Cabeceira em veludo com luz ambiente difusa para um mood elegante.', number: '04' },
  { image: '/studio1.jpeg', title: 'Cabeceira Luminosa', description: 'Cabeceira em veludo com luz ambiente difusa para um mood elegante.', number: '05' },
];

export default function Home() {
  return (
    <main className="page-enter">
      {/* Hero */}
      <Hero />

      {/* Section 2 — Reserva. Vive. */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] relative" style={{ minHeight: '80vh' }}>
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

      {/* Veludo Studio Carousel — left to right */}
      <ScrollCarousel studioName="Veludo" items={veludo} direction="left-to-right" />

      {/* Obsidiana Studio Carousel — right to left */}
      <ScrollCarousel studioName="Obsidiana" items={obsidiana} direction="right-to-left" />

      {/* Eclipse Studio Carousel — left to right */}
      <ScrollCarousel studioName="Eclipse" items={eclipse} direction="left-to-right" />

      {/* Atreves-te Section */}
      <section className="py-24 md:py-32 bg-[#0a0a0a]" style={{ minHeight: '80vh' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

            {/* Left — Image with label */}
            <AnimateOnScroll animation="fade-up">
              <div className="relative">
                <img
                  src="/dmn.webp"
                  alt="Dominação"
                  className="w-full max-w-md mx-auto rounded-2xl object-cover aspect-[3/4]"
                />
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="bg-white text-black text-center font-semibold text-sm uppercase tracking-wider py-4 rounded-b-2xl">
                    Dominação
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Right — Text */}
            <AnimateOnScroll animation="fade-up" delay={150}>
              <div>
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white italic leading-tight tracking-tight mb-8">
                  ATREVES-TE?
                </h2>
                <p className="text-white/70 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
                  Espaços privados, higienizados e totalmente insonorizados. Reserva discreta. Não adies o desejo, escolhe a tua sala e garante a tua sessão.
                </p>
                <div className="text-white/40 text-sm leading-loose text-right">
                  <p>Privacidade total · Acesso discreto</p>
                  <p>Limpeza rigorosa entre reservas</p>
                  <p>Pagamento simples e seguro</p>
                </div>
              </div>
            </AnimateOnScroll>

          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <FaqSection />
    </main>
  );
}

const faqs = [
  {
    question: 'O Que Está Incluído Nas Salas?',
    answer: [
      'Veludo: cama queen com têxteis premium, iluminação regulável, mobiliário selecionado, climatização, insonorização, coluna bluetooth, kit de higienização.',
      'Obsidiana: mobiliário modular/props, fundos neutros, luz de apoio, climatização, insonorização, coluna bluetooth.',
      'Eclipse: fundo verde "infinito", luz contínua regulável, suportes para câmera/teleprompter, climatização e insonorização.',
      'Check-in autónomo, limpeza completa e troca de têxteis entre reservas.',
    ],
  },
  {
    question: 'Posso Alugar O Espaço Todo?',
    answer: [
      'Sim. Espaço Completo (os três estúdios) mediante disponibilidade.',
      'Ideal para produções, eventos privados ou sessões longas.',
      'Mínimo recomendado: 3 horas. Preço sob consulta.',
      'Equipamentos extra (luz/câmera/props específicos) disponíveis por pedido.',
    ],
  },
  {
    question: 'Tenho Privacidade Assegurada?',
    answer: [
      'Acesso discreto e check-in autónomo.',
      'Sem câmaras dentro das salas (apenas CCTV em zonas comuns por segurança).',
      'Salas insonorizadas e portas com fecho.',
      'A equipa só entra entre reservas. Faturação e comunicação discretas.',
    ],
  },
  {
    question: 'Qual O Máximo De Pessoas Em Cada Sala?',
    answer: [
      'Veludo: até 3 pessoas.',
      'Obsidiana: até 4 pessoas.',
      'Eclipse: até 6 pessoas (produção/conteúdo).',
      'Limites definidos por conforto, segurança e ruído. Grupos maiores: pedir autorização prévia.',
    ],
  },
  {
    question: 'Quais São As Regras?',
    answer: [
      '18+ e consentimento explícito entre todas as pessoas; define limites e safe word.',
      'Higiene: usar os têxteis fornecidos; avisar se houver derrames/danos.',
      'Proibido: fumo, fogo, substâncias ilegais, líquidos/óleos que manchem, glitter/confettis.',
      'Respeito pelo espaço: não fixar nada nas paredes; não retirar equipamento sem autorização.',
      'Horários: check-in/check-out pontuais; excedentes podem ter custo adicional.',
      'Remarcações: gratuitas até 24h antes (salvo no-shows). Danos serão cobrados.',
    ],
  },
];

function FaqItem({ question, answer }: { question: string; answer: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left cursor-pointer"
      >
        <span className="text-lg sm:text-xl text-white/50 font-medium pr-4">
          {question}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-white/40 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${open ? 'max-h-[600px] pb-6' : 'max-h-0'}`}
      >
        <div className="bg-[#151515] rounded-2xl p-6 sm:p-8 space-y-4">
          {answer.map((line, i) => (
            <p key={i} className="text-white/40 text-base leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqSection() {
  return (
    <section className="py-24 md:py-32 bg-[#0a0a0a]" style={{ minHeight: '80vh' }}>
      <div className="max-w-3xl mx-auto px-6 sm:px-10">
        <AnimateOnScroll animation="fade-up">
          <div className="text-center mb-16">
            <span className="inline-block px-5 py-2 text-xs uppercase tracking-[0.3em] text-white/60 font-medium border border-white/10 rounded-full mb-6">
              Tudo o que precisas de saber:
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white italic tracking-tight">
              Perguntas Essenciais:
            </h2>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={100}>
          <div>
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
