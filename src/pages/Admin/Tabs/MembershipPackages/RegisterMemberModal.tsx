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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  InputAdornment
} from '@mui/material';
import { Close, Person, CreditCard, CheckCircle, Star, MonetizationOn, AccountBalance } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { createUser, registerMembershipForUser, checkEmailExists } from '../../../../services/adminService';
import membershipPackageService from '../../../../services/membershipPackageService';
import type { MembershipPackageResponse } from '../../../../services/membershipPackageService';
import BankPaymentModal from '../../../../components/Payment/BankPaymentModal';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    maxWidth: 600,
    width: '100%',
    margin: 16,
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)',
  color: 'white',
  padding: '20px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& .MuiTypography-root': {
    fontSize: '1.25rem',
    fontWeight: 600,
  },
}));

const StepContent = styled(Box)(({ theme }) => ({
  padding: '24px 0',
  minHeight: 300,
}));

interface RegisterMemberModalProps {
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

const steps = ['User Information', 'Select Package', 'Confirm Payment'];

const RegisterMemberModal: React.FC<RegisterMemberModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailChecking, setEmailChecking] = useState(false);
  
  // Step 1: User form data
  const [userForm, setUserForm] = useState<UserFormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);
  
  // Step 2: Package selection
  const [packages, setPackages] = useState<MembershipPackageResponse[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<MembershipPackageResponse | null>(null);
  
  // Step 3: Payment method
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'TRANSFER'>('CASH');
  const [bankPaymentModalOpen, setBankPaymentModalOpen] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    if (open && activeStep === 1) {
      loadPackages();
    }
  }, [open, activeStep]);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await membershipPackageService.getAllPackages();
      setPackages(data.filter(pkg => pkg.isActive));
    } catch (error) {
      console.error('Failed to load packages:', error);
      setError('Failed to load membership packages');
    } finally {
      setLoading(false);
    }
  };

  const handleUserFormChange = (field: keyof UserFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUserForm(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    
    // Clear error when user types
    if (error) setError(null);
  };

  // Check email exists when user finishes typing
  const handleEmailBlur = async () => {
    if (!userForm.email.trim()) return;
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setEmailChecking(true);
      setError(null);
      const response = await checkEmailExists(userForm.email);
      
      if (response.success && response.data) {
        setError('This email is already registered in the system');
      }
    } catch (error: any) {
      console.error('Check email error:', error);
    } finally {
      setEmailChecking(false);
    }
  };

  const validateUserForm = (): boolean => {
    if (!userForm.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!userForm.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!userForm.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    return true;
  };

  const handleCreateUser = async () => {
    if (!validateUserForm()) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await createUser({
        fullName: userForm.fullName,
        email: userForm.email,
        phoneNumber: userForm.phoneNumber,
        roleId: 1, // USER role
      });

      if (response.success) {
        setCreatedUser({
          id: response.data.id,
          fullName: response.data.fullName,
          email: response.data.email,
        });
        setActiveStep(1);
      } else {
        setError(response.message || 'Failed to create user');
      }
    } catch (error: any) {
      console.error('Create user error:', error);
      setError(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (pkg: MembershipPackageResponse) => {
    setSelectedPackage(pkg);
    setError(null);
    setActiveStep(2);
  };

  const handleCashPayment = async () => {
    if (!createdUser || !selectedPackage) return;

    try {
      setLoading(true);
      setError(null);

      const response = await registerMembershipForUser(createdUser.id, selectedPackage.id);

      if (response.success) {
        setPaymentConfirmed(true);
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1500);
      } else {
        setError(response.message || 'Failed to register membership');
      }
    } catch (error: any) {
      console.error('Register membership error:', error);
      setError(error.response?.data?.message || 'Failed to register membership');
    } finally {
      setLoading(false);
    }
  };

  const handleBankTransfer = () => {
    if (!createdUser || !selectedPackage) {
      setError('Please complete all steps');
      return;
    }
    setBankPaymentModalOpen(true);
  };

  const handleBankPaymentSuccess = () => {
    setPaymentConfirmed(true);
    setBankPaymentModalOpen(false);
    setTimeout(() => {
      onSuccess();
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setActiveStep(0);
    setUserForm({ fullName: '', email: '', phoneNumber: '' });
    setCreatedUser(null);
    setSelectedPackage(null);
    setPaymentMethod('CASH');
    setBankPaymentModalOpen(false);
    setPaymentConfirmed(false);
    setError(null);
    setEmailChecking(false);
    onClose();
  };

  const handleBack = () => {
    setError(null);
    setActiveStep(prev => prev - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <StepContent>
            <Typography variant="h6" gutterBottom>
              Create New Member Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter the member's information. A password will be sent to their email.
            </Typography>
            
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Full Name"
                value={userForm.fullName}
                onChange={handleUserFormChange('fullName')}
                required
                disabled={loading}
              />
              
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={userForm.email}
                onChange={handleUserFormChange('email')}
                onBlur={handleEmailBlur}
                required
                disabled={loading}
                error={!!error && error.includes('email')}
                helperText={error && error.includes('email') ? error : ''}
                InputProps={{
                  endAdornment: emailChecking && (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label="Phone Number"
                value={userForm.phoneNumber}
                onChange={handleUserFormChange('phoneNumber')}
                required
                disabled={loading}
              />
            </Stack>
          </StepContent>
        );

      case 1:
        return (
          <StepContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#374151' }}>
              Select Membership Package
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose a membership package for {createdUser?.fullName}
            </Typography>
            
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gap: 2, maxHeight: 350, overflowY: 'auto' }}>
                {packages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    sx={{
                      cursor: 'pointer',
                      border: selectedPackage?.id === pkg.id ? '2px solid #045668' : '1px solid #e5e7eb',
                      borderRadius: 3,
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      '&:hover': {
                        borderColor: '#045668',
                        boxShadow: '0 4px 12px rgba(4, 86, 104, 0.15)',
                      },
                      ...(selectedPackage?.id === pkg.id && {
                        backgroundColor: '#f0f9ff',
                        boxShadow: '0 4px 12px rgba(4, 86, 104, 0.15)',
                      }),
                    }}
                    onClick={() => handlePackageSelect(pkg)}
                  >
                    {pkg.isPopular && (
                      <Chip
                        icon={<Star sx={{ fontSize: '14px !important' }} />}
                        label="POPULAR"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: 16,
                          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                          color: '#000',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                        }}
                      />
                    )}
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
                            {pkg.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {pkg.description}
                          </Typography>
                          <Chip
                            label={`${pkg.duration} days`}
                            size="small"
                            sx={{ bgcolor: '#f3f4f6', color: '#374151' }}
                          />
                        </Box>
                        <Box textAlign="right">
                          {pkg.originalPrice && (
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: 'line-through',
                                color: '#9ca3af',
                                fontSize: '0.875rem',
                              }}
                            >
                              {pkg.originalPrice.toLocaleString('vi-VN')}đ
                            </Typography>
                          )}
                          <Typography
                            variant="h5"
                            sx={{
                              color: pkg.color || '#045668',
                              fontWeight: 800,
                              fontSize: '1.5rem',
                            }}
                          >
                            {pkg.price.toLocaleString('vi-VN')}đ
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 1, display: 'block' }}>
                        FEATURES
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {pkg.features.slice(0, 3).map((feature, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 4,
                                height: 4,
                                borderRadius: '50%',
                                bgcolor: pkg.color || '#045668',
                              }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                        {pkg.features.length > 3 && (
                          <Typography variant="caption" color="text.secondary" sx={{ pl: 2, fontStyle: 'italic' }}>
                            +{pkg.features.length - 3} more features
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </StepContent>
        );

      case 2:
        return (
          <StepContent>
            {paymentConfirmed ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <CheckCircle sx={{ fontSize: 80, color: '#045668', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#045668', mb: 1 }}>
                  Registration Successful!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Membership has been registered successfully for {createdUser?.fullName}
                </Typography>
              </Box>
            ) : (
              <>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#374151' }}>
                  Confirm Registration
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Review the details and choose payment method to complete the registration.
                </Typography>

                {/* Registration Summary Card */}
                <Card sx={{ mb: 3, border: '1px solid #e5e7eb' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                      Registration Summary
                    </Typography>
                    
                    {/* User Info */}
                    <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #f3f4f6' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Member Information
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827' }}>
                        {createdUser?.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {createdUser?.email}
                      </Typography>
                    </Box>

                    {/* Package Info */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Package
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                          {selectedPackage?.name}
                        </Typography>
                        <Chip
                          label={`${selectedPackage?.duration} days`}
                          size="small"
                          sx={{ mt: 1, bgcolor: '#f3f4f6', color: '#374151' }}
                        />
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Amount
                        </Typography>
                        <Typography variant="h4" sx={{ color: selectedPackage?.color || '#045668', fontWeight: 800 }}>
                          {selectedPackage?.price.toLocaleString('vi-VN')}đ
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Payment Info */}
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Cash:</strong> Membership will be activated immediately.<br />
                    <strong>Transfer:</strong> QR code will be generated for payment. Membership activates after confirmation.
                  </Typography>
                </Alert>
              </>
            )}
          </StepContent>
        );

      default:
        return null;
    }
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <StyledDialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Person />
          Register Package for Member
        </Box>
        <Button
          onClick={handleClose}
          sx={{ color: 'white', minWidth: 'auto', p: 0.5 }}
        >
          <Close />
        </Button>
      </StyledDialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ px: 3, pt: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {error && (
          <Box sx={{ px: 3, pt: 2 }}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Box>
        )}

        <Box sx={{ px: 3 }}>
          {renderStepContent()}
        </Box>
      </DialogContent>

      {!paymentConfirmed && (
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={activeStep === 0 ? handleClose : handleBack}
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
                '&:hover': {
                  background: 'linear-gradient(135deg, #034557 0%, #0099dd 40%, #0f5299 100%)',
                },
              }}
            >
              Create User & Continue
            </Button>
          )}
          
          {activeStep === 2 && (
            <>
              <Button
                onClick={handleCashPayment}
                disabled={loading}
                variant="contained"
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <MonetizationOn />}
                sx={{
                  background: 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #034557 0%, #0099dd 40%, #0f5299 100%)',
                  },
                  minWidth: 140,
                }}
              >
                {loading ? 'Processing...' : 'Cash'}
              </Button>
              <Button
                onClick={handleBankTransfer}
                disabled={loading}
                variant="contained"
                startIcon={<AccountBalance />}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  },
                  minWidth: 140,
                }}
              >
                Transfer
              </Button>
            </>
          )}
        </DialogActions>
      )}

      {/* Bank Payment Modal */}
      <BankPaymentModal
        open={bankPaymentModalOpen}
        onClose={() => setBankPaymentModalOpen(false)}
        onSuccess={handleBankPaymentSuccess}
        serviceName={selectedPackage?.name}
        serviceId={selectedPackage?.id.toString()}
        itemType="MEMBERSHIP"
        amount={selectedPackage?.price}
        targetUserId={createdUser?.id}
      />
    </StyledDialog>
  );
};

export default RegisterMemberModal;