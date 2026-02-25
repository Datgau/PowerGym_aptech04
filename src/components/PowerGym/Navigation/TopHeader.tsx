import React, { useState } from 'react';
import { useAuth } from '../../../routes/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './TopHeader.module.css';

const TopHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogin = () => {
    navigate('/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });

  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';

  const menuItems = isAdmin ? [
    { label: 'DASHBOARD', path: '/admin/dashboard' },
    { label: 'ADMIN HOME', path: '/admin' },
    { label: 'THÀNH VIÊN', path: '/admin/members' },
    { label: 'GÓI TẬP', path: '/admin/packages' },
    { label: 'BÁO CÁO', path: '/admin/reports' },
    { label: 'CÀI ĐẶT', path: '/admin/settings' }
  ] : [
    { label: 'CLB', path: '/club' },
    { label: 'DỊCH VỤ', path: '/services' },
    { label: 'CHÍNH SÁCH GIÁ', path: '/pricing' },
    { label: 'TIN TỨC', path: '/news' },
    { label: 'KHUYẾN MÃI', path: '/promotions' },
    { label: 'CITIREWARDS', path: '/rewards' }
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={styles.topHeader}>
      <div className={styles.headerContainer}>
        <div className={styles.leftSection}>
          <div className={styles.logo} onClick={() => navigate('/home')}>
            <span className={styles.logoText}>POWERGYM</span>
          </div>
        </div>

        <nav className={styles.centerSection}>
          <div className={styles.menuItems}>
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`${styles.menuItem} ${isActivePath(item.path) ? styles.active : ''}`}
                onClick={() => handleMenuClick(item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className={styles.rightSection}>
          {!isAdmin && (
            <button className={styles.registerButton}>
              ĐĂNG KÍ TẬP THỬ
            </button>
          )}
          
          <div className={styles.userSection}>
            <div className={styles.timeDisplay}>
              {getCurrentTime()}
            </div>
            
            {user ? (
              <>
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.fullName} />
                    ) : (
                      <span>{user.fullName?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <div className={styles.userDetails}>
                    <span className={styles.userName}>{user.fullName || 'Anonymus'}</span>
                    <span className={styles.userRole}>
                      {isAdmin ? 'Quản trị viên' : 'Thành viên'}
                    </span>
                  </div>
                </div>

                <button className={styles.logoutButton} onClick={handleLogout}>
                  🚪
                </button>
              </>
            ) : (
              // Hiển thị nút đăng nhập khi chưa đăng nhập
              <button className={styles.loginButton} onClick={handleLogin}>
                Đăng nhập
              </button>
            )}
          </div>

          {/* Language selector */}
          <div className={styles.languageSelector}>
            <span className={styles.flagIcon}>🇻🇳</span>
          </div>

          {/* Mobile menu button */}
          <button 
            className={styles.mobileMenuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`${styles.mobileMenuItem} ${isActivePath(item.path) ? styles.mobileActive : ''}`}
              onClick={() => handleMenuClick(item.path)}
            >
              {item.label}
            </button>
          ))}
          {!isAdmin && (
            <button className={styles.mobileRegisterButton}>
              ĐĂNG KÍ TẬP THỬ
            </button>
          )}
          {!user && (
            <button className={styles.mobileLoginButton} onClick={handleLogin}>
              Đăng nhập
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default TopHeader;