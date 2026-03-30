import { useState, useEffect, useCallback } from 'react';
import { getBlackouts, createBlackout, deleteBlackout, getBookings, type Blackout, type Booking } from '../services/api';
import { useToast } from '../components/Toast';
import { pushAudit } from './auditStore';

interface Props { token: string }

const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DAYS_PT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function fmtDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Calendar Day ────────────────────────────────────────────────────────────
type DayState = 'available' | 'booked' | 'blocked' | 'today' | 'past';

function getDayState(date: Date, bookings: Booking[], blackouts: Blackout[]): DayState {
  const iso = isoDate(date);
  const today = isoDate(new Date());
  if (iso < today) return 'past';
  if (iso === today) return 'today';

  const isBlocked = blackouts.some((bl) => iso >= bl.date_from && iso <= bl.date_to);
  if (isBlocked) return 'blocked';

  const isBooked = bookings.some(
    (b) => b.status !== 'cancelled' && iso >= b.check_in && iso < b.check_out
  );
  if (isBooked) return 'booked';

  return 'available';
}

const DAY_STYLE: Record<DayState, string> = {
  available: 'text-white/70 hover:bg-[#e2ff00]/10 hover:text-[#e2ff00] cursor-pointer',
  booked:    'bg-amber-500/15 text-amber-300 border border-amber-500/20 cursor-default',
  blocked:   'bg-red-500/15 text-red-400 border border-red-500/20 cursor-default line-through',
  today:     'bg-[#e2ff00]/15 text-[#e2ff00] border border-[#e2ff00]/30 font-bold',
  past:      'text-white/20 cursor-default',
};

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Availability({ token }: Props) {
  const { addToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blackouts, setBlackouts] = useState<Blackout[]>([]);
  const [loading, setLoading] = useState(true);

  // Calendar state
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [activeStudio, setActiveStudio] = useState(0);

  // Blackout form
  const [blFrom, setBlFrom] = useState('');
  const [blTo, setBlTo] = useState('');
  const [blReason, setBlReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [bk, bl] = await Promise.all([getBookings(), getBlackouts(token)]);
      setBookings(bk);
      setBlackouts(bl);
    } catch {
      addToast('Erro ao carregar disponibilidades.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, addToast]);

  useEffect(() => { load(); }, [load]);

  // Calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const handleAddBlackout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blFrom || !blTo) { addToast('Preenche as datas.', 'error'); return; }
    if (blFrom > blTo) { addToast('Data "até" deve ser depois de "de".', 'error'); return; }
    setSubmitting(true);
    try {
      await createBlackout({ date_from: blFrom, date_to: blTo, reason: blReason || undefined }, token);
      pushAudit('Datas bloqueadas', `${blFrom} → ${blTo}${blReason ? ` (${blReason})` : ''}`, 'Disponibilidades', 'warning');
      addToast('Datas bloqueadas com sucesso!', 'success');
      setBlFrom(''); setBlTo(''); setBlReason('');
      load();
    } catch (err: any) {
      addToast(err.message || 'Erro ao bloquear datas.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteBlackout(id, token);
      pushAudit('Blackout removido', `ID: ${id.slice(0, 8)}`, 'Disponibilidades', 'info');
      addToast('Bloqueio removido.', 'success');
      load();
    } catch (err: any) {
      addToast(err.message || 'Erro ao remover.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const inputCls = 'w-full px-3 py-2.5 bg-[#161616] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#e2ff00]/30 focus:ring-1 focus:ring-[#e2ff00]/10 outline-none transition-all placeholder-[#444]';

  // Legend count
  const booked = bookings.filter((b) => b.status !== 'cancelled').length;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-screen-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Disponibilidades</h1>
          <p className="text-sm text-[#555] mt-1">Calendário de reservas e bloqueios</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#888] hover:text-white hover:bg-white/[0.08] transition-all text-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          Atualizar
        </button>
      </div>

      {/* Studio tabs */}
      <div className="flex gap-2">
        {['Todos os Estudios', 'Studio A', 'Studio B', 'Studio C'].map((s, i) => (
          <button
            key={s}
            onClick={() => setActiveStudio(i)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeStudio === i ? 'bg-[#e2ff00]/10 text-[#e2ff00] border border-[#e2ff00]/20' : 'bg-[#111] border border-white/[0.06] text-[#666] hover:text-[#ccc]'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-[#111111] border border-white/[0.06] rounded-2xl p-6">
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666] hover:text-white hover:bg-white/[0.06] transition-all">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <h2 className="font-display font-semibold text-white text-base">
              {MONTHS_PT[viewMonth]} {viewYear}
            </h2>
            <button onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666] hover:text-white hover:bg-white/[0.06] transition-all">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_PT.map((d) => (
              <div key={d} className="text-center text-[10px] font-semibold text-[#444] uppercase tracking-wider py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          {loading ? (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {cells.map((date, i) => {
                if (!date) return <div key={i} />;
                const state = getDayState(date, bookings, blackouts);
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all duration-150 ${DAY_STYLE[state]}`}
                    title={state === 'booked' ? 'Reservado' : state === 'blocked' ? 'Bloqueado' : ''}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-white/[0.06]">
            {[
              { label: 'Disponível', color: 'bg-white/10' },
              { label: 'Reservado', color: 'bg-amber-500/15 border border-amber-500/20' },
              { label: 'Bloqueado', color: 'bg-red-500/15 border border-red-500/20' },
              { label: 'Hoje', color: 'bg-[#e2ff00]/15 border border-[#e2ff00]/30' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-[#666]">
                <div className={`w-4 h-4 rounded ${color}`} />
                {label}
              </div>
            ))}
            <div className="ml-auto text-xs text-[#444]">{booked} reservas ativas</div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Add blackout form */}
          <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-red-500/20 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" className="w-3 h-3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </div>
              Bloquear Datas
            </h3>
            <form onSubmit={handleAddBlackout} className="space-y-3">
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1 block">De</label>
                <input type="date" value={blFrom} onChange={(e) => setBlFrom(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1 block">Até</label>
                <input type="date" value={blTo} onChange={(e) => setBlTo(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1 block">Motivo (opcional)</label>
                <input type="text" placeholder="Ex: Manutenção, uso pessoal..." value={blReason} onChange={(e) => setBlReason(e.target.value)} className={inputCls} />
              </div>
              <button
                type="submit"
                disabled={submitting || !blFrom || !blTo}
                className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? 'A bloquear...' : 'Bloquear Datas'}
              </button>
            </form>
          </div>

          {/* Blackout list */}
          <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center justify-between">
              Bloqueios Ativos
              <span className="text-[11px] font-bold bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">
                {blackouts.length}
              </span>
            </h3>
            {loading ? (
              <div className="space-y-2">
                {[1,2,3].map((i) => <div key={i} className="h-14 rounded-xl skeleton" />)}
              </div>
            ) : blackouts.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-[#444]">Sem bloqueios ativos</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {blackouts.map((bl) => (
                  <div key={bl.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] group hover:border-red-500/20 transition-all">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-red-400">
                        {fmtDate(bl.date_from)} → {fmtDate(bl.date_to)}
                      </p>
                      {bl.reason && <p className="text-[11px] text-[#555] mt-0.5 truncate">{bl.reason}</p>}
                    </div>
                    <button
                      onClick={() => handleDelete(bl.id)}
                      disabled={deletingId === bl.id}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-[#444] hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                    >
                      {deletingId === bl.id
                        ? <div className="w-3 h-3 border border-red-400/40 border-t-red-400 rounded-full animate-spin" />
                        : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>
                      }
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
