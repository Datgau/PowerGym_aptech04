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
                message: "Không tìm thấy email liên kết với tài khoản này.",
            });
            setSubmitting(false);
            return;
        }
        try {
            const response = await AuthService.verifyOtp({ email, otp });

            if (!response.success) {
                throw new Error(response.message || "Xác thực OTP thất bại");
            }
            setFeedback({
                type: "success",
                message: response.message || "Xác thực thành công!",
            });
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Xác thực OTP thất bại, vui lòng thử lại.";
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
                <h1>Xác thực tài khoản</h1>
                <p>
                    Vui lòng nhập mã OTP được gửi đến email <strong>{email}</strong> để hoàn tất đăng ký.
                </p>
            </section>

            <section className="auth-panel auth-panel--card">
                <div>
                    <h2 className="auth-card-title">Xác thực OTP</h2>
                    <p className="auth-card-subtitle">
                        Nhập mã OTP để kích hoạt tài khoản của bạn.
                    </p>
                </div>

                {feedback && (
                    <div className={`status-message ${feedback.type}`}>
                        {feedback.message}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="otp">Mã OTP</label>
                        <input
                            id="otp"
                            className="form-input"
                            type="text"
                            placeholder="Nhập 6 chữ số"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    <button className="auth-submit" type="submit" disabled={submitting}>
                        {submitting ? "Đang xác thực..." : "Xác thực OTP"}
                    </button>
                </form>
                <p className="auth-footer">
                    Chưa nhận được OTP?{" "}
                    <a className="link" href="#">
                        Gửi lại
                    </a>
                </p>
            </section>
        </main>
    );
};

export default VerifyOtp;
