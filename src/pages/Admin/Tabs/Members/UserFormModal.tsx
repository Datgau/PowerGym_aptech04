import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { Email } from '@mui/icons-material';
import type {Role, UserRequest, UserResponse} from '../../../../services/adminService.ts';
import { checkEmailExists } from '../../../../services/adminService.ts';
import type {ApiResponse} from "../../../../@type/apiResponse.ts";
import { message } from '../../../../utils/message.ts';

// Custom Date of Birth Icon Component
const DateOfBirthIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ color: '#1976d2' }}
  >
    <path 
      d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" 
      fill="currentColor"
    />
  </svg>
);

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserRequest) => Promise<void>;
  user?: UserResponse | null;
  roles?: Role[];
  mode: 'create' | 'edit';
  allowedRoles?: string[];
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  user,
  roles=[],
  mode,
  allowedRoles
}) => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    roleId: '',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        email: user.email || '',
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        roleId: user.role?.id?.toString() || '',
        dateOfBirth: user.dateOfBirth || '',
      });
    } else {
      setFormData({
        email: '',
        fullName: '',
        phoneNumber: '',
        roleId: '',
        dateOfBirth: '',
      });
    }
    setError('');
    setSuccess('');
    setEmailError('');
  }, [user, mode, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Field changed:', e.target.name, '=', e.target.value); // Debug log
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const checkEmail = async () => {
      if (!formData.email || formData.email.length < 3 || mode === 'edit') {
        setEmailError('');
        return;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setEmailError('');
        return;
      }

      setEmailCheckLoading(true);
      setEmailError('');

      try {
        const response = await checkEmailExists(formData.email);
        if (response.success && response.data) {
          setEmailError('This email is already registered');
        } else {
          setEmailError('');
        }
      } catch (err) {
        console.error('Email check error:', err);
        // Don't show error for network issues, just clear the error
        setEmailError('');
      } finally {
        setEmailCheckLoading(false);
      }
    };

    // Debounce email check
    const timeoutId = setTimeout(checkEmail, 800);
    return () => clearTimeout(timeoutId);
  }, [formData.email, mode]);

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (emailError) {
      setError('Please fix the email error before submitting');
      return;
    }
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    if (!formData.roleId) {
      setError('Role is required');
      return;
    }

    // Age validation - must be at least 16 years old
    if (formData.dateOfBirth) {
      const age = calculateAge(formData.dateOfBirth);
      if (age !== null && age < 16) {
        setError('User must be at least 16 years old to register');
        return;
      }
    }

    setLoading(true);

    try {
      const submitData: UserRequest = {
        email: formData.email.trim(),
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        roleId: parseInt(formData.roleId, 10),
        dateOfBirth: formData.dateOfBirth.trim() || undefined,
      };
      
      console.log('Submitting data:', submitData); // Debug log
      
      await onSubmit(submitData);
      
      // Show success message using toast
      if (mode === 'create') {
        message.success(`User created successfully! A password has been sent to ${formData.email}. Please ask the user to check their email inbox and spam folder.`, 3000);
      } else {
        message.success('User updated successfully!', 3000);
      }
      
      // Close modal immediately after success
      onClose();
      
    } catch (err) {
      console.error('Submit error:', err); // Debug log
      const errorMessage = (err as ApiResponse<UserResponse>)?.message || 'Có lỗi xảy ra';
      setError(errorMessage);
      message.error(errorMessage, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Lọc roles theo allowedRoles
  const filteredRoles = allowedRoles 
    ? roles.filter(role => allowedRoles.includes(role.name))
    : roles;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
          {mode === 'create' ? 'Add New User' : 'Edit User'}
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              severity="success" 
              sx={{ mb: 2 }}
              icon={mode === 'create' ? <Email /> : undefined}
            >
              {success}
            </Alert>
          )}

          {mode === 'create' && !success && (
            <Alert severity="info" sx={{ mb: 2 }}>
              The password will be generated automatically and sent via email
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              disabled={mode === 'edit' || !!success}
              error={!!emailError}
              helperText={emailError || (mode === 'create' ? 'This email can be registered.' : '')}
              InputProps={{
                endAdornment: emailCheckLoading ? (
                  <InputAdornment position="end">
                    <CircularProgress size={20} />
                  </InputAdornment>
                ) : null,
              }}
            />

            <TextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              fullWidth
              disabled={!!success}
            />

            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              fullWidth
              disabled={!!success}
            />

            <TextField
              select
              label="Role"
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              required
              fullWidth
              disabled={mode === 'edit' || !!success}
            >
              {filteredRoles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              fullWidth
              disabled={mode === 'edit' || !!success}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateOfBirthIcon />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                max: new Date().toISOString().split('T')[0], // Không cho phép chọn ngày tương lai
                min: "1900-01-01", // Giới hạn năm sinh từ 1900
              }}
              helperText={
                formData.dateOfBirth 
                  ? (() => {
                      const age = calculateAge(formData.dateOfBirth);
                      if (age !== null) {
                        if (age < 16) {
                          return `Age: ${age} years old - Must be at least 16 years old`;
                        }
                        return `Age: ${age} years old`;
                      }
                      return "Select your date of birth";
                    })()
                  : "Select your date of birth (must be at least 16 years old)"
              }
              error={!!(formData.dateOfBirth && calculateAge(formData.dateOfBirth) !== null && calculateAge(formData.dateOfBirth)! < 16)}
              sx={{
                '& .MuiInputBase-input[type="date"]': {
                  '&::-webkit-calendar-picker-indicator': {
                    cursor: 'pointer',
                    filter: 'invert(0.5)',
                    '&:hover': {
                      filter: 'invert(0.3)',
                    }
                  }
                }
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={onClose} disabled={loading}>
            {success ? 'Close' : 'Cancel'}
          </Button>
          {!success && (
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                minWidth: 100
              }}
            >
              {loading ? <CircularProgress size={24} /> : (mode === 'create' ? 'Add' : 'Save')}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserFormModal;