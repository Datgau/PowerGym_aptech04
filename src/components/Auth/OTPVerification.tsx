import { type FormEvent, useState } from "react";
import styles from "../../styles/Auth/LoginForm.module.css";
import loginStyles from "../../styles/Auth/Login.module.css";

interface OTPVerificationProps {
  email: string;
  onSubmit: (otp: string) => void;
  onBack: () => void;
  submitting: boolean;
}

const OTPVerification = ({ email, onSubmit, onBack, submitting }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(otp.trim());
  };

  return (
    <div>
      <div>
        <h2 className={loginStyles.authCardTitle}>Xác thực tài khoản</h2>
        <p className={loginStyles.authCardSubtitle}>
          Mã OTP đã được gửi đến email <strong>{email}</strong>
        </p>
      </div>

      <form className={styles.authForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="otp-code">Mã OTP (6 số)</label>
          <input
            id="otp-code"
            className={styles.formInput}
            type="text"
            value={otp}
            placeholder="123456"
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        <button className={styles.authSubmit} type="submit" disabled={submitting}>
          {submitting ? "Đang xác thực..." : "Xác thực OTP"}
        </button>

        <button
          type="button"
          className={styles.authSubmit}
          onClick={onBack}
          disabled={submitting}
          style={{ marginTop: '0.75rem', background: '#6b7280' }}
        >
          Quay lại
        </button>
      </form>
    </div>
  );
};

export default OTPVerification;
