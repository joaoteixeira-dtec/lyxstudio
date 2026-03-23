import { useState } from 'react';
import AnimateOnScroll from '../components/AnimateOnScroll';
import { useToast } from '../components/Toast';

export default function Contact() {
  const { addToast } = useToast();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    addToast('Mensagem enviada com sucesso!', 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:bg-white/10 focus:border-[#e2ff00]/50 focus:ring-2 focus:ring-[#e2ff00]/20 text-sm transition-all duration-300 outline-none";

  return (
    <main className="page-enter bg-[#0a0a0a]">
      {/* Page Header */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e2ff00]/[0.02] rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 text-center px-4">
          <span className="inline-block text-xs uppercase tracking-[0.4em] text-[#e2ff00]/60 font-medium mb-4">
            Fala connosco
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            Contacto
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <AnimateOnScroll animation="fade-right">
            <div className="space-y-10">
              <div>
                <h2 className="text-xs font-medium text-[#e2ff00]/60 uppercase tracking-[0.2em] mb-4">
                  Email
                </h2>
                <a href="mailto:info@lyxstudio.pt" className="text-white/70 hover:text-[#e2ff00] transition-colors font-light text-lg border-b border-white/10 hover:border-[#e2ff00]/40 pb-0.5">
                  info@lyxstudio.pt
                </a>
              </div>

              <div>
                <h2 className="text-xs font-medium text-[#e2ff00]/60 uppercase tracking-[0.2em] mb-4">
                  Telefone
                </h2>
                <p className="text-white/70 font-light text-lg">+351 000 000 000</p>
              </div>

              <div>
                <h2 className="text-xs font-medium text-[#e2ff00]/60 uppercase tracking-[0.2em] mb-4">
                  Horário
                </h2>
                <p className="text-white/50 font-light">Segunda a Sábado: 10h — 00h</p>
                <p className="text-white/50 font-light">Domingo: 14h — 22h</p>
              </div>

              <div>
                <h2 className="text-xs font-medium text-[#e2ff00]/60 uppercase tracking-[0.2em] mb-4">
                  Redes Sociais
                </h2>
                <div className="flex gap-4">
                  <span className="text-white/40 hover:text-[#e2ff00] transition-colors cursor-pointer text-sm">Instagram</span>
                  <span className="text-white/40 hover:text-[#e2ff00] transition-colors cursor-pointer text-sm">YouTube</span>
                  <span className="text-white/40 hover:text-[#e2ff00] transition-colors cursor-pointer text-sm">SoundCloud</span>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Form */}
          <AnimateOnScroll animation="fade-left" delay={100}>
            <div>
              <h2 className="font-display text-xl font-semibold text-white mb-6">Envia-nos uma mensagem</h2>
              <form onSubmit={handleSubmit} className="space-y-5 bg-[#111] rounded-2xl border border-white/5 p-6">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
                    Nome
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
                    Assunto
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    className={inputClasses}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-magnetic w-full bg-[#e2ff00] hover:bg-[#d4ef00] disabled:bg-white/10 disabled:text-white/30 text-black font-semibold py-3.5 rounded-xl transition-all duration-300 text-sm tracking-wider uppercase"
                >
                  {sending ? 'A enviar...' : 'Enviar'}
                </button>
              </form>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
