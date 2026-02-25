import React from 'react';
import styles from './GymStats.module.css';

interface GymStatsProps {
  membershipType: string;
  daysLeft: number;
  totalDays: number;
  expiryDate: string;
  isActive: boolean;
}

const GymStats: React.FC<GymStatsProps> = ({
  membershipType,
  daysLeft,
  totalDays,
  expiryDate,
  isActive
}) => {
  return (
    <div className={styles.statsContainer}>
      <div className={styles.membershipHeader}>
        <h3>Hợp đồng</h3>
        <span className={`${styles.status} ${isActive ? styles.active : styles.inactive}`}>
          {isActive ? 'ĐÃ KÍCH HOẠT' : 'HẾT HẠN'}
        </span>
      </div>
      
      <div className={styles.membershipInfo}>
        <h2>{membershipType}</h2>
        
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Đã tập</span>
            <span className={styles.statValue}>{totalDays - daysLeft}</span>
          </div>
          
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Số ngày còn lại</span>
            <span className={styles.statValue}>{daysLeft}</span>
          </div>
          
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Ngày hết hạn</span>
            <span className={styles.statValue}>{expiryDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymStats;