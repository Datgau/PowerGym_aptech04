import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminStats from '../../components/PowerGym/AdminDashboard/AdminStats.tsx';
import MembersList from '../../components/PowerGym/AdminDashboard/MembersList.tsx';
import styles from './AdminHome.module.css';

interface Member {
  id: string;
  name: string;
  email: string;
  membershipType: string;
  status: 'active' | 'expired' | 'pending';
  joinDate: string;
  expiryDate: string;
  avatar?: string;
}

const AdminHome: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'Nguyễn Văn An',
      email: 'member1@powergym.com',
      membershipType: 'Gói 1 tháng',
      status: 'active' as const,
      joinDate: '2024-01-15',
      expiryDate: '2024-02-15',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      email: 'member2@powergym.com',
      membershipType: 'Gói 3 tháng',
      status: 'expired' as const,
      joinDate: '2023-11-01',
      expiryDate: '2024-01-01',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: '3',
      name: 'Lê Văn Cường',
      email: 'member3@powergym.com',
      membershipType: 'Gói 6 tháng',
      status: 'pending' as const,
      joinDate: '2024-01-20',
      expiryDate: '2024-07-20'
    }
  ]);

  const adminStats = [
    {
      id: 'total-members',
      title: 'Total Members',
      value: '1,234',
      change: '+12% from last month',
      changeType: 'increase' as const,
      icon: '👥',
      color: '#2196F3'
    },
    {
      id: 'active-members',
      title: 'Active Members',
      value: '987',
      change: '+8% from last month',
      changeType: 'increase' as const,
      icon: '✅',
      color: '#4CAF50'
    },
    {
      id: 'revenue',
      title: 'Monthly Revenue',
      value: '125M',
      change: '+15% from last month',
      changeType: 'increase' as const,
      icon: '💰',
      color: '#FF9800'
    },
    {
      id: 'expired-soon',
      title: 'Expiring Soon',
      value: '45',
      change: 'In the next 7 days',
      changeType: 'neutral' as const,
      icon: '⚠️',
      color: '#FF4444'
    }
  ];

  const adminActions = [
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      icon: '📊',
      onClick: () => navigate('/admin/dashboard'),
      color: '#00b4ff'
    },
    {
      id: 'add-member',
      title: 'Add Member',
      icon: '➕',
      onClick: () => console.log('Add member clicked'),
      color: '#4CAF50'
    },
    {
      id: 'manage-packages',
      title: 'Manage Packages',
      icon: '📦',
      onClick: () => console.log('Manage packages clicked'),
      color: '#2196F3'
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: '📊',
      onClick: () => console.log('Reports clicked'),
      color: '#FF9800'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: '⚙️',
      onClick: () => console.log('Settings clicked'),
      color: '#9C27B0'
    }
  ];

  const handleMemberClick = (memberId: string) => {
    console.log('Member clicked:', memberId);
    // Handle member detail view
  };

  const handleStatusChange = (memberId: string, newStatus: 'active' | 'expired' | 'pending') => {
    setMembers(prev =>
      prev.map(member =>
        member.id === memberId
          ? { ...member, status: newStatus }
          : member
      )
    );
  };

  return (
    <div className={styles.adminHome}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>PowerGym Management</p>
      </div>

      <AdminStats stats={adminStats} />
      
      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          {adminActions.map((action) => (
            <button
              key={action.id}
              className={styles.actionCard}
              onClick={action.onClick}
              style={{ borderColor: action.color }}
            >
              <span className={styles.actionIcon}>{action.icon}</span>
              <span className={styles.actionTitle}>{action.title}</span>
            </button>
          ))}
        </div>
      </div>
      
      <MembersList 
        members={members}
        onMemberClick={handleMemberClick}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default AdminHome;