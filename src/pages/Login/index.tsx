// pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import { AuthService } from "../../services/authService";
import type { AuthUser } from "../../@type/login";

import styles from "../../styles/Auth/Login.module.css";
import AuthLayout from "../../components/Auth/AuthLayout";
import { useGoogleAuth } from "../../hooks/useGoogleAuth.ts";
import { useFacebookAuth } from "../../hooks/useFacebookAuth.ts";
import LoginForm from "../../components/Auth/LoginForm";
import SocialLogin from "../../components/Auth/SocialLogin";
import {getApiErrorMessage} from "../../until/errorHandler.ts";
import {useAuth} from "../../hooks/useAuth.ts";


const Login = () => {
  const navigate = useNavigate();
  const { login: persistSession } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Custom hooks cho OAuth
  const { handleGoogleLoginClick } = useGoogleAuth({ setFeedback });
  const { handleFacebookLogin } = useFacebookAuth({ setFeedback });

  // Redirect based on user role
  const redirectBasedOnRole = (role: string) => {
    const normalizedRole = role.toUpperCase();
    
    if (normalizedRole === 'ADMIN' || normalizedRole === 'EMPLOYEE' || normalizedRole === 'STAFF') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/home', { replace: true });
    }
  };

  const handleFormSubmit = async (
      email: string,
      password: string,
      _remember: boolean // Prefix with underscore to indicate intentionally unused
  ) => {
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await AuthService.login({
        email: email,
        password,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Login failed");
      }

      const userData: AuthUser = {
        id: response.data.id,
        role: response.data.role,
        email: response.data.email || '',
        fullName: response.data.fullName,
        avatar: response.data.avatar,
        phoneNumber: response.data.phoneNumber || '',
        dateOfBirth: response.data.dateOfBirth || '',
        bio: response.data.bio || '',
        tokens: {
          accessToken: response.data.token.accessToken,
          refreshToken: response.data.token.refreshToken,
          expiresIn: response.data.token.expiresIn,
        },
      };

      persistSession(userData, _remember);

      setFeedback({
        type: "success",
        message: response.message || "Login successful!",
      });

      // Redirect based on user role after short delay
      setTimeout(() => {
        redirectBasedOnRole(userData.role);
      }, 1000);
    }  catch (error) {
    setFeedback({
        type: "error",
        message: getApiErrorMessage(error),
    });
} finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      activeTab="login"
      title="Welcome Back"
      subtitle="Continue chatting with your favorite community."
    >
      <LoginForm onSubmit={handleFormSubmit} submitting={submitting} />

      <SocialLogin
        onGoogleLogin={handleGoogleLoginClick}
        onFacebookLogin={handleFacebookLogin}
      />

      <p className={styles.authFooter}>
        Don't have an account?{" "}
        <Link className={styles.link} to="/register">
          Create now - it's free!
        </Link>
      </p>

      <Snackbar
        open={feedback !== null}
        autoHideDuration={6000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setFeedback(null)}
          severity={feedback?.type || "info"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {feedback?.message}
        </Alert>
      </Snackbar>
    </AuthLayout>
  );
};


export default Login;