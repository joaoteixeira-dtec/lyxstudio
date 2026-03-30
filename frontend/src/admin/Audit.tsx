import { useState, useEffect } from 'react';
import { getAuditEntries, type AuditEntry } from './auditStore';

const SEVERITY_CFG: Record<AuditEntry['severity'], { pill: string; dot: string; icon: React.ReactNode }> = {
  success: {
    pill: 'bg-green-500/10 text-green-400 border-green-500/20',
    dot: 'bg-green-400',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>,
  },
  info: {
    pill: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dot: 'bg-blue-400',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  },
  warning: {
    pill: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dot: 'bg-amber-400',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
  error: {
    pill: 'bg-red-500/10 text-red-400 border-red-500/20',
    dot: 'bg-red-400',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  },
};

const ALL_SECTIONS = ['Todas', 'Auth', 'Reservas', 'Disponibilidades', 'Emails', 'Configurações'];

function fmtTime(d: Date) {
  return d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
function fmtDateTime(d: Date) {
  return d.toLocaleString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function Audit() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [sectionFilter, setSectionFilter] = useState('Todas');
  const [severityFilter, setSeverityFilter] = useState<AuditEntry['severity'] | 'all'>('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'timeline' | 'table'>('timeline');

  useEffect(() => {
    const refresh = () => setEntries(getAuditEntries());
    refresh();
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
  }, []);

  const filtered = entries.filter((e) => {
    if (sectionFilter !== 'Todas' && e.section !== sectionFilter) return false;
    if (severityFilter !== 'all' && e.severity !== severityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!e.action.toLowerCase().includes(q) && !e.detail.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const counts = {
    all: entries.length,
    success: entries.filter((e) => e.severity === 'success').length,
    info: entries.filter((e) => e.severity === 'info').length,
    warning: entries.filter((e) => e.severity === 'warning').length,
    error: entries.filter((e) => e.severity === 'error').length,
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-screen-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Auditoria</h1>
          <p className="text-sm text-[#555] mt-1">Registo de todas as ações desta sessão</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 admin-pulse" />
            <span className="text-xs font-medium text-green-400">Ao vivo</span>
          </div>
          {/* View toggle */}
          <div className="flex bg-[#111] border border-white/[0.06] rounded-xl p-1 gap-0.5">
            {(['timeline', 'table'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === v ? 'bg-[#e2ff00]/10 text-[#e2ff00]' : 'text-[#666] hover:text-[#ccc]'}`}
              >
                {v === 'timeline' ? 'Timeline' : 'Tabela'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { key: 'all', label: 'Total', color: 'text-white', bg: 'bg-white/[0.04]' },
          { key: 'success', label: 'Sucesso', color: 'text-green-400', bg: 'bg-green-500/10' },
          { key: 'info', label: 'Info', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { key: 'warning', label: 'Aviso', color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { key: 'error', label: 'Erro', color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map(({ key, label, color, bg }) => (
          <div key={key} className={`${bg} border border-white/[0.06] rounded-xl px-4 py-3 text-center cursor-pointer transition-all hover:border-white/10`}
            onClick={() => setSeverityFilter(key === 'all' ? 'all' : key as AuditEntry['severity'])}>
            <div className={`text-2xl font-bold font-display tabular-nums ${color}`}>
              {counts[key as keyof typeof counts]}
            </div>
            <div className="text-[11px] text-[#555] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 max-w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Procurar ação ou detalhe..."
            className="w-full pl-9 pr-3 py-2.5 bg-[#111] border border-white/[0.06] rounded-xl text-sm text-white placeholder-[#444] focus:border-[#e2ff00]/30 outline-none transition-all"
          />
        </div>
        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="bg-[#111] border border-white/[0.06] rounded-xl px-3 py-2.5 text-xs text-[#888] focus:border-[#e2ff00]/30 outline-none"
        >
          {ALL_SECTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        {(sectionFilter !== 'Todas' || severityFilter !== 'all' || search) && (
          <button
            onClick={() => { setSectionFilter('Todas'); setSeverityFilter('all'); setSearch(''); }}
            className="px-3 py-2 rounded-xl text-xs text-[#666] hover:text-white border border-white/[0.06] hover:border-white/10 transition-all"
          >
            Limpar filtros
          </button>
        )}
        <span className="text-xs text-[#444] self-center ml-auto">{filtered.length} entradas</span>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#111] border border-white/[0.06] rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <p className="text-[#555]">Nenhuma entrada encontrada</p>
        </div>
      ) : view === 'timeline' ? (
        <div className="space-y-2 relative">
          {/* Vertical line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-white/[0.04]" />
          {filtered.map((entry) => {
            const cfg = SEVERITY_CFG[entry.severity];
            return (
              <div key={entry.id} className="flex gap-4 group">
                {/* Icon */}
                <div className={`relative z-10 w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center border ${cfg.pill}`}>
                  {cfg.icon}
                </div>
                {/* Content */}
                <div className="flex-1 bg-[#111111] border border-white/[0.04] rounded-xl p-3.5 hover:border-white/[0.08] transition-all group-hover:bg-white/[0.02]">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-white">{entry.action}</p>
                      <p className="text-xs text-[#666] mt-0.5">{entry.detail}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] bg-white/[0.04] text-[#555] px-2 py-0.5 rounded-full border border-white/[0.06]">
                        {entry.section}
                      </span>
                      <span className="text-[11px] text-[#444] font-mono">{fmtTime(entry.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Estado', 'Ação', 'Detalhe', 'Secção', 'Hora'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#555] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => {
                const cfg = SEVERITY_CFG[entry.severity];
                return (
                  <tr
                    key={entry.id}
                    className={`border-b last:border-0 border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cfg.pill}`}>
                          {entry.severity}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-white whitespace-nowrap">{entry.action}</td>
                    <td className="px-5 py-3 text-xs text-[#666] max-w-xs truncate">{entry.detail}</td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] bg-white/[0.04] text-[#555] px-2 py-0.5 rounded-full border border-white/[0.06]">{entry.section}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-[#444] font-mono whitespace-nowrap">{fmtDateTime(entry.timestamp)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
