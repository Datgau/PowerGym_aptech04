import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Stack,
  InputAdornment,
  Avatar,
} from '@mui/material';
import { Close, Person, CheckCircle, MonetizationOn, Build } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { createUser, checkEmailExists } from '../../../../services/adminService';
import { gymServiceApi, type GymServiceDto } from '../../../../services/gymService';
import {
  registerServiceForUser,
  confirmCounterPayment,
} from '../../../../services/serviceRegistrationService';
import { RegistrationType } from '../../../../types';

/* ─── Styled ─────────────────────────────────────────────── */

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    maxWidth: 620,
    width: '100%',
    margin: 16,
  },
});

const StyledDialogTitle = styled(DialogTitle)({
  background: 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)',
  color: 'white',
  padding: '20px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const StepContent = styled(Box)({
  padding: '24px 0',
  minHeight: 300,
});

/* ─── Props ──────────────────────────────────────────────── */

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface UserFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface CreatedUser {
  id: number;
  fullName: string;
  email: string;
}

const steps = ['User Information', 'Select Service & Pay'];

/* ─── Component ──────────────────────────────────────────── */

const RegisterServiceForMemberModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailChecking, setEmailChecking] = useState(false);

  // Step 1
  const [userForm, setUserForm] = useState<UserFormData>({ fullName: '', email: '', phoneNumber: '' });
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);

  // Step 2
  const [services, setServices] = useState<GymServiceDto[]>([]);
  const [selectedService, setSelectedService] = useState<GymServiceDto | null>(null);

  // Payment
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  /* ── Effects ── */

  useEffect(() => {
    if (open && activeStep === 1) loadServices();
  }, [open, activeStep]);

  /* ── Helpers ── */

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await gymServiceApi.getServicesActive();
      if (res.success) setServices(res.data);
    } catch {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: keyof UserFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (error) setError(null);
    };

  const handleEmailBlur = async () => {
    if (!userForm.email.trim()) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      setError('Please enter a valid email address');
      return;
    }
    try {
      setEmailChecking(true);
      setError(null);
      const res = await checkEmailExists(userForm.email);
      if (res.success && res.data) setError('This email is already registered in the system');
    } catch {
      // silent
    } finally {
      setEmailChecking(false);
    }
  };

  const validateForm = (): boolean => {
    if (!userForm.fullName.trim()) { setError('Full name is required'); return false; }
    if (!userForm.email.trim()) { setError('Email is required'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) { setError('Please enter a valid email address'); return false; }
    if (!userForm.phoneNumber.trim()) { setError('Phone number is required'); return false; }
    return true;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      setError(null);
      const res = await createUser({
        fullName: userForm.fullName,
        email: userForm.email,
        phoneNumber: userForm.phoneNumber,
        roleId: 1, // USER role
      });
      if (res.success) {
        setCreatedUser({ id: res.data.id, fullName: res.data.fullName, email: res.data.email });
        setActiveStep(1);
      } else {
        setError(res.message || 'Failed to create user');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const doRegisterService = async (): Promise<number | null> => {
    if (!selectedService || !createdUser) return null;
    try {
      setLoading(true);
      setError(null);
      // Register service under the newly-created user's ID, not the current admin
      const res = await registerServiceForUser(createdUser.id, {
        serviceId: selectedService.id,
        registrationType: RegistrationType.COUNTER,
      });
      if (res.success) {
        return res.data.id;
      } else {
        setError(res.message || 'Failed to register service');
        return null;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register service');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleCashPayment = async () => {
    if (!selectedService) return;
    const regId = await doRegisterService();
    if (!regId) return;
    try {
      setLoading(true);
      const res = await confirmCounterPayment(regId, selectedService.price);
      if (res.success) {
        setPaymentConfirmed(true);
        setTimeout(() => { onSuccess(); handleClose(); }, 1500);
      } else {
        setError(res.message || 'Failed to confirm payment');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to confirm payment');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setUserForm({ fullName: '', email: '', phoneNumber: '' });
    setCreatedUser(null);
    setSelectedService(null);
    setPaymentConfirmed(false);
    setError(null);
    setEmailChecking(false);
    onClose();
  };

  /* ── Render steps ── */

  const renderStep0 = () => (
    <StepContent>
      <Typography variant="h6" gutterBottom>Create New Member Account</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter the member's information. A password will be sent to their email.
      </Typography>
      <Stack spacing={3}>
        <TextField
          fullWidth label="Full Name"
          value={userForm.fullName}
          onChange={handleFormChange('fullName')}
          required disabled={loading}
        />
        <TextField
          fullWidth label="Email Address" type="email"
          value={userForm.email}
          onChange={handleFormChange('email')}
          onBlur={handleEmailBlur}
          required disabled={loading}
          error={!!error && error.includes('email')}
          helperText={error && error.includes('email') ? error : ''}
          InputProps={{
            endAdornment: emailChecking && (
              <InputAdornment position="end"><CircularProgress size={20} /></InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth label="Phone Number"
          value={userForm.phoneNumber}
          onChange={handleFormChange('phoneNumber')}
          required disabled={loading}
        />
      </Stack>
    </StepContent>
  );

  const renderStep1 = () => (
    <StepContent>
      {paymentConfirmed ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <CheckCircle sx={{ fontSize: 80, color: '#045668', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#045668', mb: 1 }}>
            Registration Successful!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Service registered for {createdUser?.fullName}
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#374151' }}>
            Select Service
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose a service for <strong>{createdUser?.fullName}</strong>, then select payment method.
          </Typography>

          {loading && !selectedService ? (
            <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
          ) : (
            <Box sx={{ display: 'grid', gap: 2, maxHeight: 280, overflowY: 'auto', mb: 3 }}>
              {services.map((service) => (
                <Card
                  key={service.id}
                  onClick={() => { setSelectedService(service); setError(null); }}
                  sx={{
                    cursor: 'pointer',
                    border: selectedService?.id === service.id ? '2px solid #045668' : '1px solid #e5e7eb',
                    borderRadius: 3,
                    transition: 'all 0.2s ease',
                    bgcolor: selectedService?.id === service.id ? '#f0f9ff' : 'white',
                    '&:hover': { borderColor: '#045668', boxShadow: '0 4px 12px rgba(4,86,104,0.15)' },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                        <Avatar src={service.images?.[0]} variant="rounded" sx={{ width: 52, height: 52, bgcolor: '#e0f2fe' }}>
                          <Build sx={{ color: '#045668' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>
                            {service.name}
                          </Typography>
                          <Chip
                            label={service.category?.displayName || service.category?.name}
                            size="small"
                            sx={{ mt: 0.5, bgcolor: '#f3f4f6', color: '#374151' }}
                          />
                          {service.duration && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              {service.duration} days
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ color: '#045668', fontWeight: 800, whiteSpace: 'nowrap' }}>
                        {service.price.toLocaleString('vi-VN')}đ
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Payment buttons — shown only when a service is selected */}
          {selectedService && (
            <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, p: 3, bgcolor: '#f8faff' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151', mb: 2 }}>
                Confirm Payment for <strong>{selectedService.name}</strong> — {selectedService.price.toLocaleString('vi-VN')}đ
              </Typography>
              <Button
                variant="contained" fullWidth
                onClick={handleCashPayment}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <MonetizationOn />}
                sx={{
                  background: 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #034557 0%, #0099dd 40%, #0f5299 100%)' },
                  borderRadius: 2, py: 1.5,
                }}
              >
                {loading ? 'Processing...' : 'Confirm Cash Payment'}
              </Button>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Service will be activated immediately after confirmation.
                </Typography>
              </Alert>
            </Box>
          )}
        </>
      )}
    </StepContent>
  );

  /* ── Main render ── */

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <StyledDialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Person />
            Register Service for Member
          </Box>
          <Button onClick={handleClose} sx={{ color: 'white', minWidth: 'auto', p: 0.5 }}>
            <Close />
          </Button>
        </StyledDialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, pt: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}><StepLabel>{label}</StepLabel></Step>
              ))}
            </Stepper>
          </Box>

          {error && (
            <Box sx={{ px: 3, pt: 2 }}>
              <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
            </Box>
          )}

          <Box sx={{ px: 3 }}>
            {activeStep === 0 ? renderStep0() : renderStep1()}
          </Box>
        </DialogContent>

        {!paymentConfirmed && (
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={activeStep === 0 ? handleClose : () => { setError(null); setActiveStep(0); }}
              disabled={loading}
            >
              {activeStep === 0 ? 'Cancel' : 'Back'}
            </Button>
            <Box sx={{ flex: 1 }} />
            {activeStep === 0 && (
              <Button
                variant="contained"
                onClick={handleCreateUser}
                disabled={loading || emailChecking}
                startIcon={loading ? <CircularProgress size={16} /> : <Person />}
                sx={{
                  background: 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #034557 0%, #0099dd 40%, #0f5299 100%)' },
                }}
              >
                Create User & Continue
              </Button>
            )}
          </DialogActions>
        )}
      </StyledDialog>
  );
};

export default RegisterServiceForMemberModal;
