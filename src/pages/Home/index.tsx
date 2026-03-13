import React from 'react';
import ClientHome from './ClientHome';
import AdminDashboard from "../Admin/AdminDashboard.tsx";
import { useAuth } from "../../hooks/useAuth.ts";
import { PowerGymLayout } from "../../components/PowerGym";

const Home: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    fontSize: '18px'
                }}
            >
                Loading...
            </div>
        );
    }

    const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';
    if (user && isAdmin) {
        return <AdminDashboard />;
    }

    // User dùng Layout
    return (
        <PowerGymLayout>
            <ClientHome />
        </PowerGymLayout>
    );
};

export default Home;