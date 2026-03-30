import { useAuth } from '../context/AuthContext';
import AdminLogin from './AdminLogin';
import AdminLayout from '../admin/AdminLayout';

export default function Admin() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return <AdminLayout />;
}
