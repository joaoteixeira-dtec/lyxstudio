import { Link } from 'react-router-dom';

const footerLinks = [
  { path: '/', label: 'Início' },
  { path: '/reservas', label: 'Agendar' },
  { path: '/contactos', label: 'Contacto' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050505] text-white/40 overflow-hidden" role="contentinfo">
      {/* Top accent line */}
      <div className="accent-line w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-0.5 mb-4">
              <span className="font-display font-bold text-2xl text-white">LYX</span>
              <span className="font-display font-bold text-2xl text-[#e2ff00]">STUDIO</span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed max-w-xs">
              Três estúdios profissionais para as tuas sessões de gravação, ensaio e produção.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-[#e2ff00]/60 uppercase tracking-[0.2em] mb-4">Navegação</h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-white/40 hover:text-[#e2ff00] transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-[#e2ff00] transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-[#e2ff00]/60 uppercase tracking-[0.2em] mb-4">Contacto</h4>
            <address className="not-italic text-sm space-y-2">
              <p className="text-white/40">info@lyxstudio.pt</p>
              <p className="text-white/40">+351 000 000 000</p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/20">
          <p>&copy; {year} LYX Studio. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
