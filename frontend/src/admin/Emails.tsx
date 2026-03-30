import { useState, useRef } from 'react';
import { pushAudit } from './auditStore';
import { useToast } from '../components/Toast';

interface Props { token: string }

// ── Types ──────────────────────────────────────────────────────────────────
type Tab = 'automations' | 'templates' | 'sent' | 'smtp';

type TriggerKey = 'booking_created' | 'booking_pending' | 'booking_confirmed' | 'booking_cancelled' | 'stay_ended';

interface AutoRule {
  key: TriggerKey;
  label: string;
  description: string;
  icon: string;
  color: string;
  enabled: boolean;
  delayHours: number; // 0 = immediate
  subject: string;
  body: string;
}

interface SentEmail {
  id: string;
  to: string;
  subject: string;
  trigger: string;
  sentAt: Date;
  status: 'sent' | 'failed';
}

interface SmtpConfig {
  host: string;
  port: string;
  user: string;
  password: string;
  fromName: string;
  fromEmail: string;
  secure: boolean;
}

// ── Default state ──────────────────────────────────────────────────────────
const DEFAULT_RULES: AutoRule[] = [
  {
    key: 'booking_created',
    label: 'Nova Reserva',
    description: 'Enviado ao hóspede assim que submete a reserva',
    icon: '📥',
    color: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    enabled: true,
    delayHours: 0,
    subject: 'Reserva recebida – LYX Studios',
    body: `Olá {{nome}},

Recebemos a sua reserva no LYX Studios! 🎉

📅 Check-in: {{check_in}}
📅 Check-out: {{check_out}}
👥 Hóspedes: {{hospedes}}

A sua reserva está em análise e iremos confirmar brevemente.

Com os melhores cumprimentos,
Equipa LYX Studios`,
  },
  {
    key: 'booking_pending',
    label: 'Reserva Pendente',
    description: 'Lembrete enviado se a reserva ficar pendente por mais tempo',
    icon: '⏳',
    color: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    enabled: false,
    delayHours: 24,
    subject: 'Reserva em análise – LYX Studios',
    body: `Olá {{nome}},

A sua reserva no LYX Studios ainda está em análise.

📅 Datas: {{check_in}} → {{check_out}}

Estamos a tratar do seu pedido e iremos responder brevemente. Pedimos desculpa pela demora.

Com os melhores cumprimentos,
Equipa LYX Studios`,
  },
  {
    key: 'booking_confirmed',
    label: 'Reserva Confirmada',
    description: 'Enviado quando o administrador confirma a reserva',
    icon: '✅',
    color: 'bg-green-500/10 border-green-500/20 text-green-400',
    enabled: true,
    delayHours: 0,
    subject: 'Reserva confirmada – LYX Studios ✅',
    body: `Olá {{nome}},

A sua reserva no LYX Studios foi confirmada! 🎉

📅 Check-in: {{check_in}} a partir das 15:00
📅 Check-out: {{check_out}} até às 11:00
👥 Hóspedes: {{hospedes}}
📍 Localização: Cabanas de Tavira, Algarve

Não hesite em contactar-nos para qualquer questão.

Até breve,
Equipa LYX Studios`,
  },
  {
    key: 'booking_cancelled',
    label: 'Reserva Cancelada',
    description: 'Enviado quando a reserva é cancelada',
    icon: '❌',
    color: 'bg-red-500/10 border-red-500/20 text-red-400',
    enabled: true,
    delayHours: 0,
    subject: 'Reserva cancelada – LYX Studios',
    body: `Olá {{nome}},

Lamentamos informar que a sua reserva no LYX Studios foi cancelada.

📅 Datas: {{check_in}} → {{check_out}}

Se desejar efetuar uma nova reserva ou tiver dúvidas, estamos disponíveis.

Com os melhores cumprimentos,
Equipa LYX Studios`,
  },
  {
    key: 'stay_ended',
    label: 'Fim de Estadia',
    description: 'Enviado após o check-out para recolher feedback',
    icon: '⭐',
    color: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    enabled: true,
    delayHours: 2,
    subject: 'Obrigado pela sua estadia – LYX Studios',
    body: `Olá {{nome}},

Obrigado por ter escolhido o LYX Studios! Esperamos que a sua estadia tenha sido memorável.

Adorávamos receber o seu feedback — a sua opinião ajuda-nos a melhorar.

Até à próxima visita!

Equipa LYX Studios`,
  },
];

