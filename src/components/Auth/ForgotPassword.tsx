import { type FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import AuthLayout from "./AuthLayout";
import styles from "../../styles/Auth/Forgotpassword.module.css";
import { AuthService } from "../../services/authService";
import { getApiErrorMessage } from "../../until/errorHandler";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const [sent, setSent] = useState(false);

    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        type: "success" | "error";
    }>({
        open: false,
        message: "",
        type: "success",
    });

    const validateEmail = (value: string) => {
        if (!value.trim()) return "Email is required";
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) return "Please enter a valid email address";
        return undefined;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const err = validateEmail(email);
        setError(err);
        if (err) return;

        setSubmitting(true);

        try {
            const res = await AuthService.forgotPassword(email);

            if (res.success) {
                setSent(true);
            } else {
                setSnackbar({
                    open: true,
                    type: "error",
                    message: res.message || "Failed to send reset email. Please try again.",
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

    // Success state
    if (sent) {
        return (
            <AuthLayout
                activeTab="login"
                title="Check your email"
                subtitle="We've sent you a password reset link"
            >
                <div className={styles.forgotHeader}>
                    <div className={styles.forgotIcon}>📬</div>
                    <h2 className={styles.forgotTitle}>Email sent!</h2>
                    <p className={styles.forgotSubtitle}>
                        We sent a reset link to <strong>{email}</strong>.<br />
                        The link expires in <strong>10 minutes</strong>.
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                    <button
                        className={styles.authSubmit}
                        onClick={() => navigate("/login")}
                    >
                        Back to Login
                    </button>
                    <button
                        className={styles.authSubmit}
                        style={{ background: 'transparent', color: '#64748b', border: '2px solid #e4e7ec', boxShadow: 'none' }}
                        onClick={() => setSent(false)}
                    >
                        Try another email
                    </button>
                </div>

                <p className={styles.authFooter} style={{ marginTop: '1rem' }}>
                    Didn't receive it? Check your spam folder.
                </p>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            activeTab="login"
            title="Forgot Password"
            subtitle="Enter your email to receive a password reset link"
        >
            <div className={styles.forgotHeader}>
                <div className={styles.forgotIcon}>🔑</div>
                <h2 className={styles.forgotTitle}>Reset your password</h2>
                <p className={styles.forgotSubtitle}>
                    We'll send a secure link to your inbox so you can create a new password.
                </p>
            </div>

            <form className={styles.authForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <input
                        id="forgot-email"
                        type="email"
                        className={`${styles.formInput} ${error ? styles.formInputError : ""}`}
                        value={email}
                        placeholder="e.g. member@powergym.com"
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError(undefined);
                        }}
                        onBlur={() => setError(validateEmail(email))}
                        autoComplete="email"
                    />
                    <label htmlFor="forgot-email">Email address</label>

                    {error ? (
                        <span className={styles.errorText}>{error}</span>
                    ) : (
                        <span className={styles.inputHint}>
                            Check your spam folder if the email doesn't arrive within a minute.
                        </span>
                    )}
                </div>

                <button className={styles.authSubmit} disabled={submitting} type="submit">
                    {submitting ? (
                        <span className={styles.authSubmitLoading}>
                            <span className={styles.spinner} />
                            Sending…
                        </span>
                    ) : (
                        "Send Reset Link"
                    )}
                </button>
            </form>

            <p className={styles.authFooter}>
                Remember your password?{" "}
                <Link to="/login" className={styles.link}>
                    Back to Login
                </Link>
            </p>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
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

export default ForgotPassword;