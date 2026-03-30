import { useState, useEffect, useCallback } from 'react';
import { getBookings, type Booking } from '../services/api';
import { useToast } from '../components/Toast';

interface Props { token: string }

// ── Helpers ────────────────────────────────────────────────────────────────
const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function diffDays(a: string, b: string) {
  return Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

function isUpcoming(checkIn: string) {
  const d = new Date(checkIn);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const seven = new Date(now); seven.setDate(seven.getDate() + 7);
  return d >= now && d <= seven;
}

function fmtDate(iso: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Sub-components ─────────────────────────────────────────────────────────
const StatusPill = ({ status }: { status: string }) => {
  const cfg: Record<string, string> = {
    confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
    pending:   'bg-amber-500/10  text-amber-400  border-amber-500/20',
    cancelled: 'bg-red-500/10   text-red-400   border-red-500/20',
  };
  const labels: Record<string, string> = { confirmed: 'Confirmada', pending: 'Pendente', cancelled: 'Cancelada' };
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cfg[status] ?? 'bg-white/5 text-white/40 border-white/10'}`}>
      {labels[status] ?? status}
    </span>
  );
};

function StatCard({
  label, value, sub, color, icon, trend,
}: {
  label: string; value: string | number; sub?: string;
  color: string; icon: React.ReactNode; trend?: { value: string; up?: boolean };
}) {
  return (
    <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <div className="w-5 h-5">{icon}</div>
        </div>
        {trend && (
          <span className={`text-xs font-semibold flex items-center gap-1 ${trend.up ? 'text-green-400' : 'text-red-400'}`}>
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-white font-display mb-1 tabular-nums">{value}</div>
      <div className="text-sm text-[#666]">{label}</div>
      {sub && <div className="text-xs text-[#444] mt-0.5">{sub}</div>}
    </div>
  );
}

// SVG bar chart
function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1.5 h-28 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1 group">
          <div className="text-[10px] text-[#555] group-hover:text-[#888] transition-colors h-3 leading-none">
            {d.value > 0 ? d.value : ''}
          </div>
          <div className="w-full flex items-end" style={{ height: '88px' }}>
            <div
              className="w-full rounded-t-md bg-[#e2ff00]/20 group-hover:bg-[#e2ff00]/50 transition-all duration-300"
              style={{ height: `${Math.max((d.value / max) * 100, d.value > 0 ? 4 : 0)}%` }}
            />
          </div>
          <div className="text-[9px] text-[#444] group-hover:text-[#666] transition-colors">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

// Occupancy ring
function OccupancyRing({ pct }: { pct: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={r} fill="none" stroke="#1a1a1a" strokeWidth="8" />
      <circle
        cx="48" cy="48" r={r} fill="none"
        stroke="#e2ff00" strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform="rotate(-90 48 48)"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      <text x="48" y="53" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Space Grotesk, sans-serif">
        {pct}%
      </text>
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Dashboard({ token }: Props) {
  const { addToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch {
      addToast('Erro ao carregar dados do dashboard.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  // ── Computed stats ──────────────────────────────────────────────────────
  const total      = bookings.length;
  const confirmed  = bookings.filter((b) => b.status === 'confirmed').length;
  const pending    = bookings.filter((b) => b.status === 'pending').length;
  const cancelled  = bookings.filter((b) => b.status === 'cancelled').length;

  // Total guest nights (confirmed)
  const totalNights = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((acc, b) => acc + diffDays(b.check_in, b.check_out), 0);

  // Current month occupancy (nights booked / days in month)
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const bookedThisMonth = bookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    const ci = new Date(b.check_in);
    return ci.getFullYear() === now.getFullYear() && ci.getMonth() === now.getMonth();
  }).reduce((acc, b) => acc + diffDays(b.check_in, b.check_out), 0);
  const occupancy = Math.min(100, Math.round((bookedThisMonth / daysInMonth) * 100));

  // Upcoming check-ins
  const upcoming = bookings
    .filter((b) => b.status !== 'cancelled' && isUpcoming(b.check_in))
    .sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime())
    .slice(0, 6);

  // Monthly chart — last 12 months
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const count = bookings.filter((b) => {
      const ci = new Date(b.check_in);
      return ci.getFullYear() === d.getFullYear() && ci.getMonth() === d.getMonth();
    }).length;
    return { label: MONTHS_PT[d.getMonth()], value: count };
  });

  // Recent bookings
  const recent = [...bookings]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-[#111] rounded-2xl skeleton" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-64 bg-[#111] rounded-2xl skeleton" />
          <div className="h-64 bg-[#111] rounded-2xl skeleton" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-screen-xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-[#555] mt-1">
            {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#888] hover:text-white hover:bg-white/[0.08] transition-all duration-200 text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          Atualizar
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Reservas" value={total} sub="Todos os estados"
          color="bg-[#e2ff00]/10 text-[#e2ff00]"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>}
        />
        <StatCard
          label="Confirmadas" value={confirmed} sub={`${totalNights} noites`}
          color="bg-green-500/10 text-green-400"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>}
        />
        <StatCard
          label="Pendentes" value={pending} sub={pending > 0 ? 'Requerem ação' : 'Tudo em dia'}
          color="bg-amber-500/10 text-amber-400"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
        <StatCard
          label="Canceladas" value={cancelled} sub="Período total"
          color="bg-red-500/10 text-red-400"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
        />
      </div>

      {/* Middle row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-[#111111] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-semibold text-white text-base">Reservas por Mês</h2>
              <p className="text-xs text-[#555] mt-0.5">Últimos 12 meses</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#555]">
              <span className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#e2ff00]/20" />
                Reservas
              </span>
            </div>
          </div>
          <BarChart data={monthlyData} />
        </div>

        {/* Occupancy */}
        <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 flex flex-col items-center justify-center gap-3">
          <h2 className="font-display font-semibold text-white text-base self-start">Ocupação</h2>
          <p className="text-xs text-[#555] self-start -mt-2">Mês atual</p>
          <OccupancyRing pct={occupancy} />
          <p className="text-xs text-[#555] text-center">
            {bookedThisMonth} de {daysInMonth} noites reservadas
          </p>
          {/* Studio pills */}
          <div className="w-full space-y-2 mt-2">
            {['Studio A', 'Studio B', 'Studio C'].map((s, i) => (
              <div key={s} className="flex items-center justify-between text-xs">
                <span className="text-[#666]">{s}</span>
                <div className="flex-1 mx-3 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#e2ff00]/40 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(0, occupancy - i * 12)}%` }}
                  />
                </div>
                <span className="text-[#444] tabular-nums">{Math.max(0, occupancy - i * 12)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Upcoming check-ins */}
        <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-semibold text-white text-base">Próximos Check-ins</h2>
              <p className="text-xs text-[#555] mt-0.5">Próximos 7 dias</p>
            </div>
            {upcoming.length > 0 && (
              <span className="text-[11px] font-bold bg-[#e2ff00]/10 text-[#e2ff00] px-2 py-1 rounded-lg">
                {upcoming.length}
              </span>
            )}
          </div>
          {upcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[#444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
              </div>
              <p className="text-sm text-[#555]">Sem check-ins nos próximos 7 dias</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcoming.map((b) => {
                const daysUntil = Math.round((new Date(b.check_in).getTime() - Date.now()) / 86400000);
                return (
                  <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group">
                    <div className="w-9 h-9 rounded-xl bg-[#e2ff00]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#e2ff00] text-xs font-bold">{daysUntil === 0 ? 'HOJ' : `+${daysUntil}`}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{b.name}</p>
                      <p className="text-xs text-[#555] truncate">{fmtDate(b.check_in)} → {fmtDate(b.check_out)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-[#555]">{b.guests}p.</span>
                      <StatusPill status={b.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-semibold text-white text-base">Últimas Reservas</h2>
              <p className="text-xs text-[#555] mt-0.5">Mais recentes</p>
            </div>
          </div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-[#555]">Sem reservas registadas</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recent.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all">
                  <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 border border-white/[0.06]">
                    <span className="text-white/60 text-xs font-semibold">{b.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{b.name}</p>
                    <p className="text-xs text-[#555] truncate">{fmtDate(b.check_in)}</p>
                  </div>
                  <StatusPill status={b.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
