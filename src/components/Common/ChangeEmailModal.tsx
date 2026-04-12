import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Typography,
  Stack,
  Box,
  CircularProgress,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Close, Email as EmailIcon, Lock } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { requestEmailChangeOtp, verifyCurrentEmailOtp, verifyNewEmailOtp } from '../../services/userService';

interface ChangeEmailModalProps {
  open: boolean;
  currentEmail: string;
  onClose: () => void;
  onSuccess: (newEmail: string) => void;
}

type Step = 'enterEmail' | 'verifyCurrentEmail' | 'verifyNewEmail';

const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({
  open,
  currentEmail,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<Step>('enterEmail');
  const [newEmail, setNewEmail] = useState('');
  const [currentEmailOtp, setCurrentEmailOtp] = useState('');
  const [newEmailOtp, setNewEmailOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const steps = ['Enter New Email', 'Verify Current Email', 'Verify New Email'];
  const activeStep = step === 'enterEmail' ? 0 : step === 'verifyCurrentEmail' ? 1 : 2;

  const handleClose = () => {
    if (!loading) {
      setStep('enterEmail');
      setNewEmail('');
      setCurrentEmailOtp('');
      setNewEmailOtp('');
      setCountdown(0);
      onClose();
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 1: Request OTP (sends to current email)
  const handleRequestOtp = async () => {
    if (!newEmail.trim()) {
      toast.error('Please enter new email address');
      return;
    }
    if (!validateEmail(newEmail)) {
      toast.error('Invalid email format');
      return;
    }
    if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      toast.error('New email must be different from current email');
      return;
    }

    try {
      setLoading(true);
      await requestEmailChangeOtp(newEmail);
      toast.success('OTP has been sent to your current email');
      setStep('verifyCurrentEmail');
      startCountdown();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify current email OTP (sends OTP to new email)
  const handleVerifyCurrentEmail = async () => {
    if (!currentEmailOtp.trim()) {
      toast.error('Please enter OTP code');
      return;
    }
    if (currentEmailOtp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }

    try {
      setLoading(true);
      await verifyCurrentEmailOtp(currentEmailOtp);
      toast.success('Current email verified! OTP sent to new email');
      setStep('verifyNewEmail');
      setCurrentEmailOtp('');
      startCountdown();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify new email OTP and complete change
  const handleVerifyNewEmail = async () => {
    if (!newEmailOtp.trim()) {
      toast.error('Please enter OTP code');
      return;
    }
    if (newEmailOtp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }

    try {
      setLoading(true);
      await verifyNewEmailOtp(newEmail, newEmailOtp);
      toast.success('Email changed successfully');
      onSuccess(newEmail);
      handleClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    try {
      setLoading(true);
      if (step === 'verifyCurrentEmail') {
        await requestEmailChangeOtp(newEmail);
        toast.success('OTP has been resent to your current email');
      } else if (step === 'verifyNewEmail') {
        await verifyCurrentEmailOtp(currentEmailOtp);
        toast.success('OTP has been resent to your new email');
      }
      startCountdown();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Change Email Address
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            {step === 'enterEmail' && 'Enter your new email'}
            {step === 'verifyCurrentEmail' && 'Verify current email'}
            {step === 'verifyNewEmail' && 'Verify new email'}
          </Typography>
        </Box>
        <IconButton 
          onClick={handleClose} 
          disabled={loading}
          sx={{ 
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Current Email Info */}
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={600} mb={0.5}>
            Current Email:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentEmail}
          </Typography>
        </Alert>

        {/* Step 1: Enter New Email */}
        {step === 'enterEmail' && (
          <Stack spacing={3}>
            <TextField
              label="New Email Address"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              fullWidth
              required
              disabled={loading}
              autoFocus
              slotProps={{
                input: {
                  startAdornment: <EmailIcon sx={{ mr: 1, color: '#64748b' }} />,
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />

            <Button
              variant="contained"
              onClick={handleRequestOtp}
              disabled={loading}
              fullWidth
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                py: 1.5,
                background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0052cc 0%, #003d99 100%)',
                }
              }}
            >
              Continue
            </Button>
          </Stack>
        )}

        {/* Step 2: Verify Current Email OTP */}
        {step === 'verifyCurrentEmail' && (
          <Stack spacing={3}>
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                We've sent a 6-digit OTP code to your <strong>current email</strong> ({currentEmail}) to verify your identity.
              </Typography>
            </Alert>

            <TextField
              label="Enter OTP Code"
              value={currentEmailOtp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setCurrentEmailOtp(value);
              }}
              fullWidth
              required
              disabled={loading}
              autoFocus
              placeholder="000000"
              slotProps={{
                input: {
                  startAdornment: <Lock sx={{ mr: 1, color: '#64748b' }} />,
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: 20,
                  letterSpacing: 8,
                  fontFamily: 'monospace',
                }
              }}
            />

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => setStep('enterEmail')}
                disabled={loading}
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleVerifyCurrentEmail}
                disabled={loading}
                fullWidth
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0052cc 0%, #003d99 100%)',
                  }
                }}
              >
                Verify
              </Button>
            </Stack>

            {/* Resend OTP */}
            <Box textAlign="center">
              {countdown > 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Resend OTP in {countdown}s
                </Typography>
              ) : (
                <Button
                  variant="text"
                  onClick={handleResendOtp}
                  disabled={loading}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Resend OTP Code
                </Button>
              )}
            </Box>
          </Stack>
        )}

        {/* Step 3: Verify New Email OTP */}
        {step === 'verifyNewEmail' && (
          <Stack spacing={3}>
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                We've sent a 6-digit OTP code to your <strong>new email</strong> ({newEmail}) to confirm ownership.
              </Typography>
            </Alert>

            <TextField
              label="Enter OTP Code"
              value={newEmailOtp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setNewEmailOtp(value);
              }}
              fullWidth
              required
              disabled={loading}
              autoFocus
              placeholder="000000"
              slotProps={{
                input: {
                  startAdornment: <Lock sx={{ mr: 1, color: '#64748b' }} />,
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: 20,
                  letterSpacing: 8,
                  fontFamily: 'monospace',
                }
              }}
            />

            <Button
              variant="contained"
              onClick={handleVerifyNewEmail}
              disabled={loading}
              fullWidth
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                py: 1.5,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                }
              }}
            >
              Complete Email Change
            </Button>

            {/* Resend OTP */}
            <Box textAlign="center">
              {countdown > 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Resend OTP in {countdown}s
                </Typography>
              ) : (
                <Button
                  variant="text"
                  onClick={handleResendOtp}
                  disabled={loading}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Resend OTP Code
                </Button>
              )}
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmailModal;
