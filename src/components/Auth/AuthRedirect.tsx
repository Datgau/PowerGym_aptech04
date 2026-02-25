import { Navigate } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useAuth } from "../../routes/AuthContext";

// Component to redirect based on auth state and user role
const AuthRedirect = () => {
  const { isLoggedIn, user, loading } = useAuth();

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

  if (isLoggedIn && user) {
    // Redirect based on user role
    const role = user.role.toUpperCase();
    
    if (role === 'ADMIN' || role === 'EMPLOYEE') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  // Not logged in, redirect to login
  return <Navigate to="/login" replace />;
};

export default AuthRedirect;
