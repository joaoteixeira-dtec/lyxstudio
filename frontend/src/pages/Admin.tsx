import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import {
  getBookings,
  updateBookingStatus,
  getBlackouts,
  createBlackout,
  deleteBlackout,
  type Booking,
  type Blackout,
} from '../services/api';
import AdminLogin from './AdminLogin';

export default function Admin() {
  const { t } = useTranslation();
  const { token, isAdmin, logout } = useAuth();
  const { addToast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blackouts, setBlackoutsList] = useState<Blackout[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingBlackouts, setLoadingBlackouts] = useState(false);

  // Blackout form
  const [blDateFrom, setBlDateFrom] = useState('');
  const [blDateTo, setBlDateTo] = useState('');
  const [blReason, setBlReason] = useState('');

  const loadBookings = useCallback(async () => {
    if (!token) return;
    setLoadingBookings(true);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch {
      addToast('Erro ao carregar reservas.', 'error');
    } finally {
      setLoadingBookings(false);
    }
  }, [token, addToast]);

  const loadBlackouts = useCallback(async () => {
    if (!token) return;
    setLoadingBlackouts(true);
    try {
      const data = await getBlackouts(token);
      setBlackoutsList(data);
    } catch {
      addToast('Erro ao carregar blackouts.', 'error');
    } finally {
      setLoadingBlackouts(false);
    }
  }, [token, addToast]);

  useEffect(() => {
    if (isAdmin) {
      loadBookings();
      loadBlackouts();
    }
  }, [isAdmin, loadBookings, loadBlackouts]);

  const handleStatusChange = async (id: number, status: string) => {
    if (!token) return;
    try {
      await updateBookingStatus(id, status, token);
      addToast('Estado atualizado!', 'success');
      loadBookings();
    } catch (err: any) {
      addToast(err.message || 'Erro ao atualizar.', 'error');
    }
  };

  const handleAddBlackout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await createBlackout({ date_from: blDateFrom, date_to: blDateTo, reason: blReason }, token);
      addToast('Datas bloqueadas!', 'success');
      setBlDateFrom('');
      setBlDateTo('');
      setBlReason('');
      loadBlackouts();
    } catch (err: any) {
      addToast(err.message || 'Erro ao bloquear datas.', 'error');
    }
  };

  const handleDeleteBlackout = async (id: number) => {
    if (!token) return;
    try {
      await deleteBlackout(id, token);
      addToast('Blackout removido.', 'success');
      loadBlackouts();
    } catch (err: any) {
      addToast(err.message || 'Erro ao remover.', 'error');
    }
  };

  if (!isAdmin) {
    return <AdminLogin />;
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <main className="page-enter py-20 md:py-24 bg-stone-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-amber-600 font-medium block mb-2">Dashboard</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              {t('admin.title')}
            </h1>
          </div>
          <button
            onClick={logout}
            className="px-5 py-2.5 text-sm bg-white hover:bg-stone-100 text-stone-600 rounded-xl transition-all duration-300 border border-stone-200 shadow-sm"
          >
            {t('admin.logout')}
          </button>
        </div>

        {/* === Bookings === */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">{t('admin.bookings_title')}</h2>

          {loadingBookings ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-20 w-full rounded-xl" />)}
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-stone-500">{t('admin.no_bookings')}</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="card-hover bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-stone-900">{b.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[b.status]}`}>
                          {t(`reservations.status_${b.status}`)}
                        </span>
                      </div>
                      <p className="text-sm text-stone-500">
                        {b.check_in} → {b.check_out} · {b.guests} hóspedes
                      </p>
                      <p className="text-sm text-stone-500">{b.email} · {b.phone}</p>
                      {b.notes && <p className="text-sm text-stone-400 italic">{b.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <label htmlFor={`status-${b.id}`} className="sr-only">{t('admin.status_change')}</label>
                      <select
                        id={`status-${b.id}`}
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className="px-3 py-1.5 text-sm border border-stone-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="pending">{t('reservations.status_pending')}</option>
                        <option value="confirmed">{t('reservations.status_confirmed')}</option>
                        <option value="cancelled">{t('reservations.status_cancelled')}</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* === Blackouts === */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">{t('admin.blackouts_title')}</h2>

          {/* Add blackout form */}
          <form onSubmit={handleAddBlackout} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 mb-8">
            <h3 className="font-semibold text-stone-800 mb-4">{t('admin.add_blackout')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="bl-from" className="block text-sm font-medium text-stone-700 mb-1">
                  {t('admin.date_from')}
                </label>
                <input
                  id="bl-from"
                  type="date"
                  value={blDateFrom}
                  onChange={(e) => setBlDateFrom(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="bl-to" className="block text-sm font-medium text-stone-700 mb-1">
                  {t('admin.date_to')}
                </label>
                <input
                  id="bl-to"
                  type="date"
                  value={blDateTo}
                  onChange={(e) => setBlDateTo(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="bl-reason" className="block text-sm font-medium text-stone-700 mb-1">
                  {t('admin.reason')}
                </label>
                <input
                  id="bl-reason"
                  type="text"
                  value={blReason}
                  onChange={(e) => setBlReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-5 bg-stone-900 hover:bg-stone-800 text-white font-medium px-8 py-2.5 rounded-xl transition-all duration-300 text-sm tracking-wide"
            >
              {t('admin.save')}
            </button>
          </form>

          {/* Blackout list */}
          {loadingBlackouts ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <div key={i} className="skeleton h-16 w-full rounded-xl" />)}
            </div>
          ) : blackouts.length === 0 ? (
            <p className="text-stone-500">{t('admin.no_blackouts')}</p>
          ) : (
            <div className="space-y-3">
              {blackouts.map((bl) => (
                <div key={bl.id} className="card-hover bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-stone-800">
                      {bl.date_from} → {bl.date_to}
                    </p>
                    {bl.reason && <p className="text-sm text-stone-500">{bl.reason}</p>}
                  </div>
                  <button
                    onClick={() => handleDeleteBlackout(bl.id)}
                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    {t('admin.delete')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
