import { useState, useEffect, useCallback } from 'react';
import { getBookings, updateBookingStatus, type Booking } from '../services/api';
import { useToast } from '../components/Toast';
import { pushAudit } from './auditStore';

interface Props { token: string }

// ── Helpers ────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}
function diffDays(a: string, b: string) {
  return Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

const STATUS_CFG: Record<string, { label: string; pill: string; dot: string }> = {
  confirmed: { label: 'Confirmada', pill: 'bg-green-500/10 text-green-400 border-green-500/20', dot: 'bg-green-400' },
  pending:   { label: 'Pendente',   pill: 'bg-amber-500/10  text-amber-400  border-amber-500/20', dot: 'bg-amber-400' },
  cancelled: { label: 'Cancelada',  pill: 'bg-red-500/10   text-red-400   border-red-500/20', dot: 'bg-red-400' },
};

const STUDIOS = ['Todos', 'Studio A', 'Studio B', 'Studio C'];

// ── Status dropdown ─────────────────────────────────────────────────────────
function StatusDropdown({
  current, bookingId, token, onChanged,
}: { current: string; bookingId: string; token: string; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const cfg = STATUS_CFG[current] ?? STATUS_CFG.pending;

  const change = async (s: string) => {
    if (s === current) { setOpen(false); return; }
    setLoading(true);
    try {
      await updateBookingStatus(bookingId, s, token);
      pushAudit('Reserva atualizada', `#${bookingId.slice(0, 8)} → ${STATUS_CFG[s]?.label}`, 'Reservas', 'success');
      addToast('Estado atualizado!', 'success');
      onChanged();
    } catch (err: any) {
      addToast(err.message || 'Erro ao atualizar.', 'error');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 transition-all ${cfg.pill} hover:opacity-80`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${loading ? 'admin-pulse' : ''}`} />
        {cfg.label}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full mt-1 right-0 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-30 overflow-hidden w-36 admin-slide-left">
          {Object.entries(STATUS_CFG).map(([key, c]) => (
            <button
              key={key}
              onClick={() => change(key)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-white/[0.06] transition-colors text-left ${key === current ? 'text-white' : 'text-[#888]'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
              {c.label}
              {key === current && <svg className="ml-auto w-3 h-3 text-[#e2ff00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Detail panel ────────────────────────────────────────────────────────────
function DetailPanel({ booking, token, onClose, onRefresh }: { booking: Booking; token: string; onClose: () => void; onRefresh: () => void }) {
  const nights = diffDays(booking.check_in, booking.check_out);
  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-[#111111] border-l border-white/[0.06] h-full overflow-y-auto flex flex-col admin-slide-left">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div>
            <h2 className="font-display font-bold text-white text-lg">{booking.name}</h2>
            <p className="text-xs text-[#555] mt-0.5">#{booking.id.slice(0, 12)}...</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#666] hover:text-white transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-6 flex-1">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#666]">Estado</span>
            <StatusDropdown current={booking.status} bookingId={booking.id} token={token} onChanged={() => { onRefresh(); onClose(); }} />
          </div>
          {/* Dates */}
          <div className="bg-[#161616] rounded-2xl p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">Check-in</p>
              <p className="text-sm font-semibold text-white">{fmtDate(booking.check_in)}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">Check-out</p>
              <p className="text-sm font-semibold text-white">{fmtDate(booking.check_out)}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">Noites</p>
              <p className="text-sm font-semibold text-white">{nights}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">Hóspedes</p>
              <p className="text-sm font-semibold text-white">{booking.guests}</p>
            </div>
          </div>
          {/* Contact */}
          <div className="space-y-3">
            <p className="text-[10px] text-[#555] uppercase tracking-wider">Contacto</p>
            <div className="space-y-2">
              {[
                { label: 'Email', value: booking.email, icon: '✉' },
                { label: 'Telefone', value: booking.phone || '—', icon: '📞' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-sm">{icon}</span>
                  <div>
                    <p className="text-[10px] text-[#555]">{label}</p>
                    <p className="text-sm text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Notes */}
          {booking.notes && (
            <div className="space-y-2">
              <p className="text-[10px] text-[#555] uppercase tracking-wider">Notas</p>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-sm text-[#888]">
                {booking.notes}
              </div>
            </div>
          )}
          {/* Created at */}
          <p className="text-xs text-[#444]">
            Criada em {fmtDate(booking.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────
export default function Bookings({ token }: Props) {
  const { addToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [studioFilter, setStudioFilter] = useState('Todos');
  const [sortField, setSortField] = useState<keyof Booking>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<Booking | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch {
      addToast('Erro ao carregar reservas.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const sort = (field: keyof Booking) => {
    if (field === sortField) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }: { field: keyof Booking }) => (
    <svg className={`w-3 h-3 inline ml-1 transition-transform ${sortField === field && sortDir === 'desc' ? 'rotate-180' : ''} ${sortField !== field ? 'opacity-30' : 'text-[#e2ff00]'}`}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );

  // Filtered & sorted
  const filtered = bookings
    .filter((b) => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!b.name.toLowerCase().includes(q) && !b.email.toLowerCase().includes(q) && !b.id.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const av = a[sortField] as string;
      const bv = b[sortField] as string;
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = {
    all: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-screen-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Reservas</h1>
          <p className="text-sm text-[#555] mt-1">{bookings.length} reservas no total</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#888] hover:text-white hover:bg-white/[0.08] transition-all duration-200 text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          Atualizar
        </button>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Procurar por nome, email, ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2.5 bg-[#111] border border-white/[0.06] rounded-xl text-sm text-white placeholder-[#444] focus:border-[#e2ff00]/30 focus:ring-1 focus:ring-[#e2ff00]/20 outline-none transition-all"
          />
        </div>

        {/* Status tabs */}
        <div className="flex bg-[#111] border border-white/[0.06] rounded-xl p-1 gap-0.5">
          {Object.entries({ all: 'Todas', confirmed: 'Confirmadas', pending: 'Pendentes', cancelled: 'Canceladas' }).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setStatusFilter(key); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${statusFilter === key ? 'bg-[#e2ff00]/10 text-[#e2ff00]' : 'text-[#666] hover:text-[#ccc]'}`}
            >
              {label}
              <span className={`ml-1.5 text-[10px] ${statusFilter === key ? 'text-[#e2ff00]/60' : 'text-[#444]'}`}>
                {counts[key as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>

        {/* Studio filter */}
        <select
          value={studioFilter}
          onChange={(e) => setStudioFilter(e.target.value)}
          className="bg-[#111] border border-white/[0.06] rounded-xl px-3 py-2.5 text-xs text-[#888] focus:border-[#e2ff00]/30 outline-none"
        >
          {STUDIOS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="space-y-1 p-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 rounded-xl skeleton" />)}
          </div>
        ) : paged.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            </div>
            <p className="text-[#555] font-medium">Nenhuma reserva encontrada</p>
            <p className="text-xs text-[#444] mt-1">Tenta ajustar os filtros</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {[
                      ['name', 'Hóspede'],
                      ['check_in', 'Check-in'],
                      ['check_out', 'Check-out'],
                      ['guests', 'Hósp.'],
                      ['status', 'Estado'],
                      ['created_at', 'Criada'],
                    ].map(([field, label]) => (
                      <th
                        key={field}
                        onClick={() => sort(field as keyof Booking)}
                        className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#555] uppercase tracking-wider cursor-pointer hover:text-[#888] transition-colors select-none whitespace-nowrap"
                      >
                        {label}<SortIcon field={field as keyof Booking} />
                      </th>
                    ))}
                    <th className="px-5 py-3.5 text-right text-[11px] font-semibold text-[#555] uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((b, i) => (
                    <tr
                      key={b.id}
                      onClick={() => setSelected(b)}
                      className={`border-b last:border-0 border-white/[0.04] hover:bg-white/[0.02] cursor-pointer transition-colors group ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                            <span className="text-white/60 text-[11px] font-semibold">{b.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white group-hover:text-[#e2ff00] transition-colors">{b.name}</p>
                            <p className="text-[11px] text-[#555] truncate max-w-40">{b.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-[#888] whitespace-nowrap">{fmtDate(b.check_in)}</td>
                      <td className="px-5 py-3.5 text-sm text-[#888] whitespace-nowrap">{fmtDate(b.check_out)}</td>
                      <td className="px-5 py-3.5 text-sm text-[#666] text-center">{b.guests}</td>
                      <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <StatusDropdown current={b.status} bookingId={b.id} token={token} onChanged={load} />
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#555] whitespace-nowrap">{fmtDate(b.created_at)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelected(b); }}
                          className="text-[#555] hover:text-[#e2ff00] transition-colors"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]">
                <p className="text-xs text-[#555]">
                  A mostrar {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} de {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#666] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-default transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${p === page ? 'bg-[#e2ff00]/10 text-[#e2ff00]' : 'text-[#666] hover:text-white hover:bg-white/[0.06]'}`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#666] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-default transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <DetailPanel booking={selected} token={token} onClose={() => setSelected(null)} onRefresh={load} />
      )}
    </div>
  );
}
