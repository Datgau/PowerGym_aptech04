import React from 'react';
import { useAuth } from '../../routes/AuthContext';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout';
import ClientHome from './ClientHome';
import AdminHome from '../Admin/AdminHome.tsx';

const Home: React.FC = () => {
  const { user, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Đang tải...
      </div>
    );
  }

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';

  return (
    <PowerGymLayout>
      <div>
        {user && isAdmin ? <AdminHome /> : <ClientHome />}
      </div>
    </PowerGymLayout>
  );
};

export default Home;