import React from 'react';
import styles from './AdminStats.module.css';

interface StatCard {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color?: string;
}

interface AdminStatsProps {
  stats: StatCard[];
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  return (
    <div className={styles.statsContainer}>
      <h3 className={styles.title}>Overview Statistics</h3>
      
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={styles.statCard}
            style={{ '--stat-color': stat.color || '#ff4444' } as React.CSSProperties}
          >
            <div className={styles.statIcon}>
              {stat.icon}
            </div>
            
            <div className={styles.statContent}>
              <h4 className={styles.statTitle}>{stat.title}</h4>
              <div className={styles.statValue}>{stat.value}</div>
              
              {stat.change && (
                <div className={`${styles.statChange} ${styles[stat.changeType || 'neutral']}`}>
                  {stat.changeType === 'increase' && '↗'}
                  {stat.changeType === 'decrease' && '↘'}
                  {stat.change}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStats;