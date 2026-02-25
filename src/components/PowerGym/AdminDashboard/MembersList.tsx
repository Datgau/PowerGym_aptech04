import React from 'react';
import styles from './MembersList.module.css';

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

interface MembersListProps {
  members: Member[];
  onMemberClick: (memberId: string) => void;
  onStatusChange: (memberId: string, status: Member['status']) => void;
}

const MembersList: React.FC<MembersListProps> = ({ members, onMemberClick, onStatusChange }) => {
  const getStatusColor = (status: Member['status']) => {
    switch (status) {
      case 'active': return '#2d7d32';
      case 'expired': return '#c62828';
      case 'pending': return '#f57c00';
      default: return '#666';
    }
  };

  const getStatusText = (status: Member['status']) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'expired': return 'Hết hạn';
      case 'pending': return 'Chờ duyệt';
      default: return status;
    }
  };

  return (
    <div className={styles.membersContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>Danh sách thành viên</h3>
        <span className={styles.count}>{members.length} thành viên</span>
      </div>
      
      <div className={styles.membersList}>
        {members.map((member) => (
          <div
            key={member.id}
            className={styles.memberCard}
            onClick={() => onMemberClick(member.id)}
          >
            <div className={styles.memberAvatar}>
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className={styles.memberInfo}>
              <h4 className={styles.memberName}>{member.name}</h4>
              <p className={styles.memberEmail}>{member.email}</p>
              <p className={styles.membershipType}>{member.membershipType}</p>
            </div>
            
            <div className={styles.memberStatus}>
              <span
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(member.status) }}
              >
                {getStatusText(member.status)}
              </span>
              <p className={styles.expiryDate}>Hết hạn: {member.expiryDate}</p>
            </div>
            
            <div className={styles.memberActions}>
              <select
                className={styles.statusSelect}
                value={member.status}
                onChange={(e) => onStatusChange(member.id, e.target.value as Member['status'])}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="active">Hoạt động</option>
                <option value="expired">Hết hạn</option>
                <option value="pending">Chờ duyệt</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersList;