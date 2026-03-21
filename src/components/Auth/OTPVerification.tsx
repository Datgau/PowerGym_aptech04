import { type FormEvent, useState, useEffect, useRef } from "react";
import styles from "../../styles/Auth/LoginForm.module.css";
import { Typography, Snackbar, Alert } from "@mui/material";
import { AuthService, type OtpStatusResponse } from "../../services/authService";

type SnackbarSeverity = "success" | "error" | "warning" | "info";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

interface OTPVerificationProps {
  email: string;
  onSubmit: (otp: string) => void;
  submitting: boolean;
}

const OTPVerification = ({ email, onSubmit, submitting }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [resending, setResending] = useState(false);
  const [otpStatus, setOtpStatus] = useState<OtpStatusResponse | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });
  const intervalRef = useRef<number | null>(null);

  const showSnackbar = (message: string, severity: SnackbarSeverity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const loadInitialStatus = async () => {
      try {
        const result = await AuthService.getOtpStatus({ email });
        if (result.success && result.data) {
          setOtpStatus(result.data);
          if (result.data.sessionExpired) setSessionExpired(true);
        }
      } catch (error) {
        console.error("Error loading initial OTP status:", error);
      }
    };
    loadInitialStatus();
  }, [email]);

  useEffect(() => {
    if (!otpStatus || sessionExpired) return;
    intervalRef.current = window.setInterval(() => {
      setOtpStatus((prev) => {
        if (!prev) return prev;
        const newSecondsUntilResend = Math.max(prev.secondsUntilResend - 1, 0);
        const newSessionRemaining = Math.max(prev.sessionRemainingSeconds - 1, 0);
        if (newSessionRemaining <= 0) {
          setSessionExpired(true);
          return prev;
        }
        return {
          ...prev,
          secondsUntilResend: newSecondsUntilResend,
          sessionRemainingSeconds: newSessionRemaining,
          canResend: newSecondsUntilResend <= 0,
          message: newSecondsUntilResend <= 0 ? "Can resend OTP" : "Please wait before resending",
        };
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [otpStatus, sessionExpired]);

  const handleResend = async () => {
    if (!otpStatus?.canResend || resending) return;
    setResending(true);
    try {
      const result = await AuthService.resendOtp({ email });
      if (result.success) {
        setOtp("");
        showSnackbar("🚀 OTP mới đang được gửi đến email của bạn! Vui lòng kiểm tra hộp thư.", "success");
        setOtpStatus((prev) =>
            prev ? { ...prev, secondsUntilResend: 60, canResend: false, message: "Please wait before resending" } : null
        );
      } else {
        showSnackbar(result.message || "Failed to resend OTP", "error");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      showSnackbar("Failed to resend OTP. Please try again.", "error");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        onSubmit(otp.trim() );
    } catch (error) {
      showSnackbar(`Failed to verify OTP. Please try again.`, "error");
    }
  };

  const handleChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 6);
    setOtp(numbersOnly);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const SnackbarComponent = (
      <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%", borderRadius: 2, fontWeight: 500 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
  );

  if (sessionExpired) {
    return (
        <>
          {SnackbarComponent}
          <div className={styles.authForm} style={{ textAlign: "center" }}>
            <Typography variant="h6" style={{ color: "#ff4444", marginBottom: "16px" }}>
              Session Expired
            </Typography>
            <Typography variant="body2" style={{ color: "#98a2b3", marginBottom: "16px" }}>
              Your registration session has expired. Please register again.
            </Typography>
            <button className={styles.authSubmit} onClick={() => (window.location.href = "/register")}>
              Back to Register
            </button>
          </div>
        </>
    );
  }

  if (!otpStatus) {
    return (
        <div className={styles.authForm} style={{ textAlign: "center" }}>
          <Typography variant="body2" style={{ color: "#98a2b3" }}>
            Loading OTP status...
          </Typography>
        </div>
    );
  }

  return (
      <>
        {SnackbarComponent}
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            <Typography variant="body1" style={{ color: "primary" }}>
              OTP code has been sent to: <strong>{email}</strong>
            </Typography>
            {otpStatus.sessionRemainingSeconds > 0 && (
                <Typography variant="body1" style={{ color: "#ffa500", marginTop: 10 }}>
                  Session expires in {formatTime(otpStatus.sessionRemainingSeconds)}
                </Typography>
            )}
          </div>

          <div className={styles.formGroup}>
            <input
                id="otp-code"
                className={styles.formInput}
                value={otp}
                placeholder="123456"
                autoFocus
                inputMode="numeric"
                maxLength={6}
                style={{ textAlign: "center", letterSpacing: "8px", fontSize: "22px", fontWeight: 600 }}
                onChange={(e) => handleChange(e.target.value)}
            />
            <label htmlFor="otp-code">OTP Code (6 digits)</label>
          </div>

          <button className={styles.authSubmit} type="submit" disabled={submitting || otp.length !== 6}>
            {submitting ? "Verifying..." : "Verify OTP"}
          </button>

          <button
              className={styles.authSubmit}
              type="button"
              onClick={handleResend}
              disabled={resending || !otpStatus.canResend || submitting}
              style={{
                marginTop: "8px",
                cursor: otpStatus.canResend ? "pointer" : "not-allowed",
                opacity: otpStatus.canResend ? 1 : 0.6,
              }}
          >
            {resending ? "Sending..." : otpStatus.canResend ? "Resend OTP" : `Resend in ${otpStatus.secondsUntilResend}s`}
          </button>
        </form>
      </>
  );
};

export default OTPVerification;