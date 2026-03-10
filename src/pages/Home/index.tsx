import React from 'react';
import ClientHome from './ClientHome';
import AdminDashboard from "../Admin/AdminDashboard.tsx";
import {useAuth} from "../../hooks/useAuth.ts";
import {PowerGymLayout} from "../../components/PowerGym";

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
        Loading...
      </div>
    );
  }

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';

  return (
    <PowerGymLayout>
      <div>
        {user && isAdmin ? <AdminDashboard /> : <ClientHome />}
      </div>
    </PowerGymLayout>
  );
};

export default Home;