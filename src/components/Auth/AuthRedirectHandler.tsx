import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../routes/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const AuthRedirectHandler: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, redirect based on role
        const role = user.role.toUpperCase();
        
        if (role === 'ADMIN' || role === 'EMPLOYEE') {
          // Admin/Employee goes to admin dashboard
          navigate('/admin/dashboard', { replace: true });
        } else {
          // Regular user goes to home
          navigate('/home', { replace: true });
        }
      } else {
        // User is not authenticated, redirect to login
        navigate('/login', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Đang kiểm tra thông tin đăng nhập...
        </Typography>
      </Box>
    );
  }

  return null;
};

export default AuthRedirectHandler;