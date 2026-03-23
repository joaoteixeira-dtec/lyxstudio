import { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import AnimateOnScroll from '../components/AnimateOnScroll';
import { getAvailability, createBooking, type CreateBookingData } from '../services/api';
import { useToast } from '../components/Toast';

const studios = [
  { id: 'studio-a', name: 'Studio A', subtitle: 'Gravação', price: '25€/h' },
  { id: 'studio-b', name: 'Studio B', subtitle: 'Produção', price: '20€/h' },
  { id: 'studio-c', name: 'Studio C', subtitle: 'Ensaio', price: '15€/h' },
];

export default function Reservations() {
  const { addToast } = useToast();
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedStudio, setSelectedStudio] = useState('studio-a');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadAvailability();
  }, []);

  async function loadAvailability() {
    try {
      setLoading(true);
      const data = await getAvailability();
      setUnavailableDates(data.unavailable_dates);
    } catch {
      addToast('Erro ao carregar disponibilidade.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleDateSelect = (ci: string, co: string) => {
    setCheckIn(ci);
    setCheckOut(co);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      addToast('Seleciona as datas no calendário.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const studioLabel = studios.find(s => s.id === selectedStudio)?.name || selectedStudio;
      const data: CreateBookingData = {
        check_in: checkIn,
        check_out: checkOut,
        guests,
        name,
        email,
        phone,
        notes: `[${studioLabel}] ${notes}`.trim(),
      };
      await createBooking(data);
      addToast('Agendamento submetido com sucesso! Entraremos em contacto brevemente.', 'success');
      setCheckIn('');
      setCheckOut('');
      setGuests(1);
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
      loadAvailability();
    } catch (err: any) {
      addToast(err.message || 'Erro ao submeter agendamento.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:bg-white/10 focus:border-[#e2ff00]/50 focus:ring-2 focus:ring-[#e2ff00]/20 text-sm transition-all duration-300 outline-none";

  return (
    <main className="page-enter bg-[#0a0a0a]">
      {/* Page Header */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e2ff00]/[0.02] rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 text-center px-4">
          <span className="inline-block text-xs uppercase tracking-[0.4em] text-[#e2ff00]/60 font-medium mb-4">
            Agenda a tua sessão
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            Reservar Estúdio
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        {/* Studio Selection */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-12">
            <h2 className="font-display text-xl font-semibold text-white mb-4">Escolhe o estúdio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {studios.map((studio) => (
                <button
                  key={studio.id}
                  onClick={() => setSelectedStudio(studio.id)}
                  className={`text-left p-5 rounded-xl border transition-all duration-300 ${
                    selectedStudio === studio.id
                      ? 'border-[#e2ff00]/50 bg-[#e2ff00]/5'
                      : 'border-white/5 bg-[#111] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs uppercase tracking-wider font-medium ${
                      selectedStudio === studio.id ? 'text-[#e2ff00]' : 'text-white/30'
                    }`}>
                      {studio.subtitle}
                    </span>
                    <span className={`text-lg font-display font-bold ${
                      selectedStudio === studio.id ? 'text-[#e2ff00]' : 'text-white/50'
                    }`}>
                      {studio.price}
                    </span>
                  </div>
                  <h3 className={`font-display text-lg font-semibold ${
                    selectedStudio === studio.id ? 'text-white' : 'text-white/60'
                  }`}>
                    {studio.name}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calendar */}
          <AnimateOnScroll animation="fade-right">
            <div>
              <h2 className="font-display text-xl font-semibold text-white mb-4">Disponibilidade</h2>
              {loading ? (
                <div className="skeleton h-80 w-full rounded-2xl" />
              ) : (
                <Calendar
                  unavailableDates={unavailableDates}
                  onSelectRange={handleDateSelect}
                  selectedCheckIn={checkIn}
                  selectedCheckOut={checkOut}
                />
              )}
            </div>
          </AnimateOnScroll>

          {/* Form */}
          <AnimateOnScroll animation="fade-left" delay={100}>
            <div>
              <h2 className="font-display text-xl font-semibold text-white mb-4">Dados da reserva</h2>
              <form onSubmit={handleSubmit} className="space-y-5 bg-[#111] rounded-2xl border border-white/5 p-6">
                {/* Dates display */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="check_in" className="block text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
                      Data início
                    </label>
                    <input
                      id="check_in"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="check_out" className="block text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
                      Data fim
                    </label>
                    <input
                      id="check_out"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="guests" className="block text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
                    Nº de pessoas
                  </label>
                  <input
                    id="guests"
                    type="number"
                    min={1}
                    max={20}
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    required
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
                    Nome completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
                    Telefone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
                    Notas / pedidos especiais
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className={inputClasses}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-magnetic w-full bg-[#e2ff00] hover:bg-[#d4ef00] disabled:bg-white/10 disabled:text-white/30 text-black font-semibold py-3.5 rounded-xl transition-all duration-300 text-sm tracking-wider uppercase"
                >
                  {submitting ? 'A enviar...' : 'Confirmar Agendamento'}
                </button>
              </form>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
