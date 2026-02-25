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
      name: 'Nguyễn Văn A',
      email: 'member1@powergym.com',
      membershipType: 'Gói 1 tháng',
      status: 'active' as const,
      joinDate: '2024-01-15',
      expiryDate: '2024-02-15',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: '2',
      name: 'Trần Thị B',
      email: 'member2@powergym.com',
      membershipType: 'Gói 3 tháng',
      status: 'expired' as const,
      joinDate: '2023-11-01',
      expiryDate: '2024-01-01',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: '3',
      name: 'Lê Văn C',
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
      title: 'Tổng thành viên',
      value: '1,234',
      change: '+12% so với tháng trước',
      changeType: 'increase' as const,
      icon: '👥',
      color: '#2196F3'
    },
    {
      id: 'active-members',
      title: 'Thành viên hoạt động',
      value: '987',
      change: '+8% so với tháng trước',
      changeType: 'increase' as const,
      icon: '✅',
      color: '#4CAF50'
    },
    {
      id: 'revenue',
      title: 'Doanh thu tháng',
      value: '125M',
      change: '+15% so với tháng trước',
      changeType: 'increase' as const,
      icon: '💰',
      color: '#FF9800'
    },
    {
      id: 'expired-soon',
      title: 'Sắp hết hạn',
      value: '45',
      change: 'Trong 7 ngày tới',
      changeType: 'neutral' as const,
      icon: '⚠️',
      color: '#FF4444'
    }
  ];

  const adminActions = [
    {
      id: 'dashboard',
      title: 'Dashboard Tổng quan',
      icon: '📊',
      onClick: () => navigate('/admin/dashboard'),
      color: '#00b4ff'
    },
    {
      id: 'add-member',
      title: 'Thêm thành viên',
      icon: '➕',
      onClick: () => console.log('Add member clicked'),
      color: '#4CAF50'
    },
    {
      id: 'manage-packages',
      title: 'Quản lý gói',
      icon: '📦',
      onClick: () => console.log('Manage packages clicked'),
      color: '#2196F3'
    },
    {
      id: 'reports',
      title: 'Báo cáo',
      icon: '📊',
      onClick: () => console.log('Reports clicked'),
      color: '#FF9800'
    },
    {
      id: 'settings',
      title: 'Cài đặt',
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
        <h1>Bảng điều khiển Admin</h1>
        <p>Quản lý PowerGym</p>
      </div>

      <AdminStats stats={adminStats} />
      
      <div className={styles.quickActions}>
        <h2>Thao tác nhanh</h2>
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