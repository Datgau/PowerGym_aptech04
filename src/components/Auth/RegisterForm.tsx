import { type FormEvent, useState } from "react";
import styles from "../../styles/Auth/LoginForm.module.css";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateFullName = (value: string): string | undefined => {
    if (!value.trim()) return "Full name is required";
    if (value.trim().length < 2) return "Full name must be at least 2 characters";
    if (value.trim().length > 50) return "Full name must not exceed 50 characters";
    return undefined;
  };

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return undefined;
  };

  const validatePassword = (value: string): string | undefined => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    if (value.length > 50) return "Password must not exceed 50 characters";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(value)) return "Password must contain at least one number";
    return undefined;
  };

  const validateConfirmPassword = (value: string, passwordValue: string): string | undefined => {
    if (!value) return "Please confirm your password";
    if (value !== passwordValue) return "Passwords do not match";
    return undefined;
  };

  const handleBlur = (field: string, value: string) => {
    let error: string | undefined;
    
    switch (field) {
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        if (!error && confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: validateConfirmPassword(confirmPassword, value)
          }));
        }
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value, password);
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const newErrors = {
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password)
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error !== undefined)) {
      return;
    }
    
    onSubmit({ fullName: fullName.trim(), email: email.trim(), password, confirmPassword });
  };

  return (
    <form className={styles.authForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <input
          id="register-fullname"
          className={`${styles.formInput} ${errors.fullName ? styles.formInputError : ''}`}
          value={fullName}
          placeholder="e.g: John Doe"
          onChange={(e) => {
            setFullName(e.target.value);
            if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
          }}
          onBlur={(e) => handleBlur('fullName', e.target.value)}
        />
        <label htmlFor="register-fullname">Full Name</label>
        {errors.fullName && (
          <Typography className={styles.errorText}>
            {errors.fullName}
          </Typography>
        )}
      </div>

      <div className={styles.formGroup}>
        <input
          id="register-email"
          className={`${styles.formInput} ${errors.email ? styles.formInputError : ''}`}
          type="email"
          value={email}
          placeholder="e.g: member@powergym.com"
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
          }}
          onBlur={(e) => handleBlur('email', e.target.value)}
        />
        <label htmlFor="register-email">Email</label>
        {errors.email && (
          <Typography className={styles.errorText}>
            {errors.email}
          </Typography>
        )}
      </div>

      <div className={styles.formGroup}>
        <input
          id="register-password"
          className={`${styles.formInput} ${styles.formInputPassword} ${errors.password ? styles.formInputError : ''}`}
          type={showPassword ? "text" : "password"}
          value={password}
          placeholder="••••••••"
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
          }}
          onBlur={(e) => handleBlur('password', e.target.value)}
        />
        <label htmlFor="register-password">Password</label>
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

      <div className={styles.formGroup}>
        <input
          id="register-confirm-password"
          className={`${styles.formInput} ${styles.formInputPassword} ${errors.confirmPassword ? styles.formInputError : ''}`}
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          placeholder="••••••••"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
          }}
          onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
        />
        <label htmlFor="register-confirm-password">Confirm Password</label>
        <IconButton
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          edge="end"
          size="small"
          sx={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#98a2b3',
            '&:hover': {
              color: '#00b4ff',
              background: 'rgba(0, 180, 255, 0.08)'
            }
          }}
        >
          {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
        </IconButton>
        {errors.confirmPassword && (
          <Typography className={styles.errorText}>
            {errors.confirmPassword}
          </Typography>
        )}
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
          <a className={styles.link} href="/terms-of-service">
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
