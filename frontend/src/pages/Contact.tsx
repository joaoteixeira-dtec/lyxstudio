import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../components/AnimateOnScroll';
import { useToast } from '../components/Toast';

const ASSET_BASE = '/assets';

export default function Contact() {
  const { t } = useTranslation();
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
    addToast(t('contact.success'), 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm transition-all duration-300 outline-none";

  return (
    <main className="page-enter">
      {/* Page Hero Banner */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <img
          src={`${ASSET_BASE}/images/exterior/exterior-11.jpg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-12 text-center text-white px-4">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-300/80 font-medium mb-3">Casa do Posto das Marés</span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold">
            {t('contact.title')}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <AnimateOnScroll animation="fade-right">
            <div className="space-y-10">
              <div>
                <h2 className="text-xs font-medium text-amber-600 uppercase tracking-[0.2em] mb-4">
                  {t('contact.address_label')}
                </h2>
                <address className="not-italic text-stone-500 leading-relaxed font-light text-lg">
                  Beco Vasco da Gama, nº 1<br />
                  8800-595 Cabanas de Tavira<br />
                  Portugal
                </address>
              </div>

              <div>
                <h2 className="text-xs font-medium text-amber-600 uppercase tracking-[0.2em] mb-4">
                  {t('contact.phone_label')}
                </h2>
                <p className="text-stone-500 font-light text-lg">+351 000 000 000</p>
              </div>

              <div>
                <h2 className="text-xs font-medium text-amber-600 uppercase tracking-[0.2em] mb-4">
                  {t('contact.email_label')}
                </h2>
                <a href="mailto:info@vanguard-cabanas.pt" className="text-stone-700 hover:text-amber-600 transition-colors font-light text-lg border-b border-stone-200 hover:border-amber-400 pb-0.5">
                  info@vanguard-cabanas.pt
                </a>
              </div>

              {/* Map */}
              <div>
                <h2 className="text-xs font-medium text-amber-600 uppercase tracking-[0.2em] mb-4">
                  {t('contact.map_title')}
                </h2>
                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-stone-200/50">
                  <iframe
                    title="Localização Casa do Posto das Marés"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3190.5!2d-7.5983!3d37.1275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDA3JzM5LjAiTiA3wrAzNSc1My45Ilc!5e0!3m2!1spt-PT!2spt!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Form */}
          <AnimateOnScroll animation="fade-left" delay={100}>
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-8">{t('contact.form_title')}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                    {t('contact.name')}
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
                  <label htmlFor="contact-email" className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                    {t('contact.email')}
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
                  <label htmlFor="contact-subject" className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                    {t('contact.subject')}
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
                  <label htmlFor="contact-message" className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                    {t('contact.message')}
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
                  className="btn-magnetic w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-medium py-3.5 rounded-xl transition-all duration-300 text-sm tracking-wider uppercase shadow-lg shadow-stone-900/10 hover:shadow-stone-900/20"
                >
                  {sending ? t('contact.sending') : t('contact.send')}
                </button>
              </form>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
