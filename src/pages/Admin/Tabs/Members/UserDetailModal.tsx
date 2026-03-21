import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  Card,
  CardContent,
  Divider,
  Stack,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import {
  Close,
  Person,
  Email,
  Phone,
  CalendarToday,
  Badge,
  FitnessCenter,
  Schedule,
  Assignment,
  School,
  ContactEmergency
} from '@mui/icons-material';

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
import { styled } from '@mui/material/styles';
import { 
  getUserDetail, 
  getUserMemberships, 
  getUserServiceRegistrations, 
  getTrainerSpecialties,
  type UserDetailResponse,
  type UserMembership,
  type UserServiceRegistration,
  type TrainerSpecialty
} from '../../../../services/adminService';

/* ─── Styled Components ─────────────────────────────────── */

const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    maxWidth: 900,
    width: '90%',
    maxHeight: '90vh',
  },
}));

const HeaderSection = styled(Box)({
  background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
  color: 'white',
  padding: '24px',
  position: 'relative',
  borderRadius: '20px 20px 0 0',
});

const UserAvatar = styled(Avatar)({
  width: 80,
  height: 80,
  border: '4px solid rgba(255,255,255,0.2)',
  fontSize: '2rem',
});

const InfoCard = styled(Card)({
  borderRadius: 16,
  border: '1px solid #eaeef8',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  height: '100%',
});

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ open, onClose, userId }) => {
  const [user, setUser] = useState<UserDetailResponse | null>(null);
  const [memberships, setMemberships] = useState<UserMembership[]>([]);
  const [serviceRegistrations, setServiceRegistrations] = useState<UserServiceRegistration[]>([]);
  const [trainerSpecialties, setTrainerSpecialties] = useState<TrainerSpecialty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (open && userId) {
      loadUserDetail();
    }
  }, [open, userId]);

  const loadUserDetail = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Load user basic info first
      const userResponse = await getUserDetail(userId);
      if (userResponse.success) {
        setUser(userResponse.data);
      } else {
        throw new Error(userResponse.message || 'Failed to load user details');
      }

      // Load related data in parallel
      const promises: Promise<any>[] = [
        getUserMemberships(userId).catch(err => ({ success: false, data: [], message: err.message })),
        getUserServiceRegistrations(userId).catch(err => ({ success: false, data: [], message: err.message }))
      ];

      // Add trainer specialties if user is a trainer
      if (userResponse.data.role?.name === 'TRAINER') {
        promises.push(
          getTrainerSpecialties(userId).catch(err => ({ success: false, data: [], message: err.message }))
        );
      }

      const results = await Promise.all(promises);
      const [membershipsRes, serviceRegsRes, trainerSpecRes] = results;

      if (membershipsRes.success) {
        setMemberships(membershipsRes.data);
      }

      if (serviceRegsRes.success) {
        setServiceRegistrations(serviceRegsRes.data);
      }

      if (trainerSpecRes && trainerSpecRes.success) {
        setTrainerSpecialties(trainerSpecRes.data);
      }

    } catch (err: any) {
      console.error('Error loading user details:', err);
      setError(err.message || 'Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'Not provided';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getRemainingDays = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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

  const getCategoryLabel = (category: any) => {
    if (typeof category === 'string') {
      const labels: Record<string, string> = {
        PERSONAL_TRAINER: 'Personal Trainer',
        BOXING: 'Boxing',
        YOGA: 'Yoga',
        CARDIO: 'Cardio',
        OTHER: 'Other'
      };
      return labels[category] || category;
    } else if (category && typeof category === 'object') {
      return category.displayName || category.name;
    }
    return 'Unknown';
  };

  const getServiceStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ACTIVE: 'Đang hoạt động',
      CANCELLED: 'Đã hủy',
      COMPLETED: 'Hoàn thành',
      EXPIRED: 'Đã hết hạn'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <StyledDialog open={open} onClose={onClose}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={40} thickness={3} sx={{ color: '#667eea' }} />
            <Typography color="text.secondary">Loading user details...</Typography>
          </Stack>
        </Box>
      </StyledDialog>
    );
  }

  if (error) {
    return (
      <StyledDialog open={open} onClose={onClose}>
        <DialogContent>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </StyledDialog>
    );
  }

  if (!user) return null;

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Header */}
      <HeaderSection>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <Close />
        </IconButton>
        
        <Stack direction="row" spacing={3} alignItems="center">
          <UserAvatar src={user.avatar} alt={user.fullName}>
            {user.fullName?.charAt(0)}
          </UserAvatar>
          
          <Box flex={1}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {user.fullName}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }} gutterBottom>
              @{user.username}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={user.role?.name || 'USER'}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
              <Chip
                label={user.isActive !== false ? 'Active' : 'Inactive'}
                size="small"
                sx={{
                  backgroundColor: user.isActive !== false ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </HeaderSection>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Personal Info" icon={<Person />} iconPosition="start" />
          <Tab label="Memberships" icon={<FitnessCenter />} iconPosition="start" />
          <Tab label="Services" icon={<Assignment />} iconPosition="start" />
          {user.role?.name === 'TRAINER' && (
            <Tab label="Trainer Info" icon={<School />} iconPosition="start" />
          )}
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {/* Personal Info Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box p={3}>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
              {/* Basic Information */}
              <InfoCard>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon><Email color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="Email" 
                        secondary={user.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Phone color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="Phone" 
                        secondary={user.phoneNumber || 'Not provided'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><DateOfBirthIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Date of Birth" 
                        secondary={
                          user.dateOfBirth 
                            ? `${user.dateOfBirth} (${calculateAge(user.dateOfBirth)} years old)`
                            : 'Not provided'
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CalendarToday color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="Join Date" 
                        secondary={formatDate(user.createDate)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Badge color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="Role" 
                        secondary={user.role?.description || user.role?.name}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </InfoCard>

              {/* Emergency Contact */}
              <InfoCard>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                    Emergency Contact
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <List dense>
                    <ListItem>
                      <ListItemIcon><ContactEmergency color="primary" /></ListItemIcon>
                      <ListItemText
                        primary="Contact Name"
                        secondary={user.emergencyContact || 'Not provided'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Phone color="primary" /></ListItemIcon>
                      <ListItemText
                        primary="Contact Phone"
                        secondary={user.emergencyPhone || 'Not provided'}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </InfoCard>

              {/* Bio */}
              {user.bio && (
                <Box gridColumn={{ xs: '1', md: '1 / -1' }}>
                  <InfoCard>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                        Bio
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        {user.bio}
                      </Typography>
                    </CardContent>
                  </InfoCard>
                </Box>
              )}
            </Box>
          </Box>
        </TabPanel>

        {/* Memberships Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box p={3}>
            {memberships && memberships.length > 0 ? (
              <Stack spacing={3}>
                {memberships.map((membership) => {
                  const remainingDays = getRemainingDays(membership.endDate);
                  return (
                    <InfoCard key={membership.id}>
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="start" mb={2}>
                          <Box>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              {membership.membershipPackage.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Duration: {membership.membershipPackage.duration} days
                            </Typography>
                          </Box>
                          <Chip
                            label={membership.isActive ? 'Active' : 'Expired'}
                            color={membership.isActive ? 'success' : 'error'}
                            size="small"
                          />
                        </Stack>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }} gap={2}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">Start Date</Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {formatDate(membership.startDate)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">End Date</Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {formatDate(membership.endDate)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">Price</Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {formatPrice(membership.membershipPackage.price)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">Days Remaining</Typography>
                            <Typography 
                              variant="body1" 
                              fontWeight={500}
                              color={remainingDays > 30 ? 'success.main' : remainingDays > 0 ? 'warning.main' : 'error.main'}
                            >
                              {remainingDays > 0 ? `${remainingDays} days` : 'Expired'}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </InfoCard>
                  );
                })}
              </Stack>
            ) : (
              <Box textAlign="center" py={8}>
                <FitnessCenter sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Memberships
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This user hasn't registered for any membership packages yet.
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Services Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box p={3}>
            {serviceRegistrations && serviceRegistrations.length > 0 ? (
              <Stack spacing={3}>
                {serviceRegistrations.map((registration) => (
                  <InfoCard key={registration.id}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="start" mb={2}>
                        <Box>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {registration.service.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Category: {getCategoryLabel(registration.service.category)}
                          </Typography>
                        </Box>
                        <Chip
                          label={getServiceStatusLabel(registration.status)}
                          color={
                            registration.status === 'ACTIVE' ? 'success' : 
                            registration.status === 'EXPIRED' ? 'warning' :
                            registration.status === 'CANCELLED' ? 'error' :
                            'default'
                          }
                          size="small"
                        />
                      </Stack>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }} gap={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Registration Date</Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {formatDate(registration.registrationDate)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Expiration Date</Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {registration.expirationDate ? formatDate(registration.expirationDate) : 'N/A'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Price</Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {formatPrice(registration.service.price)}
                          </Typography>
                        </Box>
                        {registration.trainer && (
                          <Box>
                            <Typography variant="body2" color="text.secondary">Trainer</Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Avatar src={registration.trainer.avatar} sx={{ width: 24, height: 24 }}>
                                {registration.trainer.fullName.charAt(0)}
                              </Avatar>
                              <Typography variant="body1" fontWeight={500}>
                                {registration.trainer.fullName}
                              </Typography>
                            </Stack>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </InfoCard>
                ))}
              </Stack>
            ) : (
              <Box textAlign="center" py={8}>
                <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Service Registrations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This user hasn't registered for any services yet.
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Trainer Info Tab */}
        {user.role?.name === 'TRAINER' && (
          <TabPanel value={tabValue} index={3}>
            <Box p={3}>
              <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
                {/* Experience & Education */}
                <InfoCard>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                      Professional Info
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon><Schedule color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary="Total Experience" 
                          secondary={`${user.totalExperienceYears || 0} years`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><School color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary="Education" 
                          secondary={user.education || 'Not provided'}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </InfoCard>

                {/* Specialties */}
                <InfoCard>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                      Specialties
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {trainerSpecialties && trainerSpecialties.length > 0 ? (
                      <Stack spacing={1}>
                        {trainerSpecialties.map((specialty, index) => (
                          <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body1">
                              {specialty.specialty.displayName || specialty.specialty.name}
                            </Typography>
                            <Chip
                              label={`${specialty.experienceYears} years`}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No specialties listed
                      </Typography>
                    )}
                  </CardContent>
                </InfoCard>
              </Box>
            </Box>
          </TabPanel>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" size="large">
          Close
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default UserDetailModal;