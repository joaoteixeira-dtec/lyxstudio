import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Footer from './components/Footer';
import Home from './pages/Home';
import Reservations from './pages/Reservations';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservas" element={<Reservations />} />
          <Route path="/contactos" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
