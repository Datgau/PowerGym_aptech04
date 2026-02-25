// pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import { AuthService } from "../../services/authService";
import { useAuth } from "../../routes/AuthContext";
import type { AuthUser } from "../../@type/login";

import styles from "../../styles/Auth/Login.module.css";
import AuthPanel from "../../components/Auth/AuthPanel";
import { useGoogleAuth } from "../../hooks/useGoogleAuth.ts";
import { useFacebookAuth } from "../../hooks/useFacebookAuth.ts";
import LoginForm from "../../components/Auth/LoginForm";
import SocialLogin from "../../components/Auth/SocialLogin";
import AuthTabs from "../../components/Auth/AuthTabs";
import {getApiErrorMessage} from "../../until/errorHandler.ts";

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
    
    if (normalizedRole === 'ADMIN' || normalizedRole === 'EMPLOYEE') {
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
        throw new Error(response.message || "Đăng nhập thất bại");
      }

      const userData: AuthUser = {
        id: response.data.id,
        role: response.data.role,
        email: response.data.email || '',
        fullName: response.data.fullName,
        avatar: response.data.avatar,
        tokens: {
          accessToken: response.data.token.accessToken,
          refreshToken: response.data.token.refreshToken,
          expiresIn: response.data.token.expiresIn,
        },
      };

      persistSession(userData, _remember);

      setFeedback({
        type: "success",
        message: response.message || "Đăng nhập thành công!",
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
      <main className={styles.authPage}>
        <AuthPanel />

        <section className={`${styles.authPanel} ${styles.authPanelCard}`}>
          <AuthTabs activeTab="login" />

          <div>
            <h2 className={styles.authCardTitle}>Chào mừng trở lại</h2>
            <p className={styles.authCardSubtitle}>
              Tiếp tục trò chuyện với cộng đồng yêu thích của bạn.
            </p>
          </div>

          <LoginForm onSubmit={handleFormSubmit} submitting={submitting} />

          <SocialLogin
              onGoogleLogin={handleGoogleLoginClick}
              onFacebookLogin={handleFacebookLogin}
          />

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
          <p className={styles.authFooter}>
            Chưa có tài khoản?{" "}
            <Link className={styles.link} to="/register">
              Tạo ngay - miễn phí!
            </Link>
          </p>
        </section>
      </main>
  );
};

export default Login;