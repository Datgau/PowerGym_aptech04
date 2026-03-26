import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import styles from "../../styles/Auth/Login.module.css";
import { AuthService } from "../../services/authService";
import AuthLayout from "../../components/Auth/AuthLayout";
import RegisterForm from "../../components/Auth/RegisterForm";
import OTPVerification from "../../components/Auth/OTPVerification";
import SocialLogin from "../../components/Auth/SocialLogin";

import { useGoogleAuth } from "../../hooks/useGoogleAuth.ts";
import { useFacebookAuth } from "../../hooks/useFacebookAuth.ts";
import {getApiErrorMessage} from "../../until/errorHandler.ts";

const Register = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { handleGoogleLoginClick } = useGoogleAuth({ setFeedback });
  const { handleFacebookLogin } = useFacebookAuth({ setFeedback });

  const handleRegisterSubmit = async (formData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setSubmitting(true);
    setFeedback(null);

    if (formData.password !== formData.confirmPassword) {
      setFeedback({
        type: "error",
        message: "Passwords do not match!",
      });
      setSubmitting(false);
      return;
    }

    try {
      const response = await AuthService.register(formData);

      if (response.success) {
        setFeedback({
          type: "success",
          message: response.message || "Registration successful! Please check your email to verify.",
        });
        setRegisteredEmail(formData.email);
        setShowOTP(true);
      } else {
        setFeedback({
          type: "error",
          message: response.message || "Registration failed!",
        });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: getApiErrorMessage(error),
      });
    }
    finally {
      setSubmitting(false);
    }
  };

  const handleOTPSubmit = async (otp: string) => {
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await AuthService.verifyOtp({
        email: registeredEmail,
        otp,
      });

      if (response.success) {
        setFeedback({
          type: "success",
          message: "Verification successful! Redirecting to login...",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setFeedback({
          type: "error",
          message: response.message || "Invalid OTP code!",
        });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: getApiErrorMessage(error),
      });
    }
    finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      activeTab="register"
      title={!showOTP ? "Create New Account" : undefined}
      subtitle={!showOTP ? "Join the PowerGym community today" : undefined}
    >
      {!showOTP ? (
        <>
          <RegisterForm onSubmit={handleRegisterSubmit} submitting={submitting} />

          <SocialLogin
            onGoogleLogin={handleGoogleLoginClick}
            onFacebookLogin={handleFacebookLogin}
          />

          <p className={styles.authFooter}>
            Already have an account?{" "}
            <Link className={styles.link} to="/login">
              Login now
            </Link>
          </p>
        </>
      ) : (
        <OTPVerification
          email={registeredEmail}
          onSubmit={handleOTPSubmit}
          submitting={submitting}
        />
      )}

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


export default Register;
