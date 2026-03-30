import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Dashboard from './Dashboard';
import Bookings from './Bookings';
import Availability from './Availability';
import Emails from './Emails';
import Settings from './Settings';
import Audit from './Audit';

export type Section = 'dashboard' | 'bookings' | 'availability' | 'emails' | 'settings' | 'audit';

// ── Icons ──────────────────────────────────────────────────────────────────
const Ic = {
  logo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  bookings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M9 16l2 2 4-4" />
    </svg>
  ),
  availability: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  ),
  emails: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
      <rect x="2" y="5" width="20" height="14" rx="2" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  audit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  chevronLeft: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  chevronRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
};

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Ic.dashboard },
  { id: 'bookings', label: 'Reservas', icon: Ic.bookings },
  { id: 'availability', label: 'Disponibilidades', icon: Ic.availability },
  { id: 'emails', label: 'Emails', icon: Ic.emails },
  { id: 'settings', label: 'Configurações', icon: Ic.settings },
  { id: 'audit', label: 'Auditoria', icon: Ic.audit },
];

// ── Sidebar ────────────────────────────────────────────────────────────────
interface SidebarProps {
  collapsed: boolean;
  active: Section;
  onNavigate: (s: Section) => void;
  onToggle: () => void;
  onLogout: () => void;
}

function Sidebar({ collapsed, active, onNavigate, onToggle, onLogout }: SidebarProps) {
  return (
    <aside
      className="flex flex-col border-r border-white/[0.06] bg-[#0e0e0e] relative z-20 flex-shrink-0"
      style={{ width: collapsed ? 64 : 240, transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)' }}
    >
      {/* Brand */}
      <div className="flex items-center px-4 border-b border-white/[0.06]" style={{ height: 64 }}>
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo mark — matches Navbar: LYX white + S yellow */}
          <div
            className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#0e0e0e] border border-white/[0.08] flex items-center justify-center"
            style={{ boxShadow: '0 0 16px rgba(226,255,0,0.15)' }}
          >
            <span className="font-display font-black text-xs leading-none tracking-tighter select-none">
              <span className="text-white">L</span><span className="text-[#e2ff00]">S</span>
            </span>
          </div>
          <div
            className="overflow-hidden whitespace-nowrap"
            style={{
              maxWidth: collapsed ? 0 : 200,
              opacity: collapsed ? 0 : 1,
              transition: 'max-width 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease',
            }}
          >
            <p className="font-display font-bold text-sm leading-tight tracking-tight">
              <span className="text-white">LYX</span>
              <span className="text-[#e2ff00]"> STUDIO</span>
            </p>
            <p className="text-[10px] text-[#555] leading-tight">Backoffice</p>
          </div>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[52px] w-6 h-6 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-[#666] hover:text-[#e2ff00] hover:border-[#e2ff00]/30 transition-all duration-200 z-30"
        title={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        <div className="w-3 h-3">{collapsed ? Ic.chevronRight : Ic.chevronLeft}</div>
      </button>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden scrollbar-none">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`
                w-full flex items-center gap-3 rounded-xl transition-all duration-200 relative group
                ${collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'}
                ${isActive
                  ? 'bg-[#e2ff00]/10 text-[#e2ff00]'
                  : 'text-[#666] hover:text-[#ccc] hover:bg-white/[0.04]'}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#e2ff00] rounded-r-full" />
              )}
              <div
                className={`w-[18px] h-[18px] flex-shrink-0 transition-transform duration-200 ${!isActive ? 'group-hover:scale-110' : ''}`}
              >
                {item.icon}
              </div>
              <span
                className="text-sm font-medium overflow-hidden whitespace-nowrap"
                style={{
                  maxWidth: collapsed ? 0 : 160,
                  opacity: collapsed ? 0 : 1,
                  transition: 'max-width 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease',
                }}
              >
                {item.label}
              </span>
              {item.badge && !collapsed && (
                <span className="ml-auto text-[10px] font-bold bg-[#e2ff00]/20 text-[#e2ff00] px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-2 py-3 border-t border-white/[0.06] space-y-0.5">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.03] mb-1">
            <div className="w-7 h-7 rounded-full bg-[#e2ff00]/15 border border-[#e2ff00]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#e2ff00] text-xs font-bold">A</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white/80 truncate">Administrador</p>
              <p className="text-[10px] text-[#555] truncate">admin@lyx.pt</p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          title={collapsed ? 'Terminar sessão' : undefined}
          className={`w-full flex items-center gap-3 rounded-xl py-2.5 text-[#666] hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-200 group ${collapsed ? 'justify-center px-0' : 'px-3'}`}
        >
          <div className="w-[18px] h-[18px] flex-shrink-0">{Ic.logout}</div>
          <span
            className="text-sm overflow-hidden whitespace-nowrap"
            style={{
              maxWidth: collapsed ? 0 : 160,
              opacity: collapsed ? 0 : 1,
              transition: 'max-width 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease',
            }}
          >
            Terminar sessão
          </span>
        </button>
      </div>
    </aside>
  );
}

// ── Main Layout ────────────────────────────────────────────────────────────
export default function AdminLayout() {
  const { token, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState<Section>('dashboard');
  const [sectionKey, setSectionKey] = useState(0);

  const navigate = (s: Section) => {
    setActive(s);
    setSectionKey((k) => k + 1);
  };

  const renderSection = () => {
    switch (active) {
      case 'dashboard':    return <Dashboard token={token!} />;
      case 'bookings':     return <Bookings token={token!} />;
      case 'availability': return <Availability token={token!} />;
      case 'emails':       return <Emails token={token!} />;
      case 'settings':     return <Settings token={token!} />;
      case 'audit':        return <Audit />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        active={active}
        onNavigate={navigate}
        onToggle={() => setCollapsed((c) => !c)}
        onLogout={logout}
      />

      <main
        key={sectionKey}
        className="flex-1 overflow-y-auto overflow-x-hidden admin-section-enter"
        style={{ minWidth: 0 }}
      >
        {renderSection()}
      </main>
    </div>
  );
}
