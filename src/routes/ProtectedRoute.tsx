import { Navigate, Outlet } from "react-router-dom";
import { Button, CircularProgress, Dialog, DialogActions, DialogTitle} from "@mui/material";
import { useAuth } from "./AuthContext";
import {useEffect, useState} from "react";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  showLoginDialog?: boolean;
}

const ProtectedRoute = ({
                          allowedRoles,
                          showLoginDialog = false,
                        }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && showLoginDialog) {
      setOpen(true);
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

  return (
      <>
        {user && <Outlet />}
        <Dialog open={open}>
          <DialogTitle>Login Required</DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
                onClick={() => (window.location.href = "/login")}
                variant="contained"
            >
              Login
            </Button>
          </DialogActions>
        </Dialog>
      </>
  );
};

export default ProtectedRoute;
