import { useState, type FormEvent, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Snackbar, Alert, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "../../styles/Auth/Resetpassword.module.css";
import AuthLayout from "./AuthLayout";
import { AuthService } from "../../services/authService";
import { getApiErrorMessage } from "../../until/errorHandler";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [touched, setTouched] = useState(false);
    const [success, setSuccess] = useState(false);

    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        type: "success" | "error";
    }>({
        open: false,
        message: "",
        type: "success",
    });

    // No token → show error immediately
    if (!token) {
        return (
            <AuthLayout title="Invalid Link" subtitle="This reset link is not valid">
                <div className={styles.resetHeader}>
                    <div className={styles.resetIcon}>⚠️</div>
                    <h2 className={styles.resetTitle}>Link expired or invalid</h2>
                    <p className={styles.resetSubtitle}>
                        This password reset link is invalid or has already been used.
                        Please request a new one.
                    </p>
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                    <button
                        className={styles.authSubmit}
                        onClick={() => navigate("/forgot-password")}
                    >
                        Request New Link
                    </button>
                </div>
                <p className={styles.authFooter} style={{ marginTop: '1rem' }}>
                    <Link to="/login" className={styles.link}>← Back to Login</Link>
                </p>
            </AuthLayout>
        );
    }

    // Success state
    if (success) {
        return (
            <AuthLayout title="Password Updated" subtitle="Your password has been reset successfully">
                <div className={styles.resetHeader}>
                    <div className={styles.resetIcon}>✅</div>
                    <h2 className={styles.resetTitle}>All done!</h2>
                    <p className={styles.resetSubtitle}>
                        Your password has been updated. You can now log in with your new password.
                    </p>
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                    <button
                        className={styles.authSubmit}
                        onClick={() => navigate("/login")}
                    >
                        Go to Login
                    </button>
                </div>
            </AuthLayout>
        );
    }

    const isLengthValid = password.length >= 6;
    const isMatch = password === confirmPassword;
    const isValid = isLengthValid && isMatch;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setTouched(true);
        if (!isValid) return;

        setSubmitting(true);

        try {
            const res = await AuthService.resetPassword({
                token,
                newPassword: password,
            });

            if (res.success) {
                setSuccess(true);
            } else {
                setSnackbar({
                    open: true,
                    type: "error",
                    message: res.message || "Failed to reset password. The link may have expired.",
                });
            }
        } catch (err) {
            setSnackbar({
                open: true,
                type: "error",
                message: getApiErrorMessage(err),
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Create a new password for your account"
        >
            <div className={styles.resetHeader}>
                <div className={styles.resetIcon}>🔒</div>
                <h2 className={styles.resetTitle}>Set a new password</h2>
                <p className={styles.resetSubtitle}>
                    Your new password must be at least 6 characters long.
                    The reset link expires in <strong>10 minutes</strong>.
                </p>
            </div>

            <form className={styles.authForm} onSubmit={handleSubmit}>
                {/* New Password */}
                <div className={styles.formGroup}>
                    <input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        className={`${styles.formInput} ${styles.formInputPassword} ${
                            touched && !isLengthValid ? styles.formInputError : ""
                        }`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                    />
                    <label htmlFor="new-password">New password</label>
                    <span className={styles.passwordToggle}>
                        <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            size="small"
                            tabIndex={-1}
                            sx={{ color: "#98a2b3" }}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </span>
                    {touched && !isLengthValid && (
                        <span className={styles.errorText}>
                            Password must be at least 6 characters
                        </span>
                    )}
                </div>

                {/* Confirm Password */}
                <div className={styles.formGroup}>
                    <input
                        id="confirm-password"
                        type={showConfirm ? "text" : "password"}
                        className={`${styles.formInput} ${styles.formInputPassword} ${
                            touched && !isMatch ? styles.formInputError : ""
                        }`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                    />
                    <label htmlFor="confirm-password">Confirm password</label>
                    <span className={styles.passwordToggle}>
                        <IconButton
                            onClick={() => setShowConfirm(!showConfirm)}
                            size="small"
                            tabIndex={-1}
                            sx={{ color: "#98a2b3" }}
                        >
                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </span>
                    {touched && !isMatch && (
                        <span className={styles.errorText}>Passwords do not match</span>
                    )}
                </div>

                {/* Password strength indicator */}
                {password.length > 0 && (
                    <div className={styles.strengthWrapper}>
                        <div className={styles.strengthBar}>
                            <div
                                className={`${styles.strengthFill} ${
                                    password.length < 6
                                        ? styles.strengthWeak
                                        : password.length < 10
                                            ? styles.strengthFair
                                            : styles.strengthStrong
                                }`}
                            />
                        </div>
                        <span className={styles.strengthLabel}>
                            {password.length < 6 ? "Weak" : password.length < 10 ? "Fair" : "Strong"}
                        </span>
                    </div>
                )}

                <button
                    className={styles.authSubmit}
                    type="submit"
                    disabled={submitting || (touched && !isValid)}
                >
                    {submitting ? (
                        <span className={styles.authSubmitLoading}>
                            <span className={styles.spinner} />
                            Updating password…
                        </span>
                    ) : (
                        "Reset Password"
                    )}
                </button>
            </form>

            <p className={styles.authFooter}>
                <Link to="/login" className={styles.link}>← Back to Login</Link>
            </p>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity={snackbar.type} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </AuthLayout>
    );
};

export default ResetPassword;