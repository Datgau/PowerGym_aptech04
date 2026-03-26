import React from 'react';
import AuthPanel from './AuthPanel';
import AuthTabs from './AuthTabs';
import styles from '../../styles/Auth/Login.module.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  activeTab?: 'login' | 'register';
  title?: string;
  subtitle?: string;
}

const AuthLayout = ({ children, activeTab, title, subtitle }: AuthLayoutProps) => {
  return (
    <main className={styles.authPage}>
      <AuthPanel />
      <section className={`${styles.authPanel} ${styles.authPanelCard}`}>
        {activeTab && <AuthTabs activeTab={activeTab} />}
        
        <div style={{ marginBottom: '1.5rem' }}>
          {title && <h2 className={styles.authCardTitle} style={{ marginBottom: '0.5rem' }}>{title}</h2>}
          {subtitle && <p className={styles.authCardSubtitle}>{subtitle}</p>}
        </div>

        {children}
      </section>
    </main>
  );
};

export default AuthLayout;
