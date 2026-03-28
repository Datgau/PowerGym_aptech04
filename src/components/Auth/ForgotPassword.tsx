import { type FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import AuthLayout from "./AuthLayout";
import styles from "../../styles/Auth/Forgotpassword.module.css"
import { AuthService } from "../../services/authService";
import { getApiErrorMessage } from "../../until/errorHandler";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | undefined>();

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
                setSnackbar({
                    open: true,
                    type: "success",
                    message: "A password reset link has been sent to your email.",
                });
                setTimeout(() => navigate("/login"), 2000);
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

    return (
        <AuthLayout
            activeTab="login"
            title="Forgot Password"
            subtitle="Enter your email to receive a password reset link"
        >
            {/* Header icon + description */}
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
                autoHideDuration={4000}
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