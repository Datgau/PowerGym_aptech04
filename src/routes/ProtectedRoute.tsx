import {Navigate, Outlet, useNavigate} from "react-router-dom";
import { CircularProgress} from "@mui/material";
import {useEffect, useState} from "react";
import {useAuth} from "../hooks/useAuth.ts";
import LoginRequiredModal from "../components/Auth/LoginRequiredModal.tsx";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  showLoginDialog?: boolean;
}

const ProtectedRoute = ({
                          allowedRoles,
                          showLoginDialog = false,
                        }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && showLoginDialog) {
        setLoginModalOpen(true);
    }
  }, [loading, user, showLoginDialog]);

  if (loading) return <CircularProgress />;

  if (!user) {
    if (!showLoginDialog) {
      return <Navigate to="/login" replace />;
    }
  }

  if (
      user &&
      allowedRoles &&
      !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/home" replace />;
  }

    const handleConfirmLogin = () => {
        setLoginModalOpen(false);
        navigate("/login");
    };

  return (
      <>
        {user && <Outlet />}
        <LoginRequiredModal
            open={loginModalOpen}
            onClose={() => setLoginModalOpen(false)}
            onConfirm={handleConfirmLogin}
        />
      </>
  );
};

export default ProtectedRoute;
