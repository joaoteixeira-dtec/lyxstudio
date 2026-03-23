import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Calendar from '../components/Calendar';
import AnimateOnScroll from '../components/AnimateOnScroll';
import { getAvailability, createBooking, type CreateBookingData } from '../services/api';
import { useToast } from '../components/Toast';

const ASSET_BASE = '/assets';

export default function Reservations() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
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
      addToast(t('common.error'), 'error');
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
      addToast('Selecione as datas no calendário.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const data: CreateBookingData = {
        check_in: checkIn,
        check_out: checkOut,
        guests,
        name,
        email,
        phone,
        notes,
      };
      await createBooking(data);
      addToast(t('reservations.success'), 'success');
      // Reset form
      setCheckIn('');
      setCheckOut('');
      setGuests(2);
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
      loadAvailability();
    } catch (err: any) {
      addToast(err.message || t('reservations.error'), 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm transition-all duration-300 outline-none";

  return (
    <main className="page-enter">
      {/* Page Hero Banner */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <img
          src={`${ASSET_BASE}/images/exterior/exterior-06.jpg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-12 text-center text-white px-4">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-300/80 font-medium mb-3">Casa do Posto das Marés</span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold">
            {t('reservations.title')}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Calendar */}
          <AnimateOnScroll animation="fade-right">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">{t('reservations.calendar_title')}</h2>
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

              {/* Payment placeholder */}
              <div className="mt-8 bg-blue-50/80 border border-blue-200/60 rounded-2xl p-5 backdrop-blur-sm">
                <p className="text-sm text-blue-600 font-light">
                  💳 {t('reservations.payment_note')}
                </p>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Form */}
          <AnimateOnScroll animation="fade-left" delay={100}>
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">{t('reservations.form_title')}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Dates display */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="check_in" className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                      {t('reservations.check_in')}
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
                    <label htmlFor="check_out" className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                      {t('reservations.check_out')}
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
                  <label htmlFor="guests" className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                    {t('reservations.guests')}
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
                  <label htmlFor="name" className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                    {t('reservations.name')}
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
                  <label htmlFor="email" className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                    {t('reservations.email')}
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
                  <label htmlFor="phone" className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                    {t('reservations.phone')}
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
                  <label htmlFor="notes" className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                    {t('reservations.notes')}
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
                  className="btn-magnetic w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-medium py-3.5 rounded-xl transition-all duration-300 text-sm tracking-wider uppercase shadow-lg shadow-stone-900/10 hover:shadow-stone-900/20"
                >
                  {submitting ? t('reservations.submitting') : t('reservations.submit')}
                </button>
              </form>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
