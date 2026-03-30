import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminLogin } from '../services/api';
import { useToast } from '../components/Toast';

export default function AdminLogin() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await adminLogin(email, password);
      login(data.token);
      addToast('Login efetuado com sucesso!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Credenciais inválidas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-enter min-h-screen flex items-center justify-center bg-[#0a0a0a] py-20">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center gap-0.5">
            <span className="font-display text-2xl font-bold text-white">LYX</span>
            <span className="font-display text-2xl font-bold text-[#e2ff00]">STUDIO</span>
          </Link>
        </div>
        <div className="bg-[#111] rounded-2xl border border-white/5 p-8 md:p-10">
          <h1 className="font-display text-2xl font-bold text-white text-center mb-8">
            Admin Login
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:bg-white/10 focus:border-[#e2ff00]/50 focus:ring-2 focus:ring-[#e2ff00]/20 text-sm transition-all duration-300 outline-none"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:bg-white/10 focus:border-[#e2ff00]/50 focus:ring-2 focus:ring-[#e2ff00]/20 text-sm transition-all duration-300 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-magnetic w-full bg-[#e2ff00] hover:bg-[#d4ef00] disabled:bg-white/10 disabled:text-white/30 text-black font-semibold py-3.5 rounded-xl transition-all duration-300 text-sm tracking-wider uppercase"
            >
              {loading ? '...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
