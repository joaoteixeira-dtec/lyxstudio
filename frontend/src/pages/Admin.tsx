import { useState, useEffect, useCallback } from 'react';
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
    pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    confirmed: 'bg-green-500/10 text-green-400 border border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
  };

  const inputClasses = "w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:border-[#e2ff00]/50 focus:ring-1 focus:ring-[#e2ff00]/30 outline-none";

  return (
    <main className="page-enter py-20 md:py-24 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#e2ff00]/60 font-medium block mb-2">Dashboard</span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Painel de Administração
            </h1>
          </div>
          <button
            onClick={logout}
            className="px-5 py-2.5 text-sm bg-white/5 hover:bg-white/10 text-white/60 rounded-xl transition-all duration-300 border border-white/10"
          >
            Sair
          </button>
        </div>

        {/* === Bookings === */}
        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold text-white mb-6">Agendamentos</h2>

          {loadingBookings ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-20 w-full rounded-xl" />)}
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-white/40">Sem agendamentos.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="card-hover bg-[#111] rounded-2xl border border-white/5 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white">{b.name}</h3>
                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[b.status]}`}>
                          {statusLabels[b.status]}
                        </span>
                      </div>
                      <p className="text-sm text-white/40">
                        {b.check_in} → {b.check_out} · {b.guests} pessoa(s)
                      </p>
                      <p className="text-sm text-white/40">{b.email} · {b.phone}</p>
                      {b.notes && <p className="text-sm text-white/25 italic">{b.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <label htmlFor={`status-${b.id}`} className="sr-only">Alterar estado</label>
                      <select
                        id={`status-${b.id}`}
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className="px-3 py-1.5 text-sm border border-white/10 bg-white/5 text-white rounded-lg focus:border-[#e2ff00]/50 focus:ring-1 focus:ring-[#e2ff00]/30 outline-none"
                      >
                        <option value="pending">Pendente</option>
                        <option value="confirmed">Confirmada</option>
                        <option value="cancelled">Cancelada</option>
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
          <h2 className="font-display text-2xl font-bold text-white mb-6">Datas Bloqueadas</h2>

          {/* Add blackout form */}
          <form onSubmit={handleAddBlackout} className="bg-[#111] rounded-2xl border border-white/5 p-6 mb-8">
            <h3 className="font-semibold text-white mb-4">Bloquear datas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="bl-from" className="block text-sm font-medium text-white/50 mb-1">De</label>
                <input
                  id="bl-from"
                  type="date"
                  value={blDateFrom}
                  onChange={(e) => setBlDateFrom(e.target.value)}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="bl-to" className="block text-sm font-medium text-white/50 mb-1">Até</label>
                <input
                  id="bl-to"
                  type="date"
                  value={blDateTo}
                  onChange={(e) => setBlDateTo(e.target.value)}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="bl-reason" className="block text-sm font-medium text-white/50 mb-1">Motivo</label>
                <input
                  id="bl-reason"
                  type="text"
                  value={blReason}
                  onChange={(e) => setBlReason(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-5 bg-[#e2ff00] hover:bg-[#d4ef00] text-black font-semibold px-8 py-2.5 rounded-xl transition-all duration-300 text-sm tracking-wide"
            >
              Guardar
            </button>
          </form>

          {/* Blackout list */}
          {loadingBlackouts ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <div key={i} className="skeleton h-16 w-full rounded-xl" />)}
            </div>
          ) : blackouts.length === 0 ? (
            <p className="text-white/40">Sem datas bloqueadas.</p>
          ) : (
            <div className="space-y-3">
              {blackouts.map((bl) => (
                <div key={bl.id} className="card-hover bg-[#111] rounded-2xl border border-white/5 p-5 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">
                      {bl.date_from} → {bl.date_to}
                    </p>
                    {bl.reason && <p className="text-sm text-white/40">{bl.reason}</p>}
                  </div>
                  <button
                    onClick={() => handleDeleteBlackout(bl.id)}
                    className="px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    Remover
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
