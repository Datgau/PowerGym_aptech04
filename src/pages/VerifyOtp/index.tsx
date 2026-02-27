// src/pages/VerifyOtp/index.tsx
import { useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { AuthService } from "../../services/authService";

type Feedback = {
    type: "success" | "error";
    message: string;
};

const VerifyOtp = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");
    const [otp, setOtp] = useState("");
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        setFeedback(null);

        if (!email) {
            setFeedback({
                type: "error",
                message: "Email not found for this account.",
            });
            setSubmitting(false);
            return;
        }
        try {
            const response = await AuthService.verifyOtp({ email, otp });

            if (!response.success) {
                throw new Error(response.message || "OTP verification failed");
            }
            setFeedback({
                type: "success",
                message: response.message || "Verification successful!",
            });
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "OTP verification failed, please try again.";
            setFeedback({
                type: "error",
                message,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-panel auth-panel--accent">
                <span className="auth-logo">HeartBeat</span>
                <h1>Verify Account</h1>
                <p>
                    Please enter the OTP code sent to <strong>{email}</strong> to complete registration.
                </p>
            </section>

            <section className="auth-panel auth-panel--card">
                <div>
                    <h2 className="auth-card-title">Verify OTP</h2>
                    <p className="auth-card-subtitle">
                        Enter the OTP code to activate your account.
                    </p>
                </div>

                {feedback && (
                    <div className={`status-message ${feedback.type}`}>
                        {feedback.message}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="otp">OTP Code</label>
                        <input
                            id="otp"
                            className="form-input"
                            type="text"
                            placeholder="Enter 6 digits"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    <button className="auth-submit" type="submit" disabled={submitting}>
                        {submitting ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>
                <p className="auth-footer">
                    Didn't receive OTP?{" "}
                    <a className="link" href="#">
                        Resend
                    </a>
                </p>
            </section>
        </main>
    );
};

export default VerifyOtp;
