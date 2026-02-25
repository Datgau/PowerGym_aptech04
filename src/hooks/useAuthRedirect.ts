import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../routes/AuthContext';

interface UseAuthRedirectReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
}

export const useAuthRedirect = (): UseAuthRedirectReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading, checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect logic based on user role
  const redirectBasedOnRole = (role: string, currentPath: string) => {
    const normalizedRole = role.toUpperCase();
    
    // Don't redirect if user is already on the correct page
    if (normalizedRole === 'ADMIN' || normalizedRole === 'EMPLOYEE') {
      // Admin/Employee should go to admin dashboard
      if (!currentPath.startsWith('/admin') && currentPath !== '/test-auth') {
        navigate('/admin/dashboard', { replace: true });
      }
    } else {
      // Regular user should go to home
      if (currentPath.startsWith('/admin') || currentPath === '/login' || currentPath === '/register') {
        navigate('/home', { replace: true });
      }
    }
  };

  // Check auth status on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await checkAuthStatus();
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  // Handle redirects when user or location changes
  useEffect(() => {
    if (!loading && !isLoading) {
      if (user) {
        redirectBasedOnRole(user.role, location.pathname);
      } else {
        // Not authenticated, redirect to login unless already there
        if (location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/test-auth') {
          navigate('/login', { replace: true });
        }
      }
    }
  }, [user, location.pathname, loading, isLoading, navigate]);

  return {
    isLoading: loading || isLoading,
    isAuthenticated: !!user,
    user
  };
};