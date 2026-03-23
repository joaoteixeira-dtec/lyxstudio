import { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import { getAvailability, createBooking, type CreateBookingData } from '../services/api';
import { useToast } from '../components/Toast';

const rooms = [
  { id: 'veludo', name: 'Veludo' },
  { id: 'obsidiana', name: 'Obsidiana' },
  { id: 'eclipse', name: 'Eclipse' },
  { id: 'espaco-completo', name: 'Espaço Completo' },
];

const timeSlots = ['14:00', '16:00', '18:00', '20:00', '22:00', '00:00'];

export default function Reservations() {
  const { addToast } = useToast();
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Selection state
  const [selectedRoom, setSelectedRoom] = useState('veludo');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [fullDay, setFullDay] = useState(false);
  const [multiDay, setMultiDay] = useState(false);

  // Contact modal
  const [showContactForm, setShowContactForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    loadAvailability();
  }, []);

  useEffect(() => {
    if (fullDay) {
      setSelectedSlots([...timeSlots]);
    }
  }, [fullDay]);

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

  const toggleSlot = (slot: string) => {
    if (fullDay) return;
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot],
    );
  };

  const handleReservar = () => {
    const hasDate = multiDay ? selectedDates.length > 0 : !!selectedDate;
    if (!hasDate) {
      addToast('Seleciona uma data no calendário.', 'error');
      return;
    }
    if (selectedSlots.length === 0) {
      addToast('Seleciona pelo menos um horário.', 'error');
      return;
    }
    setShowContactForm(true);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const room = rooms.find((r) => r.id === selectedRoom)?.name || selectedRoom;
      const slots = selectedSlots.sort().join(', ');
      const dates = multiDay ? selectedDates.sort() : [selectedDate];

      const data: CreateBookingData = {
        check_in: dates[0],
        check_out: dates[dates.length - 1] || dates[0],
        guests: 1,
        name,
        email,
        phone,
        notes: `[${room}] Horários: ${slots}${fullDay ? ' (dia completo)' : ''}`,
      };
      await createBooking(data);
      addToast('Reserva submetida com sucesso! Receberás a confirmação por e-mail.', 'success');
      setSelectedDate('');
      setSelectedDates([]);
      setSelectedSlots([]);
      setFullDay(false);
      setMultiDay(false);
      setName('');
      setEmail('');
      setPhone('');
      setShowContactForm(false);
      loadAvailability();
    } catch (err: any) {
      addToast(err.message || 'Erro ao submeter reserva.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const activeDate = multiDay
    ? selectedDates.length > 0
      ? selectedDates.sort()[selectedDates.length - 1]
      : ''
    : selectedDate;

  const formatSelectedDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('pt-PT', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <main className="page-enter bg-[#0a0a0a] min-h-screen">
      {/* Header */}
      <div className="pt-32 pb-12 text-center px-4">
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white uppercase tracking-tight mb-8">
          Reservas
        </h1>
        <div className="space-y-1.5 text-white/35 text-sm tracking-wide">
          <p>Escolhe a sala pretendida</p>
          <p>Seleciona a data e hora</p>
          <p>Recebe a confirmação e todas as informações no e-mail</p>
        </div>
      </div>

      {/* Booking Widget */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-28">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c0c] overflow-hidden">
          {/* ── Room Tabs ── */}
          <div className="flex border-b border-white/[0.06]">
            {rooms.map((room, i) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`
                  flex-1 flex items-center justify-between gap-2 px-4 sm:px-5 py-4 text-sm transition-all
                  ${i < rooms.length - 1 ? 'border-r border-white/[0.06]' : ''}
                  ${selectedRoom === room.id ? 'text-white bg-white/[0.02]' : 'text-white/30 hover:text-white/45 hover:bg-white/[0.01]'}
                `}
              >
                <span className="font-medium truncate">{room.name}</span>
                <span
                  className={`w-3 h-3 rounded-full flex-shrink-0 border transition-all ${
                    selectedRoom === room.id
                      ? 'border-white/60 bg-white'
                      : 'border-white/15'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* ── Calendar ── */}
          {loading ? (
            <div className="skeleton h-[420px] w-full" />
          ) : (
            <Calendar
              unavailableDates={unavailableDates}
              onSelectDate={setSelectedDate}
              selectedDate={selectedDate}
              multiDay={multiDay}
              selectedDates={selectedDates}
              onSelectMultiple={setSelectedDates}
            />
          )}

          {/* ── Details Strip ── */}
          <div className="grid grid-cols-3 border-t border-white/[0.06]">
            <div className="px-4 sm:px-5 py-4 border-r border-white/[0.06]">
              <span className="text-[10px] uppercase tracking-widest text-white/25 block mb-1">Sala</span>
              <span className="text-sm text-white font-medium">
                {rooms.find((r) => r.id === selectedRoom)?.name}
              </span>
            </div>
            <div className="px-4 sm:px-5 py-4 border-r border-white/[0.06]">
              <span className="text-[10px] uppercase tracking-widest text-white/25 block mb-1">Data</span>
              <span className="text-sm text-white font-medium">{formatSelectedDate(activeDate)}</span>
            </div>
            <div className="px-4 sm:px-5 py-4">
              <span className="text-[10px] uppercase tracking-widest text-white/25 block mb-1">Disponibilidade</span>
              <span className="text-sm text-white font-medium">Sujeita a confirmação</span>
            </div>
          </div>

          {/* ── Options & Time Slots ── */}
          <div className="px-4 sm:px-5 py-5 border-t border-white/[0.06] space-y-5">
            {/* Checkboxes */}
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={fullDay}
                  onChange={(e) => setFullDay(e.target.checked)}
                  className="w-3.5 h-3.5 rounded-[3px] border border-white/20 bg-transparent accent-white cursor-pointer"
                />
                <span className="text-xs text-white/45">Reservar dia completo</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={multiDay}
                  onChange={(e) => {
                    setMultiDay(e.target.checked);
                    if (!e.target.checked) setSelectedDates([]);
                  }}
                  className="w-3.5 h-3.5 rounded-[3px] border border-white/20 bg-transparent accent-white cursor-pointer"
                />
                <span className="text-xs text-white/45">Reservar vários dias</span>
              </label>
            </div>

            {/* Time slots */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {timeSlots.map((slot) => {
                const active = selectedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    onClick={() => toggleSlot(slot)}
                    disabled={fullDay}
                    className={`
                      flex items-center gap-2 text-xs transition-all
                      ${active ? 'text-white' : 'text-white/30 hover:text-white/50'}
                      ${fullDay ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <span
                      className={`w-[6px] h-[6px] rounded-full transition-colors ${
                        active ? 'bg-white' : 'bg-white/25'
                      }`}
                    />
                    {slot}
                  </button>
                );
              })}
            </div>

            {/* Reservar button */}
            <div className="pt-1">
              <button
                onClick={handleReservar}
                className="px-7 py-2 text-xs font-medium border border-white/15 text-white/80 rounded-md hover:bg-white/[0.04] hover:border-white/25 hover:text-white transition-all tracking-wide"
              >
                Reservar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact Modal ── */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-md animate-in">
            <h2 className="font-display text-xl font-semibold text-white mb-1">Dados de contacto</h2>
            <p className="text-xs text-white/30 mb-6">Preenche os teus dados para confirmar a reserva.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="r-name" className="block text-[11px] uppercase tracking-widest text-white/35 mb-1.5">
                  Nome completo
                </label>
                <input
                  id="r-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm placeholder-white/15 focus:border-white/25 outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="r-email" className="block text-[11px] uppercase tracking-widest text-white/35 mb-1.5">
                  Email
                </label>
                <input
                  id="r-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm placeholder-white/15 focus:border-white/25 outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="r-phone" className="block text-[11px] uppercase tracking-widest text-white/35 mb-1.5">
                  Telefone
                </label>
                <input
                  id="r-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm placeholder-white/15 focus:border-white/25 outline-none transition-all"
                />
              </div>
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-2.5 text-sm text-white/35 border border-white/10 rounded-lg hover:bg-white/5 hover:text-white/50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 text-sm font-medium bg-white text-black rounded-lg hover:bg-white/90 disabled:opacity-40 transition-all"
                >
                  {submitting ? 'A enviar...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
