import { type FormEvent, useState } from "react";
import styles from "../../styles/Auth/LoginForm.module.css";

interface RegisterFormProps {
  onSubmit: (formData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
  submitting: boolean;
}

const RegisterForm = ({ onSubmit, submitting }: RegisterFormProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ fullName, email, password, confirmPassword });
  };

  return (
    <form className={styles.authForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="register-fullname">Full Name</label>
        <input
          id="register-fullname"
          className={styles.formInput}
          value={fullName}
          placeholder="e.g: John Doe"
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          className={styles.formInput}
          type="email"
          value={email}
          placeholder="e.g: member@powergym.com"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          className={`${styles.formInput} ${styles.formInputPassword}`}
          type="password"
          value={password}
          placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="register-confirm-password">Confirm Password</label>
        <input
          id="register-confirm-password"
          className={`${styles.formInput} ${styles.formInputPassword}`}
          type="password"
          value={confirmPassword}
          placeholder="••••••••"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <div className={styles.formExtra}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            required
          />
          I agree to the{" "}
          <a className={styles.link} href="#">
            Terms of Service
          </a>
        </label>
      </div>

      <button className={styles.authSubmit} type="submit" disabled={submitting}>
        {submitting ? "Registering..." : "Create PowerGym Account"}
      </button>
    </form>
  );
};

export default RegisterForm;
