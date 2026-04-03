import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './TopHeader.module.css';
import {useAuth} from "../../../hooks/useAuth.ts";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const TopHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);

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

  const handleProfile = () => {
    navigate('/profile');
    setIsAvatarMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    { label: 'MEMBERS', path: '/admin/members' },
    { label: 'PACKAGES', path: '/admin/packages' },
    { label: 'REPORTS', path: '/admin/reports' },
    { label: 'SETTINGS', path: '/admin/settings' }
  ] : [
    { label: 'ABOUT', path: '/about' },
    { label: 'SERVICES', path: '/service' },
    { label: 'PRICING', path: '/pricing' },
    { label: 'PROMOTIONS', path: '/promotions' },
    { label: 'REWARDS', path: '/rewards' },
    { label: 'NEWS', path: '/news' },

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
          <div className={styles.timeDisplay}>
            {getCurrentTime()}
          </div>

          <div className={styles.userSection}>


            {user ? (
                <>
                  <div
                      className={styles.userInfo}
                      onMouseEnter={() => setIsAvatarMenuOpen(true)}
                      onMouseLeave={() => setIsAvatarMenuOpen(false)}
                  >
                    <div className={styles.userAvatar}>
                      {user.avatar ? (
                          <img src={user.avatar} alt={user.fullName}/>
                      ) : (
                          <span>{user.fullName?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <div className={styles.userDetails}>
                      <span className={styles.userName}>{user.fullName || 'Anonymus'}</span>
                      <span className={styles.userRole}>
                      {isAdmin ? 'Administrator' : 'Member'}
                    </span>
                    </div>

                    {/* Avatar Dropdown Menu */}
                    {isAvatarMenuOpen && (
                        <div className={styles.avatarDropdown}>
                          <button
                              className={styles.dropdownItem}
                              onClick={handleProfile}
                          >
                        <span className={styles.dropdownIcon}>
                          <PersonIcon fontSize="small"/>
                        </span>
                            Profile
                          </button>

                          <div className={styles.dropdownDivider}></div>

                          <button
                              className={styles.dropdownItem}
                              onClick={handleLogout}
                          >
                        <span className={styles.dropdownIcon}>
                          <LogoutIcon fontSize="small"/>
                        </span>
                            Logout
                          </button>
                        </div>
                    )}
                  </div>
                </>
            ) : (
                // Display login button when not logged in
                <button className={styles.loginButton} onClick={handleLogin}>
                  Login
                </button>
            )}
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

          {!user && (
            <button className={styles.mobileLoginButton} onClick={handleLogin}>
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default TopHeader;