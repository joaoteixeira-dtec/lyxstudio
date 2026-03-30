import { useState, useEffect } from 'react';
import { getSettings } from '../services/api';
import { useToast } from '../components/Toast';
import { pushAudit } from './auditStore';

interface Props { token: string }

const STUDIOS_DEFAULT = [
  {
    id: 'A',
    name: 'Studio A',
    description: 'Estúdio com vista para o mar, capacidade para 4 hóspedes.',
    capacity: 4,
    area: '45m²',
    amenities: ['WiFi', 'Ar condicionado', 'Cozinha equipada', 'Varanda'],
    active: true,
  },
  {
    id: 'B',
    name: 'Studio B',
    description: 'Estúdio aconchegante, ideal para casais ou pequenas famílias.',
    capacity: 2,
    area: '32m²',
    amenities: ['WiFi', 'Ar condicionado', 'Kitchenette', 'Jardim'],
    active: true,
  },
  {
    id: 'C',
    name: 'Studio C',
    description: 'O maior estúdio, perfeito para grupos ou estadias longas.',
    capacity: 6,
    area: '65m²',
    amenities: ['WiFi', 'Ar condicionado', 'Cozinha equipada', 'Terraço', 'Estacionamento'],
    active: false,
  },
];

const inputCls = 'w-full px-3 py-2.5 bg-[#161616] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#e2ff00]/30 focus:ring-1 focus:ring-[#e2ff00]/10 outline-none transition-all placeholder-[#444]';

