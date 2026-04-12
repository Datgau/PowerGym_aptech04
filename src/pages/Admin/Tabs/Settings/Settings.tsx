import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Divider,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Person,
  Lock,
  Email,
  Phone,
  PhotoCamera,
  Save,
  Cancel,
  Settings as SettingsIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getCurrentProfile, updateProfile, changePassword } from '../../../../services/userService';
import type { UserResponse } from '../../../../types/user';
import {
  PageWrapper,
  HeaderSection,
  HeaderLeft,
  HeaderIconBox,
  ContentSection,
} from '../shared/StyledComponents';
import ChangeEmailModal from '../../../../components/Common/ChangeEmailModal';

interface ProfileFormData {
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  bio: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  
  // Profile form
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    bio: '',
  });
  const [profileEditing, setProfileEditing] = useState(false);
  
  // Password form
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordEditing, setPasswordEditing] = useState(false);
  
  // Avatar upload
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Email change modal
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getCurrentProfile();
      setUser(data);
      setProfileForm({
        fullName: data.fullName || '',
        phoneNumber: data.phoneNumber || '',
        dateOfBirth: data.dateOfBirth || '',
        bio: data.bio || '',
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must not exceed 5MB');
        return;
      }
      
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const validateAge = (dateOfBirth: string): boolean => {
    if (!dateOfBirth) return true; // Optional field
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  };

  const handleSaveProfile = async () => {
    if (!profileForm.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (profileForm.dateOfBirth && !validateAge(profileForm.dateOfBirth)) {
      toast.error('You must be at least 18 years old');
      return;
    }

    try {
      setSaving(true);
      let updated: UserResponse;
      
      if (avatarFile) {
        // Upload with avatar
        const { updateProfileWithAvatar } = await import('../../../../services/userService');
        updated = await updateProfileWithAvatar(profileForm, avatarFile);
        setAvatarFile(null);
        setAvatarPreview(null);
      } else {
        // Update without avatar
        updated = await updateProfile(profileForm);
      }
      
      setUser(updated);
      setProfileEditing(false);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelProfile = () => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth || '',
        bio: user.bio || '',
      });
    }
    setAvatarFile(null);
    setAvatarPreview(null);
    setProfileEditing(false);
  };

  const handleEmailChangeSuccess = (newEmail: string) => {
    if (user) {
      setUser({ ...user, email: newEmail });
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (!passwordForm.newPassword) {
      toast.error('New password is required');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setSaving(true);
      await changePassword(passwordForm);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordEditing(false);
      toast.success('Password changed successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelPassword = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordEditing(false);
  };

  if (loading) {
    return (
      <PageWrapper display="flex" justifyContent="center" alignItems="center" minHeight={360}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={40} thickness={3} sx={{ color: '#0066ff' }} />
          <Typography color="text.secondary" fontSize={14}>Loading settings...</Typography>
        </Stack>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper sx={{ padding: { xs: '16px', sm: '24px', md: '32px' } }}>
      {/* Header */}
      <HeaderSection sx={{ 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
        padding: { xs: '20px', sm: '24px', md: '28px 32px' },
      }}>
        <HeaderLeft sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <HeaderIconBox>
            <SettingsIcon sx={{ fontSize: 22 }} />
          </HeaderIconBox>
          <Box>
            <Typography 
              fontWeight={700} 
              fontSize={{ xs: 18, sm: 20 }} 
              color="#0f172a" 
              lineHeight={1.3}
            >
              Account Settings
            </Typography>
            <Typography 
              fontSize={{ xs: 12.5, sm: 13.5 }} 
              color="#64748b" 
              mt={0.3}
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Manage your account information and security settings
            </Typography>
          </Box>
        </HeaderLeft>
      </HeaderSection>

      {/* Tabs Navigation */}
      <Box
        sx={{
          background: '#ffffff',
          borderRadius: '20px 20px 0 0',
          border: '1px solid #eaeef8',
          borderBottom: 'none',
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: 13, sm: 14 },
              color: '#64748b',
              minHeight: { xs: 48, sm: 56 },
              '&.Mui-selected': {
                color: '#0066ff',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#0066ff',
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <Tab 
            icon={<Person sx={{ fontSize: { xs: 18, sm: 20 } }} />} 
            iconPosition="start" 
            label="Profile"
            sx={{
              '& .MuiTab-iconWrapper': {
                marginRight: { xs: 0.5, sm: 1 },
              }
            }}
          />
          <Tab 
            icon={<Lock sx={{ fontSize: { xs: 18, sm: 20 } }} />} 
            iconPosition="start" 
            label="Security"
            sx={{
              '& .MuiTab-iconWrapper': {
                marginRight: { xs: 0.5, sm: 1 },
              }
            }}
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <ContentSection sx={{ 
        borderRadius: '0 0 20px 20px', 
        pt: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 3, md: 4 },
      }}>
        {/* Profile Tab */}
        {activeTab === 0 && (
          <Box>
            {/* Avatar Section - Top on all screens */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)',
                borderRadius: 3,
                border: '1px solid #e0e7ff',
                p: { xs: 3, sm: 4 },
                textAlign: 'center',
                mb: { xs: 3, sm: 4 },
              }}
            >
              <Box 
                display="flex" 
                flexDirection={{ xs: 'column', sm: 'row' }}
                alignItems="center"
                gap={{ xs: 2, sm: 4 }}
              >
                <Box position="relative" display="inline-block">
                  <Avatar
                    src={avatarPreview || user?.avatar}
                    sx={{
                      width: { xs: 100, sm: 120 },
                      height: { xs: 100, sm: 120 },
                      border: '4px solid #fff',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    }}
                  >
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </Avatar>
                  <IconButton
                    component="label"
                    disabled={!profileEditing || saving}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: '#0066ff',
                      color: 'white',
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      '&:hover': {
                        backgroundColor: '#0052cc',
                      },
                      '&:disabled': {
                        backgroundColor: '#94a3b8',
                        color: '#e2e8f0',
                      },
                      boxShadow: '0 4px 12px rgba(0,102,255,0.3)',
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: { xs: 18, sm: 20 } }} />
                    <input 
                      type="file" 
                      hidden 
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={!profileEditing || saving}
                    />
                  </IconButton>
                </Box>

                <Box flex={1} textAlign={{ xs: 'center', sm: 'left' }}>
                  <Typography 
                    variant="h6" 
                    fontWeight={700} 
                    color="#0f172a" 
                    mb={0.5}
                    fontSize={{ xs: 16, sm: 18 }}
                  >
                    {user?.fullName}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    mb={2}
                    fontSize={{ xs: 12, sm: 13 }}
                    sx={{ wordBreak: 'break-word' }}
                  >
                    {user?.email}
                  </Typography>
                  <Alert 
                    severity="info" 
                    sx={{ 
                      textAlign: 'left', 
                      fontSize: { xs: 11, sm: 12 },
                      py: 0.5,
                    }}
                  >
                    {avatarFile 
                      ? `Selected: ${avatarFile.name}` 
                      : 'Recommended: Square image, at least 400x400px (Max 5MB)'}
                  </Alert>
                </Box>
              </Box>
            </Box>

            {/* Profile Form */}
            <Box>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                color="#0f172a" 
                mb={3}
                fontSize={{ xs: 16, sm: 18 }}
              >
                Personal Information
              </Typography>
              <Stack spacing={{ xs: 2.5, sm: 3 }}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    value={profileForm.fullName}
                    onChange={handleProfileChange}
                    fullWidth
                    required
                    disabled={!profileEditing || saving}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: <Person sx={{ mr: 1, color: '#64748b', fontSize: { xs: 18, sm: 20 } }} />,
                      },
                      inputLabel: {
                        sx: { fontSize: { xs: 13, sm: 14 } }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: !profileEditing ? '#f8fafc' : '#fff',
                        fontSize: { xs: 13, sm: 14 },
                      }
                    }}
                  />

                  {/* Email Display with Change Button */}
                  <Box
                    sx={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 2,
                      p: 2,
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box display="flex" alignItems="center" flex={1}>
                      <Email sx={{ mr: 1, color: '#64748b', fontSize: { xs: 18, sm: 20 } }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontSize={{ xs: 11, sm: 12 }}>
                          Email Address
                        </Typography>
                        <Typography variant="body2" fontWeight={600} fontSize={{ xs: 13, sm: 14 }}>
                          {user?.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                      onClick={() => setEmailModalOpen(true)}
                      sx={{
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: { xs: 12, sm: 13 },
                        px: { xs: 1.5, sm: 2 },
                      }}
                    >
                      Change
                    </Button>
                  </Box>

                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={profileForm.phoneNumber}
                    onChange={handleProfileChange}
                    fullWidth
                    disabled={!profileEditing || saving}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: <Phone sx={{ mr: 1, color: '#64748b', fontSize: { xs: 18, sm: 20 } }} />,
                      },
                      inputLabel: {
                        sx: { fontSize: { xs: 13, sm: 14 } }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: !profileEditing ? '#f8fafc' : '#fff',
                        fontSize: { xs: 13, sm: 14 },
                      }
                    }}
                  />

                  <TextField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={profileForm.dateOfBirth}
                    onChange={handleProfileChange}
                    fullWidth
                    disabled={!profileEditing || saving}
                    size="small"
                    helperText="You must be at least 18 years old"
                    slotProps={{
                      inputLabel: { 
                        shrink: true,
                        sx: { fontSize: { xs: 13, sm: 14 } }
                      },
                      formHelperText: {
                        sx: { fontSize: { xs: 11, sm: 12 } }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: !profileEditing ? '#f8fafc' : '#fff',
                        fontSize: { xs: 13, sm: 14 },
                      }
                    }}
                  />

                  <TextField
                    label="Bio"
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    fullWidth
                    multiline
                    rows={3}
                    disabled={!profileEditing || saving}
                    placeholder="Tell us about yourself..."
                    size="small"
                    slotProps={{
                      inputLabel: {
                        sx: { fontSize: { xs: 13, sm: 14 } }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: !profileEditing ? '#f8fafc' : '#fff',
                        fontSize: { xs: 13, sm: 14 },
                      }
                    }}
                  />
              </Stack>

              <Divider sx={{ my: { xs: 3, sm: 4 } }} />

              {/* Action Buttons */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent="flex-end"
              >
                {!profileEditing ? (
                  <Button
                    variant="contained"
                    onClick={() => setProfileEditing(true)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: { xs: 3, sm: 4 },
                      fontSize: { xs: 13, sm: 14 },
                      width: { xs: '100%', sm: 'auto' },
                      background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                      boxShadow: '0 4px 16px rgba(0,102,255,0.28)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #00c6ff, #0077ff)',
                        boxShadow: '0 6px 24px rgba(0,102,255,0.38)',
                      }
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      onClick={handleCancelProfile}
                      disabled={saving}
                      startIcon={<Cancel sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: { xs: 2, sm: 3 },
                        fontSize: { xs: 13, sm: 14 },
                        width: { xs: '100%', sm: 'auto' },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSaveProfile}
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={18} /> : <Save sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: { xs: 3, sm: 4 },
                        fontSize: { xs: 13, sm: 14 },
                        width: { xs: '100%', sm: 'auto' },
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #059669, #047857)',
                        }
                      }}
                    >
                      Save Changes
                    </Button>
                  </>
                )}
              </Stack>
            </Box>
          </Box>
        )}

        {/* Security Tab */}
        {activeTab === 1 && (
          <Box maxWidth={700} mx="auto">
            <Typography 
              variant="h6" 
              fontWeight={700} 
              color="#0f172a" 
              mb={3}
              fontSize={{ xs: 16, sm: 18 }}
            >
              Change Password
            </Typography>
            <Stack spacing={{ xs: 2.5, sm: 3 }}>
              <TextField
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                fullWidth
                required
                disabled={!passwordEditing || saving}
                size="small"
                slotProps={{
                  input: {
                    startAdornment: <Lock sx={{ mr: 1, color: '#64748b', fontSize: { xs: 18, sm: 20 } }} />,
                  },
                  inputLabel: {
                    sx: { fontSize: { xs: 13, sm: 14 } }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: !passwordEditing ? '#f8fafc' : '#fff',
                    fontSize: { xs: 13, sm: 14 },
                  }
                }}
              />

              <TextField
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                fullWidth
                required
                disabled={!passwordEditing || saving}
                helperText="Minimum 6 characters"
                size="small"
                slotProps={{
                  input: {
                    startAdornment: <Lock sx={{ mr: 1, color: '#64748b', fontSize: { xs: 18, sm: 20 } }} />,
                  },
                  inputLabel: {
                    sx: { fontSize: { xs: 13, sm: 14 } }
                  },
                  formHelperText: {
                    sx: { fontSize: { xs: 11, sm: 12 } }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: !passwordEditing ? '#f8fafc' : '#fff',
                    fontSize: { xs: 13, sm: 14 },
                  }
                }}
              />

              <TextField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                fullWidth
                required
                disabled={!passwordEditing || saving}
                size="small"
                slotProps={{
                  input: {
                    startAdornment: <Lock sx={{ mr: 1, color: '#64748b', fontSize: { xs: 18, sm: 20 } }} />,
                  },
                  inputLabel: {
                    sx: { fontSize: { xs: 13, sm: 14 } }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: !passwordEditing ? '#f8fafc' : '#fff',
                    fontSize: { xs: 13, sm: 14 },
                  }
                }}
              />
            </Stack>

            <Divider sx={{ my: { xs: 3, sm: 4 } }} />

            {/* Action Buttons */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="flex-end"
            >
              {!passwordEditing ? (
                <Button
                  variant="contained"
                  onClick={() => setPasswordEditing(true)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: { xs: 3, sm: 4 },
                    fontSize: { xs: 13, sm: 14 },
                    width: { xs: '100%', sm: 'auto' },
                    background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                    boxShadow: '0 4px 16px rgba(0,102,255,0.28)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #00c6ff, #0077ff)',
                      boxShadow: '0 6px 24px rgba(0,102,255,0.38)',
                    }
                  }}
                >
                  Change Password
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleCancelPassword}
                    disabled={saving}
                    startIcon={<Cancel sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: { xs: 2, sm: 3 },
                      fontSize: { xs: 13, sm: 14 },
                      width: { xs: '100%', sm: 'auto' },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleChangePassword}
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={18} /> : <Save sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: { xs: 3, sm: 4 },
                      fontSize: { xs: 13, sm: 14 },
                      width: { xs: '100%', sm: 'auto' },
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669, #047857)',
                      }
                    }}
                  >
                    Update Password
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        )}
      </ContentSection>

      {/* Change Email Modal */}
      <ChangeEmailModal
        open={emailModalOpen}
        currentEmail={user?.email || ''}
        onClose={() => setEmailModalOpen(false)}
        onSuccess={handleEmailChangeSuccess}
      />
    </PageWrapper>
  );
};

export default Settings;
