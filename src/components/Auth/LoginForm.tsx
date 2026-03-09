import { type FormEvent, useState } from "react";
import styles from "../../styles/Auth/LoginForm.module.css";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';

interface LoginFormProps {
    onSubmit: (email: string, password: string, remember: boolean) => void;
    submitting: boolean;
}

const LoginForm = ({ onSubmit, submitting }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    const validateEmail = (value: string): string | undefined => {
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        return undefined;
    };

    const validatePassword = (value: string): string | undefined => {
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return undefined;
    };

    const handleBlur = (field: string, value: string) => {
        let error: string | undefined;
        
        switch (field) {
            case 'email':
                error = validateEmail(value);
                break;
            case 'password':
                error = validatePassword(value);
                break;
        }
        
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const newErrors = {
            email: validateEmail(email),
            password: validatePassword(password)
        };
        
        setErrors(newErrors);
        
        if (Object.values(newErrors).some(error => error !== undefined)) {
            return;
        }
        
        onSubmit(email.trim(), password, remember);
    };

    return (
        <form className={styles.authForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <input
                    id="login-email"
                    className={`${styles.formInput} ${errors.email ? styles.formInputError : ''}`}
                    type="email"
                    value={email}
                    placeholder="vd: member@powergym.com"
                    onChange={(event) => {
                        setEmail(event.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    onBlur={(event) => handleBlur('email', event.target.value)}
                />
                <label htmlFor="login-email">Email</label>
                {errors.email && (
                    <Typography className={styles.errorText}>
                        {errors.email}
                    </Typography>
                )}
            </div>

            <div className={styles.formGroup}>
                <input
                    id="login-password"
                    className={`${styles.formInput} ${styles.formInputPassword} ${errors.password ? styles.formInputError : ''}`}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="••••••••"
                    onChange={(event) => {
                        setPassword(event.target.value);
                        if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    onBlur={(event) => handleBlur('password', event.target.value)}
                />
                <label htmlFor="login-password">Password</label>
                <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                    sx={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#98a2b3',
                        zIndex: 2,
                        '&:hover': {
                            color: '#00b4ff',
                            background: 'rgba(0, 180, 255, 0.08)'
                        }
                    }}
                >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
                {errors.password && (
                    <Typography className={styles.errorText}>
                        {errors.password}
                    </Typography>
                )}
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
