import {type FormEvent, useState} from "react";
import styles from "../../styles/Auth/LoginForm.module.css";

interface LoginFormProps {
    onSubmit: (email: string, password: string, remember: boolean) => void;
    submitting: boolean;
}

const LoginForm = ({ onSubmit, submitting }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(email.trim(), password, remember);
    };

    return (
        <form className={styles.authForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="login-email">Email</label>
                <input
                    id="login-email"
                    className={styles.formInput}
                    type="email"
                    value={email}
                    placeholder="vd: member@powergym.com"
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="login-password">Password</label>
                <input
                    id="login-password"
                    className={`${styles.formInput} ${styles.formInputPassword}`}
                    type="password"
                    value={password}
                    placeholder="••••••••"
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
            </div>

            <div className={styles.formExtra}>
                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={(event) => setRemember(event.target.checked)}
                    />
                    Remember me
                </label>
                <a className={styles.link} href="#">
                    Forgot password?
                </a>
            </div>

            <button className={styles.authSubmit} type="submit" disabled={submitting}>
                {submitting ? "Logging in..." : "Login to PowerGym"}
            </button>
        </form>
    );
};

export default LoginForm;