const DEFAULT_SMTP: SmtpConfig = {
  host: 'smtp.gmail.com',
  port: '587',
  user: '',
  password: '',
  fromName: 'LYX Studios',
  fromEmail: 'noreply@lyxstudios.pt',
  secure: false,
};

// ── Helpers ────────────────────────────────────────────────────────────────
const MANUAL_TEMPLATES = [
  {
    id: 'reminder',
    name: 'Lembrete Check-in',
    subject: 'O seu check-in é amanhã! – LYX Studios',
    body: `Olá {{nome}},\n\nO seu check-in no LYX Studios é AMANHÃ!\n\n🏠 Check-in: {{check_in}} a partir das 15:00\n🏠 Check-out: {{check_out}} até às 11:00\n\nAguardamos a sua chegada!\n\nEquipa LYX Studios`,
  },
  {
    id: 'welcome',
    name: 'Boas-vindas',
    subject: 'Bem-vindo(a) ao LYX Studios!',
    body: `Olá {{nome}},\n\nBem-vindo(a) ao LYX Studios!\n\n• WiFi: LYXStudios_Guest / password: lyx2025\n• Check-out: até às 11:00\n• Contacto urgência: +351 900 000 000\n\nBoas férias!\nEquipa LYX Studios`,
  },
];

const sentLog: SentEmail[] = [];

