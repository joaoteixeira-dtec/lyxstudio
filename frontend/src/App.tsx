import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Accommodation from './pages/Accommodation';
import GalleryPage from './pages/GalleryPage';
import History from './pages/History';
import Sustainability from './pages/Sustainability';
import Reservations from './pages/Reservations';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/alojamento" element={<Accommodation />} />
                <Route path="/galeria" element={<GalleryPage />} />
                <Route path="/historia" element={<History />} />
                <Route path="/sustentabilidade" element={<Sustainability />} />
                <Route path="/reservas" element={<Reservations />} />
                <Route path="/contactos" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
