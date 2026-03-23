import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { adminLogin } from '../services/api';
import { useToast } from '../components/Toast';

export default function AdminLogin() {
  const { t } = useTranslation();
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
    <main className="page-enter min-h-screen flex items-center justify-center bg-stone-50 py-20">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <span className="font-serif text-2xl font-bold tracking-wider">
            <span className="text-amber-500">VANGUARD</span>
            <span className="text-stone-400 font-light ml-1.5">CEREMONY</span>
          </span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 p-8 md:p-10">
          <h1 className="font-serif text-2xl font-bold text-stone-900 text-center mb-8">
            {t('admin.login_title')}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                {t('admin.email')}
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm transition-all duration-300 outline-none"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                {t('admin.password')}
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm transition-all duration-300 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-magnetic w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-medium py-3.5 rounded-xl transition-all duration-300 text-sm tracking-wider uppercase"
            >
              {loading ? '...' : t('admin.login')}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