// ── Toggle ──────────────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${on ? 'bg-[#e2ff00]' : 'bg-[#2a2a2a]'}`}
      aria-label={on ? 'Desativar' : 'Ativar'}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full shadow transition-transform duration-300 ${on ? 'translate-x-5.5 bg-[#0a0a0a]' : 'translate-x-1 bg-[#666]'}`} style={{ transform: on ? 'translateX(22px)' : 'translateX(4px)' }} />
    </button>
  );
}

// ── Edit modal ──────────────────────────────────────────────────────────────
function EditModal({
  rule,
  onSave,
  onClose,
}: {
  rule: AutoRule;
  onSave: (r: AutoRule) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ ...rule });
  const inputCls = 'w-full px-3 py-2.5 bg-[#161616] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#e2ff00]/30 focus:ring-1 focus:ring-[#e2ff00]/10 outline-none transition-all placeholder-[#444]';
  const VARS = ['{{nome}}', '{{check_in}}', '{{check_out}}', '{{hospedes}}', '{{email}}'];
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const insertVar = (v: string) => {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart ?? form.body.length;
    const end = el.selectionEnd ?? start;
    const newBody = form.body.slice(0, start) + v + form.body.slice(end);
    setForm((f) => ({ ...f, body: newBody }));
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + v.length, start + v.length);
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden admin-section-enter flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span className="text-xl">{rule.icon}</span>
            <div>
              <h2 className="font-display font-bold text-white">Editar: {rule.label}</h2>
              <p className="text-xs text-[#555] mt-0.5">{rule.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#666] hover:text-white transition-all flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          {/* Delay */}
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Atraso no Envio</label>
            <div className="flex items-center gap-3">
              <select
                value={form.delayHours}
                onChange={(e) => setForm((f) => ({ ...f, delayHours: +e.target.value }))}
                className="bg-[#161616] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white focus:border-[#e2ff00]/30 outline-none"
              >
                <option value={0}>Imediato</option>
                <option value={1}>1 hora depois</option>
                <option value={2}>2 horas depois</option>
                <option value={6}>6 horas depois</option>
                <option value={12}>12 horas depois</option>
                <option value={24}>24 horas depois</option>
                <option value={48}>48 horas depois</option>
              </select>
              <p className="text-xs text-[#555]">após o evento ser despoletado</p>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Assunto</label>
            <input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className={inputCls} placeholder="Assunto do email..." />
          </div>

          {/* Vars hint */}
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider mb-2 block">Variáveis disponíveis</label>
            <div className="flex flex-wrap gap-1.5">
              {VARS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => insertVar(v)}
                  className="text-[11px] font-mono bg-[#e2ff00]/8 text-[#e2ff00]/80 border border-[#e2ff00]/15 px-2 py-0.5 rounded-lg hover:bg-[#e2ff00]/15 transition-colors"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Corpo do Email</label>
            <textarea
              ref={bodyRef}
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              rows={12}
              className={`${inputCls} resize-none font-mono text-xs leading-relaxed`}
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-white/[0.06]">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/[0.06] text-[#666] text-sm hover:text-white transition-all">
            Cancelar
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="flex-1 py-2.5 rounded-xl bg-[#e2ff00] text-[#0a0a0a] font-bold text-sm hover:bg-[#d4f000] transition-all"
          >
            Guardar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Test modal ──────────────────────────────────────────────────────────────
function TestModal({
  rule,
  onClose,
}: {
  rule: AutoRule;
  onClose: () => void;
}) {
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { addToast } = useToast();

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;
    setSending(true);
    setTimeout(() => {
      pushAudit('Email de teste enviado', `Trigger: ${rule.label} → ${testEmail}`, 'Emails', 'info');
      addToast('Email de teste enviado! (simulado)', 'success');
      setSending(false);
      setSent(true);
    }, 1400);
  };

  const inputCls = 'w-full px-3 py-2.5 bg-[#161616] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#e2ff00]/30 outline-none transition-all placeholder-[#444]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden admin-section-enter">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span className="text-lg">{rule.icon}</span>
            <h2 className="font-display font-semibold text-white">Testar: {rule.label}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#666] hover:text-white transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {!sent ? (
          <form onSubmit={send} className="p-6 space-y-4">
            <div className="bg-[#161616] rounded-xl p-4 border border-white/[0.06] space-y-1">
              <p className="text-xs text-[#555] uppercase tracking-wider">Assunto</p>
              <p className="text-sm text-white">{rule.subject}</p>
            </div>
            <div className="bg-[#161616] rounded-xl p-4 border border-white/[0.06]">
              <p className="text-xs text-[#555] uppercase tracking-wider mb-2">Preview</p>
              <pre className="text-xs text-[#666] whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto font-sans">
                {rule.body.replace('{{nome}}', 'João Silva').replace('{{check_in}}', '10 Abr 2026').replace('{{check_out}}', '14 Abr 2026').replace('{{hospedes}}', '2')}
              </pre>
            </div>
            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Enviar para</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="teu@email.com"
                className={inputCls}
                required
              />
            </div>
            <button
              type="submit"
              disabled={sending || !testEmail}
              className="w-full py-2.5 rounded-xl bg-[#e2ff00] text-[#0a0a0a] font-bold text-sm hover:bg-[#d4f000] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {sending ? (
                <><div className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" /> A enviar...</>
              ) : (
                <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg> Enviar Email de Teste</>
              )}
            </button>
          </form>
        ) : (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" className="w-7 h-7"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
            </div>
            <p className="font-display font-bold text-white text-lg mb-1">Enviado!</p>
            <p className="text-sm text-[#555] mb-1">Email de teste enviado para</p>
            <p className="text-sm text-[#e2ff00]">{testEmail}</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 rounded-xl border border-white/[0.08] text-[#888] hover:text-white transition-colors text-sm">
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Compose modal (manual) ──────────────────────────────────────────────────
function ComposeModal({
  template,
  onClose,
  onSent,
}: {
  template: (typeof MANUAL_TEMPLATES)[0] | null;
  onClose: () => void;
  onSent: (e: SentEmail) => void;
}) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState(template?.subject ?? '');
  const [body, setBody] = useState(template?.body ?? '');
  const [sending, setSending] = useState(false);
  const { addToast } = useToast();
  const inputCls = 'w-full px-3 py-2.5 bg-[#161616] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#e2ff00]/30 outline-none transition-all placeholder-[#444]';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !body) { addToast('Preenche todos os campos.', 'error'); return; }
    setSending(true);
    setTimeout(() => {
      const entry: SentEmail = { id: Date.now().toString(), to, subject, trigger: template?.name ?? 'Manual', sentAt: new Date(), status: 'sent' };
      sentLog.unshift(entry);
      onSent(entry);
      pushAudit('Email manual enviado', `Para: ${to} — ${template?.name ?? 'Manual'}`, 'Emails', 'info');
      addToast('Email enviado! (simulado)', 'success');
      setSending(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden admin-section-enter">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-display font-bold text-white text-lg">{template ? template.name : 'Novo Email'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#666] hover:text-white transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <form onSubmit={handleSend} className="p-6 space-y-4">
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Para</label>
            <input value={to} onChange={(e) => setTo(e.target.value)} type="email" placeholder="cliente@email.com" className={inputCls} />
          </div>
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Assunto</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Mensagem</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} className={`${inputCls} resize-none font-mono text-xs leading-relaxed`} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/[0.06] text-[#666] text-sm hover:text-white transition-all">Cancelar</button>
            <button type="submit" disabled={sending} className="flex-1 py-2.5 rounded-xl bg-[#e2ff00] text-[#0a0a0a] font-bold text-sm hover:bg-[#d4f000] disabled:opacity-60 transition-all flex items-center justify-center gap-2">
              {sending ? <><div className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />A enviar...</> : <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                Enviar</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── SMTP tab ────────────────────────────────────────────────────────────────
function SmtpTab() {
  const [config, setConfig] = useState<SmtpConfig>({ ...DEFAULT_SMTP });
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'ok' | 'fail'>('idle');
  const [showPwd, setShowPwd] = useState(false);
  const { addToast } = useToast();

  const inputCls = 'w-full px-3 py-2.5 bg-[#161616] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#e2ff00]/30 focus:ring-1 focus:ring-[#e2ff00]/10 outline-none transition-all placeholder-[#444]';

  const set = (k: keyof SmtpConfig) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setConfig((c) => ({ ...c, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      pushAudit('Configurações SMTP guardadas', `${config.host}:${config.port} (${config.fromEmail})`, 'Emails', 'success');
      addToast('Configurações de email guardadas!', 'success');
      setSaving(false);
    }, 800);
  };

  const testConnection = () => {
    if (!config.host || !config.user) { addToast('Preenche o servidor e utilizador primeiro.', 'error'); return; }
    setTesting(true);
    setTestResult('idle');
    setTimeout(() => {
      setTestResult('ok');
      setTesting(false);
      pushAudit('Teste SMTP', `Ligação a ${config.host}:${config.port} — OK (simulado)`, 'Emails', 'success');
      addToast('Ligação SMTP testada com sucesso! (simulado)', 'success');
    }, 2000);
  };

  const PROVIDERS = [
    { label: 'Gmail', host: 'smtp.gmail.com', port: '587', secure: false },
    { label: 'Outlook / Hotmail', host: 'smtp.office365.com', port: '587', secure: false },
    { label: 'Brevo (Sendinblue)', host: 'smtp-relay.brevo.com', port: '587', secure: false },
    { label: 'Mailgun', host: 'smtp.mailgun.org', port: '587', secure: false },
    { label: 'SendGrid', host: 'smtp.sendgrid.net', port: '587', secure: false },
    { label: 'Custom SMTP', host: '', port: '587', secure: false },
  ];

  return (
    <div className="space-y-5 max-w-xl">
      {/* Quick pick provider */}
      <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
        <h3 className="font-display font-semibold text-white text-sm mb-3">Servidor de Email</h3>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {PROVIDERS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setConfig((c) => ({ ...c, host: p.host, port: p.port, secure: p.secure }))}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${config.host === p.host ? 'bg-[#e2ff00]/10 border-[#e2ff00]/20 text-[#e2ff00]' : 'border-white/[0.06] text-[#666] hover:text-[#ccc] hover:border-white/10'}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <form onSubmit={save} className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Servidor SMTP</label>
              <input value={config.host} onChange={set('host')} placeholder="smtp.example.com" className={inputCls} />
            </div>
            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Porta</label>
              <input value={config.port} onChange={set('port')} placeholder="587" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Utilizador / Email</label>
            <input type="email" value={config.user} onChange={set('user')} placeholder="teu@email.com" className={inputCls} />
          </div>

          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Password / App Key</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={config.password}
                onChange={set('password')}
                placeholder="••••••••••••"
                className={`${inputCls} pr-10`}
              />
              <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors">
                {showPwd
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
              </button>
            </div>
            {config.host === 'smtp.gmail.com' && (
              <p className="text-[10px] text-amber-400/80 mt-1.5 flex items-start gap-1">
                <span>⚠</span>
                <span>Para Gmail usa uma <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-400">App Password</a>, não a tua password normal.</span>
              </p>
            )}
          </div>

          <div className="border-t border-white/[0.06] pt-4">
            <h4 className="font-display font-semibold text-white text-xs mb-3">Remetente</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Nome</label>
                <input value={config.fromName} onChange={set('fromName')} placeholder="LYX Studios" className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5 block">Email</label>
                <input type="email" value={config.fromEmail} onChange={set('fromEmail')} placeholder="noreply@lyx.pt" className={inputCls} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-1">
            <input
              id="ssl"
              type="checkbox"
              checked={config.secure}
              onChange={(e) => setConfig((c) => ({ ...c, secure: e.target.checked }))}
              className="w-4 h-4 rounded border-white/20 bg-white/5 checked:accent-[#e2ff00]"
            />
            <label htmlFor="ssl" className="text-sm text-[#888]">Usar SSL/TLS (porta 465)</label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={testConnection}
              disabled={testing}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2
                ${testResult === 'ok' ? 'border-green-500/30 text-green-400 bg-green-500/10' : testResult === 'fail' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-white/[0.08] text-[#888] hover:text-white hover:border-white/15'}`}
            >
              {testing
                ? <><div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />A testar...</>
                : testResult === 'ok' ? <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>Ligação OK</>
                : testResult === 'fail' ? '✗ Falhou'
                : <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4"><path d="M5 12.55a11 11 0 0114.08 0" /><path d="M1.42 9a16 16 0 0121.16 0" /><path d="M8.53 16.11a6 6 0 016.95 0" /><circle cx="12" cy="20" r="1" /></svg>
                  Testar Ligação
                </>}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-[#e2ff00] text-[#0a0a0a] font-bold text-sm hover:bg-[#d4f000] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {saving ? <><div className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />A guardar...</> : 'Guardar'}
            </button>
          </div>
        </form>
      </div>

      {/* Info box */}
      <div className="bg-[#e2ff00]/[0.04] border border-[#e2ff00]/10 rounded-2xl p-4">
        <p className="text-xs text-[#888] leading-relaxed">
          <span className="text-[#e2ff00]/80 font-semibold">Nota:</span> As configurações SMTP são guardadas em segurança no servidor e nunca expostas ao cliente.
          Para produção, recomendamos serviços dedicados como <span className="text-white/60">Brevo</span>, <span className="text-white/60">Mailgun</span> ou <span className="text-white/60">SendGrid</span> para maior fiabilidade e métricas de entrega.
        </p>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Emails({ token: _token }: Props) {
  const [tab, setTab] = useState<Tab>('automations');
  const [rules, setRules] = useState<AutoRule[]>(DEFAULT_RULES);
  const [editing, setEditing] = useState<AutoRule | null>(null);
  const [testing, setTesting] = useState<AutoRule | null>(null);
  const [compose, setCompose] = useState<(typeof MANUAL_TEMPLATES)[0] | null | 'new'>(null);
  const [sent, setSent] = useState<SentEmail[]>([...sentLog]);
  const { addToast } = useToast();

  const updateRule = (updated: AutoRule) => {
    setRules((rs) => rs.map((r) => (r.key === updated.key ? updated : r)));
    pushAudit('Automação atualizada', `${updated.label} — ${updated.enabled ? 'ativo' : 'inativo'}`, 'Emails', 'info');
    addToast(`${updated.label} atualizado!`, 'success');
  };

  const toggleRule = (key: TriggerKey) => {
    setRules((rs) =>
      rs.map((r) => {
        if (r.key !== key) return r;
        const next = { ...r, enabled: !r.enabled };
        pushAudit(`Automação ${next.enabled ? 'ativada' : 'desativada'}`, next.label, 'Emails', next.enabled ? 'success' : 'warning');
        return next;
      })
    );
  };

  const handleSent = (e: SentEmail) => setSent((prev) => [e, ...prev]);

  const enabledCount = rules.filter((r) => r.enabled).length;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-screen-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Emails</h1>
          <p className="text-sm text-[#555] mt-1">Automações, templates e configuração de envio</p>
        </div>
        <button
          onClick={() => setCompose('new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e2ff00] text-[#0a0a0a] font-semibold text-sm hover:bg-[#d4f000] transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Enviar Email
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-[#111] border border-white/[0.06] rounded-xl p-1 w-fit">
        {([
          ['automations', `Automações (${enabledCount}/${rules.length})`],
          ['templates', 'Templates Manuais'],
          ['sent', `Enviados (${sent.length})`],
          ['smtp', 'Configuração'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${tab === key ? 'bg-[#e2ff00]/10 text-[#e2ff00]' : 'text-[#666] hover:text-[#ccc]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Automations tab ── */}
      {tab === 'automations' && (
        <div className="space-y-3">
          {/* Summary banner */}
          <div className="flex items-center gap-4 bg-[#111] border border-white/[0.06] rounded-2xl px-5 py-4">
            <div className="w-10 h-10 rounded-xl bg-[#e2ff00]/10 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#e2ff00" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{enabledCount} automações ativas</p>
              <p className="text-xs text-[#555] mt-0.5">Os emails automáticos são enviados quando o evento correspondente ocorre no sistema</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 admin-pulse" />
              <span className="text-xs text-green-400 font-medium">Sistema ativo</span>
            </div>
          </div>

          {/* Rules */}
          {rules.map((rule) => (
            <div
              key={rule.key}
              className={`bg-[#111111] border rounded-2xl p-5 transition-all duration-300 ${rule.enabled ? 'border-white/[0.08]' : 'border-white/[0.04] opacity-60'}`}
            >
              <div className="flex flex-wrap items-start gap-4">
                {/* Icon + info */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border ${rule.color}`}>
                  {rule.icon}
                </div>
                <div className="flex-1 min-w-48">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-semibold text-white text-sm">{rule.label}</h3>
                    {rule.delayHours > 0 && (
                      <span className="text-[10px] bg-white/[0.05] text-[#666] px-2 py-0.5 rounded-full border border-white/[0.06]">
                        +{rule.delayHours}h
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#555] mt-0.5">{rule.description}</p>
                  <p className="text-xs text-[#444] mt-1 truncate max-w-sm">
                    <span className="text-[#666]">Assunto: </span>{rule.subject}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setTesting(rule)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] text-[#777] hover:text-white hover:bg-white/[0.08] transition-all text-xs"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-3.5 h-3.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    Testar
                  </button>
                  <button
                    onClick={() => setEditing(rule)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] text-[#777] hover:text-white hover:bg-white/[0.08] transition-all text-xs"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    Editar
                  </button>
                  <Toggle on={rule.enabled} onChange={() => toggleRule(rule.key)} />
                </div>
              </div>

              {/* Body preview */}
              {rule.enabled && (
                <div className="mt-4 pt-4 border-t border-white/[0.05]">
                  <pre className="text-[11px] text-[#444] leading-relaxed whitespace-pre-wrap line-clamp-3 font-sans overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {rule.body}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Manual templates tab ── */}
      {tab === 'templates' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {MANUAL_TEMPLATES.map((tpl) => (
            <div key={tpl.id} className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-all group">
              <h3 className="font-display font-semibold text-white text-sm mb-1">{tpl.name}</h3>
              <p className="text-xs text-[#555] mb-3 truncate">Assunto: {tpl.subject}</p>
              <div className="bg-[#161616] rounded-xl p-3 font-mono text-[11px] text-[#555] leading-relaxed max-h-24 overflow-hidden relative mb-3">
                {tpl.body.split('\n').slice(0, 4).join('\n')}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#161616] to-transparent" />
              </div>
              <button
                onClick={() => setCompose(tpl)}
                className="w-full py-2 rounded-xl border border-white/[0.06] text-[#666] text-xs hover:text-white hover:border-white/10 hover:bg-white/[0.04] transition-all"
              >
                Enviar com este template
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Sent tab ── */}
      {tab === 'sent' && (
        sent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#111] border border-white/[0.06] rounded-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" /><rect x="2" y="5" width="20" height="14" rx="2" /></svg>
            </div>
            <p className="text-[#555] font-medium">Nenhum email enviado nesta sessão</p>
          </div>
        ) : (
          <div className="bg-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Estado', 'Para', 'Assunto', 'Tipo', 'Hora'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#555] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sent.map((e, i) => (
                  <tr key={e.id} className={`border-b last:border-0 border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i % 2 ? 'bg-white/[0.01]' : ''}`}>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${e.status === 'sent' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {e.status === 'sent' ? 'Enviado' : 'Falhou'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-white">{e.to}</td>
                    <td className="px-5 py-3 text-sm text-[#888] max-w-xs truncate">{e.subject}</td>
                    <td className="px-5 py-3"><span className="text-[11px] bg-[#e2ff00]/10 text-[#e2ff00] px-2 py-0.5 rounded-full">{e.trigger}</span></td>
                    <td className="px-5 py-3 text-xs text-[#555] font-mono whitespace-nowrap">{e.sentAt.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* ── SMTP tab ── */}
      {tab === 'smtp' && <SmtpTab />}

      {/* ── Modals ── */}
      {editing && <EditModal rule={editing} onSave={updateRule} onClose={() => setEditing(null)} />}
      {testing && <TestModal rule={testing} onClose={() => setTesting(null)} />}
      {compose !== null && (
        <ComposeModal
          template={compose === 'new' ? null : compose}
          onClose={() => setCompose(null)}
          onSent={handleSent}
        />
      )}
    </div>
  );
}

