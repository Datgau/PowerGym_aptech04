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
  Divider,
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
  Star,
  MonetizationOn,
  AccountBalance
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { 
  searchUsers, 
  registerMembershipForUser,
  getUserMemberships,
  type UserResponse 
} from '../../../../services/adminService';
import membershipPackageService from '../../../../services/membershipPackageService';
import type { MembershipPackageResponse } from '../../../../services/membershipPackageService';
import BankPaymentModal from '../../../../components/Payment/BankPaymentModal';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    maxWidth: 700,
    width: '100%',
    margin: 16,
    maxHeight: '90vh',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
  minHeight: 400,
}));

const UserCard = styled(Card)(({ theme }) => ({
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#10b981',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
  },
  '&.selected': {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
  },
}));

const PackageCard = styled(Card)(({ theme }) => ({
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  position: 'relative',
  '&:hover': {
    borderColor: '#10b981',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
  },
  '&.selected': {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
  },
}));

interface RegisterExistingUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const steps = ['Select User', 'Select Package', 'Confirm Payment'];

const RegisterExistingUserModal: React.FC<RegisterExistingUserModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Step 1: User selection
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Step 2: Package selection
  const [packages, setPackages] = useState<MembershipPackageResponse[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<MembershipPackageResponse | null>(null);
  const [userActivePackageIds, setUserActivePackageIds] = useState<number[]>([]);
  
  // Step 3: Payment method
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'TRANSFER'>('CASH');
  const [bankPaymentModalOpen, setBankPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      resetForm();
      loadPackages();
    }
  }, [open]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchUsersDebounced();
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  const resetForm = () => {
    setActiveStep(0);
    setError(null);
    setSearchTerm('');
    setUsers([]);
    setSelectedUser(null);
    setSelectedPackage(null);
    setPaymentMethod('CASH');
    setBankPaymentModalOpen(false);
    setPaymentSuccess(false);
    setUserActivePackageIds([]);
  };

  const loadPackages = async () => {
    try {
      const data = await membershipPackageService.getActivePackages();
      setPackages(data);
    } catch (error: any) {
      console.error('Load packages error:', error);
      setError('Failed to load packages');
    }
  };

  const searchUsersDebounced = async () => {
    try {
      setSearchLoading(true);
      const response = await searchUsers(searchTerm, 'USER', 0, 10);
      if (response.success) {
        setUsers(response.data.content);
      } else {
        setError(response.message || 'Failed to search users');
      }
    } catch (error: any) {
      console.error('Search users error:', error);
      setError('Failed to search users');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedUser) {
      setError('Please select a user');
      return;
    }
    if (activeStep === 1 && !selectedPackage) {
      setError('Please select a package');
      return;
    }
    
    setError(null);
    
    // Load user's active packages when moving to step 2
    if (activeStep === 0 && selectedUser) {
      loadUserActivePackages(selectedUser.id);
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };

  const loadUserActivePackages = async (userId: number) => {
    try {
      const response = await getUserMemberships(userId);
      if (response.success) {
        // Get active package IDs
        const activeIds = response.data
          .filter(m => m.status === 'ACTIVE' && m.isActive)
          .map(m => m.membershipPackage.id);
        setUserActivePackageIds(activeIds);
      }
    } catch (error) {
      console.error('Failed to load user active packages:', error);
    }
  };

  const handleBack = () => {
    setError(null);
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCashPayment = async () => {
    if (!selectedUser || !selectedPackage) {
      setError('Please complete all steps');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await registerMembershipForUser(selectedUser.id, selectedPackage.id);
      
      if (response.success) {
        setPaymentSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(response.message || 'Failed to register membership');
      }
    } catch (error: any) {
      console.error('Register membership error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to register membership');
    } finally {
      setLoading(false);
    }
  };

  const handleBankTransfer = () => {
    if (!selectedUser || !selectedPackage) {
      setError('Please complete all steps');
      return;
    }
    setBankPaymentModalOpen(true);
  };

  const handleBankPaymentSuccess = () => {
    setPaymentSuccess(true);
    setBankPaymentModalOpen(false);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1500);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <StepContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#374151' }}>
              Search and Select User
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Search for existing users by email or name to register a membership package.
            </Typography>

            <TextField
              fullWidth
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchLoading && (
                  <InputAdornment position="end">
                    <CircularProgress size={20} />
                  </InputAdornment>
                ),
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
                          <Avatar
                            src={user.avatar}
                            sx={{ 
                              width: 48, 
                              height: 48,
                              bgcolor: '#10b981'
                            }}
                          >
                            {user.fullName.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827' }}>
                              {user.fullName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Email sx={{ fontSize: 14, color: '#6b7280' }} />
                              <Typography variant="body2" color="text.secondary">
                                {user.email}
                              </Typography>
                            </Box>
                            {user.phoneNumber && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Phone sx={{ fontSize: 14, color: '#6b7280' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {user.phoneNumber}
                                </Typography>
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
                <Typography variant="body1" color="text.secondary">
                  No users found matching "{searchTerm}"
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try searching with a different email or name
                </Typography>
              </Box>
            )}
          </StepContent>
        );

      case 1:
        return (
          <StepContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#374151' }}>
              Select Membership Package
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose a membership package for {selectedUser?.fullName}.
            </Typography>

            <Box sx={{ display: 'grid', gap: 2, maxHeight: 350, overflowY: 'auto' }}>
              {packages.map((pkg) => {
                const isUserOwned = userActivePackageIds.includes(pkg.id);
                return (
                  <PackageCard
                    key={pkg.id}
                    className={selectedPackage?.id === pkg.id ? 'selected' : ''}
                    onClick={() => !isUserOwned && setSelectedPackage(pkg)}
                    sx={{
                      opacity: isUserOwned ? 0.6 : 1,
                      cursor: isUserOwned ? 'not-allowed' : 'pointer',
                      position: 'relative',
                      '&:hover': {
                        borderColor: isUserOwned ? '#e5e7eb' : '#10b981',
                        boxShadow: isUserOwned ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.15)',
                      },
                    }}
                  >
                    {isUserOwned && (
                      <Chip
                        label="OWNED"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -8,
                          left: 16,
                          bgcolor: '#6b7280',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          zIndex: 1,
                        }}
                      />
                    )}
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
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
                      <Box sx={{ textAlign: 'right' }}>
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
                            color: pkg.color || '#10b981',
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
                              bgcolor: pkg.color || '#10b981',
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
                </PackageCard>
              );
              })}
            </Box>
          </StepContent>
        );

      case 2:
        return (
          <StepContent>
            {paymentSuccess ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <CheckCircle sx={{ fontSize: 80, color: '#10b981', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#10b981', mb: 1 }}>
                  Registration Successful!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Membership has been registered successfully for {selectedUser?.fullName}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, pb: 2, borderBottom: '1px solid #f3f4f6' }}>
                      <Avatar
                        src={selectedUser?.avatar}
                        sx={{ width: 48, height: 48, bgcolor: '#10b981' }}
                      >
                        {selectedUser?.fullName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827' }}>
                          {selectedUser?.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedUser?.email}
                        </Typography>
                      </Box>
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
                        <Typography variant="h4" sx={{ color: selectedPackage?.color || '#10b981', fontWeight: 800 }}>
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
    <StyledDialog open={open} onClose={onClose} maxWidth="md">
      <StyledDialogTitle>
        <Typography variant="h6">Register Package for Existing User</Typography>
        <Button
          onClick={onClose}
          sx={{ 
            color: 'white', 
            minWidth: 'auto', 
            p: 1,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <Close />
        </Button>
      </StyledDialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {renderStepContent()}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb', gap: 1 }}>
        {/* Cancel Button - Always visible */}
        <Button
          onClick={onClose}
          disabled={loading || paymentSuccess}
          sx={{ 
            color: '#6b7280',
            '&:hover': { bgcolor: '#f9fafb' }
          }}
        >
          Cancel
        </Button>
        
        {/* Back Button - Show on step 1 and 2 (not on success) */}
        {activeStep > 0 && !paymentSuccess && (
          <Button
            onClick={handleBack}
            disabled={loading}
            sx={{ 
              color: '#374151',
              '&:hover': { bgcolor: '#f9fafb' }
            }}
          >
            Back
          </Button>
        )}
        
        <Box sx={{ flex: 1 }} />
        
        {/* Step-specific action buttons */}
        {activeStep < steps.length - 1 ? (
          // Next button for steps 0 and 1
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669, #047857)',
              },
            }}
          >
            Next
          </Button>
        ) : !paymentSuccess ? (
          // Cash and Transfer buttons for step 2
          <>
            <Button
              onClick={handleCashPayment}
              disabled={loading}
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <MonetizationOn />}
              sx={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669, #047857)',
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
        ) : null}
      </DialogActions>

      {/* Bank Payment Modal */}
      <BankPaymentModal
        open={bankPaymentModalOpen}
        onClose={() => setBankPaymentModalOpen(false)}
        onSuccess={handleBankPaymentSuccess}
        serviceName={selectedPackage?.name}
        serviceId={selectedPackage?.id.toString()}
        itemType="MEMBERSHIP"
        amount={selectedPackage?.price}
        targetUserId={selectedUser?.id}
      />
    </StyledDialog>
  );
};

export default RegisterExistingUserModal;