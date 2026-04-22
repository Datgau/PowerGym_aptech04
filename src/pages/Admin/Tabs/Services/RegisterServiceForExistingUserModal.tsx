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
  Avatar,
  InputAdornment,
} from '@mui/material';
import {
  Close,
  CheckCircle,
  Search,
  Email,
  Phone,
  AccountCircle,
  MonetizationOn,
  Build,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { searchUsers, type UserResponse } from '../../../../services/adminService';
import { gymServiceApi, type GymServiceDto } from '../../../../services/gymService';
import {
  registerServiceForUser,
  confirmCounterPayment,
  getUserRegistrations,
} from '../../../../services/serviceRegistrationService';
import { RegistrationType } from '../../../../types';

/* ─── Styled ─────────────────────────────────────────────── */

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    maxWidth: 700,
    width: '100%',
    margin: 16,
    maxHeight: '90vh',
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
  minHeight: 400,
});

const UserCard = styled(Card)({
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': { borderColor: '#045668', boxShadow: '0 4px 12px rgba(4,86,104,0.15)' },
  '&.selected': { borderColor: '#045668', backgroundColor: '#f0f9ff', boxShadow: '0 4px 12px rgba(4,86,104,0.15)' },
});

const ServiceCard = styled(Card)({
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': { borderColor: '#045668', boxShadow: '0 4px 12px rgba(4,86,104,0.15)' },
  '&.selected': { borderColor: '#045668', backgroundColor: '#f0f9ff', boxShadow: '0 4px 12px rgba(4,86,104,0.15)' },
});

/* ─── Props ──────────────────────────────────────────────── */

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const steps = ['Select User', 'Select Service & Pay'];

/* ─── Component ──────────────────────────────────────────── */

const RegisterServiceForExistingUserModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Step 2
  const [services, setServices] = useState<GymServiceDto[]>([]);
  const [selectedService, setSelectedService] = useState<GymServiceDto | null>(null);
  const [userRegistrations, setUserRegistrations] = useState<number[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  // Payment
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  /* ── Effects ── */

  useEffect(() => {
    if (open) {
      resetForm();
      loadServices();
    }
  }, [open]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      doSearch();
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  // Load user registrations when user is selected
  useEffect(() => {
    if (selectedUser) {
      loadUserRegistrations();
    } else {
      setUserRegistrations([]);
    }
  }, [selectedUser]);

  /* ── Helpers ── */

  const resetForm = () => {
    setActiveStep(0);
    setError(null);
    setSearchTerm('');
    setUsers([]);
    setSelectedUser(null);
    setSelectedService(null);
    setUserRegistrations([]);
    setLoadingRegistrations(false);
    setPaymentSuccess(false);
    setLoading(false);
    setIsClosing(false);
  };

  const loadServices = async () => {
    try {
      const res = await gymServiceApi.getServicesActive();
      if (res.success) setServices(res.data);
    } catch {
      setError('Failed to load services');
    }
  };

  const loadUserRegistrations = async () => {
    if (!selectedUser) return;
    try {
      setLoadingRegistrations(true);
      // Use the new getUserRegistrations function that searches by email
      const response = await getUserRegistrations(selectedUser.email);
      
      if (response.success) {
        // Extract service IDs from the user's registrations
        const serviceIds = response.data.map((reg) => reg.service.id);
        setUserRegistrations(serviceIds);
        console.log(`Loaded ${serviceIds.length} registered services for user ${selectedUser.email}:`, serviceIds);
      } else {
        console.error('Failed to load user registrations:', response.message);
        setUserRegistrations([]);
      }
    } catch (error) {
      console.error('Failed to load user registrations:', error);
      setUserRegistrations([]);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const doSearch = async () => {
    try {
      setSearchLoading(true);
      const res = await searchUsers(searchTerm, 'USER', 0, 10);
      if (res.success) setUsers(res.data.content);
      else setError(res.message || 'Failed to search users');
    } catch {
      setError('Failed to search users');
    } finally {
      setSearchLoading(false);
    }
  };

  /* ── Step navigation ── */

  const handleNext = () => {
    if (activeStep === 0 && !selectedUser) { setError('Please select a user'); return; }
    setError(null);
    setActiveStep(1);
  };

  const handleBack = () => { setError(null); setActiveStep(0); };

  /* ── Payment actions ── */

  /**
   * Register service for the selected user (COUNTER type) and return registrationId.
   * The API uses the currently-authenticated admin token, but we pass targetUserId
   * via BankPaymentModal so the payment is linked to the correct user.
   *
   * NOTE: registerService() creates the registration under the CURRENT admin session.
   * For cash payment we immediately confirm it; for transfer we pass the registrationId
   * and selectedUser.id (targetUserId) to BankPaymentModal.
   */
  const doRegisterService = async (): Promise<number | null> => {
    if (!selectedService || !selectedUser) return null;
    try {
      setLoading(true);
      setError(null);
      
      // Register service under the selected user's ID, not the current admin
      const res = await registerServiceForUser(selectedUser.id, {
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
    if (!selectedService || isClosing) return;

    // Register first, then confirm counter payment
    const regId = await doRegisterService();
    if (!regId) return;

    try {
      setLoading(true);
      const res = await confirmCounterPayment(regId, selectedService.price);
      if (res.success) {
        setPaymentSuccess(true);
        // Set closing flag and close after 3 seconds
        setTimeout(() => { 
          setIsClosing(true);
          onSuccess(); 
          setTimeout(() => {
            onClose();
          }, 100);
        }, 3000);
      } else {
        setError(res.message || 'Failed to confirm payment');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to confirm payment');
    } finally {
      setLoading(false);
    }
  };

  /* ── Render steps ── */

  const renderStep0 = () => (
    <StepContent>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#374151' }}>
        Search and Select User
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Search for existing users by email or name.
      </Typography>

      <TextField
        fullWidth
        placeholder="Search by email or name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start"><Search color="action" /></InputAdornment>,
          endAdornment: searchLoading && <InputAdornment position="end"><CircularProgress size={20} /></InputAdornment>,
        }}
        sx={{ mb: 3 }}
      />

      {users.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#374151' }}>
            Search Results ({users.length})
          </Typography>
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {users.map((user) => (
              <UserCard
                key={user.id}
                className={selectedUser?.id === user.id ? 'selected' : ''}
                onClick={() => setSelectedUser(user)}
                sx={{ mb: 2 }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.avatar} sx={{ width: 48, height: 48, bgcolor: '#045668' }}>
                      {user.fullName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827' }}>
                        {user.fullName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Email sx={{ fontSize: 14, color: '#6b7280' }} />
                        <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                      </Box>
                      {user.phoneNumber && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Phone sx={{ fontSize: 14, color: '#6b7280' }} />
                          <Typography variant="body2" color="text.secondary">{user.phoneNumber}</Typography>
                        </Box>
                      )}
                    </Box>
                    <Chip
                      label={user.role.name}
                      size="small"
                      sx={{
                        bgcolor: user.role.name === 'USER' ? '#dbeafe' : '#fef3c7',
                        color: user.role.name === 'USER' ? '#1e40af' : '#92400e',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </CardContent>
              </UserCard>
            ))}
          </Box>
        </Box>
      )}

      {searchTerm.length >= 2 && users.length === 0 && !searchLoading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <AccountCircle sx={{ fontSize: 48, color: '#d1d5db', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">No users found matching "{searchTerm}"</Typography>
        </Box>
      )}
    </StepContent>
  );

  const renderStep1 = () => (
    <StepContent>
      {paymentSuccess ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
          <CheckCircle sx={{ fontSize: 100, color: '#10b981', mb: 3 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981', mb: 2 }}>
            Payment Successful!
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#374151', mb: 1 }}>
            Service registered for {selectedUser?.fullName}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            {selectedService?.name} has been successfully registered and activated.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            px: 3, 
            py: 1.5, 
            bgcolor: '#f0fdf4', 
            borderRadius: 2,
            border: '1px solid #bbf7d0'
          }}>
            <MonetizationOn sx={{ color: '#10b981', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: '#065f46', fontWeight: 600 }}>
              Amount: {selectedService?.price.toLocaleString('vi-VN')}đ - Paid in Cash
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 3 }}>
            This window will close automatically in a few seconds...
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setIsClosing(true);
              onSuccess();
              setTimeout(() => onClose(), 100);
            }}
            sx={{ 
              mt: 2,
              borderColor: '#10b981',
              color: '#10b981',
              '&:hover': {
                borderColor: '#059669',
                bgcolor: '#f0fdf4'
              }
            }}
          >
            Close Now
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#374151' }}>
            Select Service
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose a service for <strong>{selectedUser?.fullName}</strong>, then select payment method.
            {loadingRegistrations && (
              <Box component="span" sx={{ display: 'block', mt: 1, fontStyle: 'italic', color: '#6b7280' }}>
                <CircularProgress size={12} sx={{ mr: 1 }} />
                Loading user's registered services...
              </Box>
            )}
            {!loadingRegistrations && userRegistrations.length > 0 && (
              <Box component="span" sx={{ display: 'block', mt: 1, fontStyle: 'italic', color: '#f59e0b' }}>
                Services already registered by this user are disabled.
              </Box>
            )}
          </Typography>

          <Box sx={{ display: 'grid', gap: 2, maxHeight: 320, overflowY: 'auto', mb: 3 }}>
            {services.map((service) => {
              const isRegistered = userRegistrations.includes(service.id);
              return (
                <ServiceCard
                  key={service.id}
                  className={selectedService?.id === service.id ? 'selected' : ''}
                  onClick={() => { 
                    if (!isRegistered) {
                      setSelectedService(service); 
                      setError(null); 
                    }
                  }}
                  sx={{
                    opacity: isRegistered ? 0.5 : 1,
                    cursor: isRegistered ? 'not-allowed' : 'pointer',
                    '&:hover': {
                      borderColor: isRegistered ? '#e5e7eb' : '#045668',
                      boxShadow: isRegistered ? 'none' : '0 4px 12px rgba(4,86,104,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                        <Avatar
                          src={service.images?.[0]}
                          variant="rounded"
                          sx={{ 
                            width: 56, 
                            height: 56, 
                            bgcolor: isRegistered ? '#f5f5f5' : '#e0f2fe',
                            opacity: isRegistered ? 0.6 : 1,
                          }}
                        >
                          <Build sx={{ color: isRegistered ? '#9ca3af' : '#045668' }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 700, 
                                color: isRegistered ? '#9ca3af' : '#111827',
                              }}
                            >
                              {service.name}
                            </Typography>
                            {isRegistered && (
                              <Chip
                                label="Already Registered"
                                size="small"
                                sx={{ 
                                  bgcolor: '#fef2f2', 
                                  color: '#dc2626',
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </Box>
                          <Chip
                            label={service.category?.displayName || service.category?.name}
                            size="small"
                            sx={{ 
                              mt: 0.5, 
                              bgcolor: isRegistered ? '#f9fafb' : '#f3f4f6', 
                              color: isRegistered ? '#9ca3af' : '#374151',
                            }}
                          />
                          {service.duration && (
                            <Typography 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ 
                                display: 'block', 
                                mt: 0.5,
                                opacity: isRegistered ? 0.6 : 1,
                              }}
                            >
                              {service.duration} days
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: isRegistered ? '#9ca3af' : '#045668', 
                          fontWeight: 800, 
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {service.price.toLocaleString('vi-VN')}đ
                      </Typography>
                    </Box>
                  </CardContent>
                </ServiceCard>
              );
            })}
          </Box>

          {/* Payment method buttons shown only when a service is selected */}
          {selectedService && (
            <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, p: 3, bgcolor: '#f8faff' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151', mb: 2 }}>
                Confirm Payment for <strong>{selectedService.name}</strong> — {selectedService.price.toLocaleString('vi-VN')}đ
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCashPayment}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <MonetizationOn />}
                sx={{
                  background: 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #034557 0%, #0099dd 40%, #0f5299 100%)' },
                  borderRadius: 2,
                  py: 1.5,
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

  // Don't render if closing to prevent re-opening
  if (isClosing) {
    return null;
  }

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md">
      <StyledDialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Register Service for Existing User</Typography>
        <Button onClick={onClose} sx={{ color: 'white', minWidth: 'auto', p: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
          <Close />
        </Button>
      </StyledDialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {activeStep === 0 ? renderStep0() : renderStep1()}
        </Box>
      </DialogContent>

      {!paymentSuccess && (
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb', gap: 1 }}>
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{ color: '#6b7280', '&:hover': { bgcolor: '#f9fafb' } }}
          >
            Cancel
          </Button>

          {activeStep === 1 && (
            <Button
              onClick={handleBack}
              disabled={loading}
              sx={{ color: '#374151', '&:hover': { bgcolor: '#f9fafb' } }}
            >
              Back
            </Button>
          )}

          <Box sx={{ flex: 1 }} />

          {activeStep === 0 && (
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={!selectedUser}
              sx={{
                background: 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #034557 0%, #0099dd 40%, #0f5299 100%)' },
              }}
            >
              Next
            </Button>
          )}
        </DialogActions>
      )}
    </StyledDialog>
  );
};

export default RegisterServiceForExistingUserModal;