// ── Studio card ──────────────────────────────────────────────────────────────
function StudioCard({ studio, onSave }: { studio: typeof STUDIOS_DEFAULT[0]; onSave: (s: typeof STUDIOS_DEFAULT[0]) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...studio });
  const [amenityInput, setAmenityInput] = useState('');
  const { addToast } = useToast();

  const save = () => {
    onSave(form);
    setEditing(false);
    pushAudit('Studio atualizado', `${form.name} alterado`, 'Configurações', 'info');
    addToast(`${form.name} guardado!`, 'success');
  };

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setForm((f) => ({ ...f, amenities: [...f.amenities, amenityInput.trim()] }));
      setAmenityInput('');
    }
  };

  const removeAmenity = (a: string) => {
    setForm((f) => ({ ...f, amenities: f.amenities.filter((x) => x !== a) }));
  };

  return (
    <div className={`bg-[#111111] border rounded-2xl overflow-hidden transition-all duration-300 ${form.active ? 'border-white/[0.08]' : 'border-white/[0.04] opacity-70'}`}>
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-display font-bold text-sm ${form.active ? 'bg-[#e2ff00]/10 text-[#e2ff00]' : 'bg-white/[0.04] text-[#555]'}`}>
            {studio.id}
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{form.name}</p>
            <p className="text-[11px] text-[#555]">{form.area} · {form.capacity} hóspedes max.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle active */}
          <button
            onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
            className={`relative w-10 h-6 rounded-full transition-colors duration-300 ${form.active ? 'bg-[#e2ff00]' : 'bg-[#2a2a2a]'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-[#0a0a0a] transition-transform duration-300 ${form.active ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
          <button
            onClick={() => (editing ? save() : setEditing(true))}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${editing ? 'bg-[#e2ff00] text-[#0a0a0a] hover:bg-[#d4f000]' : 'bg-white/[0.04] text-[#888] hover:text-white hover:bg-white/[0.08]'}`}
          >
            {editing ? 'Guardar' : 'Editar'}
          </button>
          {editing && (
            <button onClick={() => { setForm({ ...studio }); setEditing(false); }} className="px-3 py-1.5 rounded-lg text-xs text-[#666] hover:text-white transition-colors">
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {editing ? (
          <>
            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Nome</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Descrição</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className={`${inputCls} resize-none`} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Capacidade</label>
                <input type="number" min={1} max={20} value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: +e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Área</label>
                <input value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))} className={inputCls} placeholder="Ex: 45m²" />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider mb-2 block">Comodidades</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.amenities.map((a) => (
                  <span key={a} className="flex items-center gap-1 text-xs bg-white/[0.04] text-[#888] px-2.5 py-1 rounded-full border border-white/[0.06]">
                    {a}
                    <button onClick={() => removeAmenity(a)} className="hover:text-red-400 transition-colors">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  placeholder="Adicionar comodidade..."
                  className={`${inputCls} flex-1`}
                />
                <button onClick={addAmenity} className="px-3 py-2 rounded-xl bg-white/[0.04] text-[#888] hover:text-white transition-colors text-sm">+</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-[#777]">{form.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {form.amenities.map((a) => (
                <span key={a} className="text-[11px] bg-white/[0.03] text-[#666] px-2 py-0.5 rounded-full border border-white/[0.05]">{a}</span>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${form.active ? 'bg-green-400' : 'bg-[#444]'}`} />
              <span className="text-xs text-[#555]">{form.active ? 'Ativo' : 'Inativo'}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Settings({ token }: Props) {
  const { addToast } = useToast();
  const [tab, setTab] = useState<'studios' | 'general' | 'account'>('studios');
  const [studios, setStudios] = useState(STUDIOS_DEFAULT);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loadingSettings, setLoadingSettings] = useState(false);

  // General settings form
  const [checkin, setCheckin] = useState('15:00');
  const [checkout, setCheckout] = useState('11:00');
  const [minStay, setMinStay] = useState('2');
  const [maxGuests, setMaxGuests] = useState('6');
  const [contactEmail, setContactEmail] = useState('info@lyxstudios.pt');
  const [contactPhone, setContactPhone] = useState('+351 900 000 000');
  const [savingGeneral, setSavingGeneral] = useState(false);

  // Account form
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [savingPwd, setSavingPwd] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (tab === 'general') {
      setLoadingSettings(true);
      getSettings()
        .then((s) => {
          setSettings(s);
          if (s.checkin_time)  setCheckin(s.checkin_time);
          if (s.checkout_time) setCheckout(s.checkout_time);
          if (s.contact_email) setContactEmail(s.contact_email);
          if (s.contact_phone) setContactPhone(s.contact_phone);
        })
        .catch(() => {})
        .finally(() => setLoadingSettings(false));
    }
  }, [tab]);

  const updateStudio = (updated: typeof STUDIOS_DEFAULT[0]) => {
    setStudios((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const saveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGeneral(true);
    setTimeout(() => {
      pushAudit('Configurações gerais guardadas', `Check-in: ${checkin}, Check-out: ${checkout}`, 'Configurações', 'success');
      addToast('Configurações guardadas! (simulado)', 'success');
      setSavingGeneral(false);
    }, 800);
  };

  const savePwd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPwd || !newPwd || !confirmPwd) { addToast('Preenche todos os campos.', 'error'); return; }
    if (newPwd !== confirmPwd) { addToast('As passwords não coincidem.', 'error'); return; }
    if (newPwd.length < 8) { addToast('Password deve ter pelo menos 8 caracteres.', 'error'); return; }
    setSavingPwd(true);
    setTimeout(() => {
      pushAudit('Password alterada', 'Password de administrador atualizada', 'Configurações', 'warning');
      addToast('Password atualizada! (simulado)', 'success');
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
      setSavingPwd(false);
    }, 1000);
  };

  const EyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      {showPwd
        ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      }
    </svg>
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-screen-lg">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Configurações</h1>
        <p className="text-sm text-[#555] mt-1">Gestão de estudios, parâmetros e conta</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#111] border border-white/[0.06] rounded-xl p-1 w-fit">
        {([['studios', 'Estudios'], ['general', 'Geral'], ['account', 'Conta']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-[#e2ff00]/10 text-[#e2ff00]' : 'text-[#666] hover:text-[#ccc]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Studios tab */}
      {tab === 'studios' && (
        <div className="grid md:grid-cols-3 gap-5">
          {studios.map((s) => (
            <StudioCard key={s.id} studio={s} onSave={updateStudio} />
          ))}
        </div>
      )}

      {/* General tab */}
      {tab === 'general' && (
        <form onSubmit={saveGeneral} className="bg-[#111111] border border-white/[0.06] rounded-2xl p-6 space-y-6 max-w-lg">
          <div>
            <h2 className="font-display font-semibold text-white text-sm mb-4">Horários</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Check-in</label>
                <input type="time" value={checkin} onChange={(e) => setCheckin(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Check-out</label>
                <input type="time" value={checkout} onChange={(e) => setCheckout(e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-5">
            <h2 className="font-display font-semibold text-white text-sm mb-4">Regras de Reserva</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Estadia Mínima (noites)</label>
                <input type="number" min={1} value={minStay} onChange={(e) => setMinStay(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Máx. Hóspedes</label>
                <input type="number" min={1} value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-5">
            <h2 className="font-display font-semibold text-white text-sm mb-4">Contacto</h2>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Email</label>
                <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Telefone</label>
                <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          {loadingSettings && <p className="text-xs text-[#555]">A carregar configurações do servidor...</p>}

          <button
            type="submit"
            disabled={savingGeneral}
            className="w-full py-2.5 rounded-xl bg-[#e2ff00] text-[#0a0a0a] font-bold text-sm hover:bg-[#d4f000] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {savingGeneral
              ? <><div className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />A guardar...</>
              : 'Guardar Configurações'}
          </button>
        </form>
      )}

      {/* Account tab */}
      {tab === 'account' && (
        <div className="space-y-5 max-w-lg">
          {/* Info card */}
          <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#e2ff00]/10 border border-[#e2ff00]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#e2ff00] font-display font-bold text-xl">A</span>
            </div>
            <div>
              <p className="font-semibold text-white">Administrador</p>
              <p className="text-sm text-[#555]">admin@lyx.pt</p>
              <p className="text-xs text-[#444] mt-1">Administrador principal · Acesso total</p>
            </div>
          </div>

          {/* Change password */}
          <form onSubmit={savePwd} className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 space-y-4">
            <h2 className="font-display font-semibold text-white text-sm mb-2">Alterar Password</h2>
            {[
              { label: 'Password Atual', value: currentPwd, setter: setCurrentPwd, placeholder: '••••••••' },
              { label: 'Nova Password', value: newPwd, setter: setNewPwd, placeholder: 'Mín. 8 caracteres' },
              { label: 'Confirmar Nova Password', value: confirmPwd, setter: setConfirmPwd, placeholder: '••••••••' },
            ].map(({ label, value, setter, placeholder }) => (
              <div key={label}>
                <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">{label}</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className={`${inputCls} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"
                  >
                    <EyeIcon />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="submit"
              disabled={savingPwd}
              className="w-full py-2.5 mt-1 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white font-semibold text-sm hover:bg-white/[0.1] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {savingPwd
                ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />A guardar...</>
                : 'Atualizar Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
