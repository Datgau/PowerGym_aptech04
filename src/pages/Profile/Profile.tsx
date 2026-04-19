import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Stack,
  Button,
  IconButton,
  Tabs,
  Tab,
  Pagination,
} from '@mui/material';
import {
  Email,
  Phone,
  CalendarToday,
  FitnessCenter,
  CardMembership,
  School,
  VerifiedUser,
  Edit,
  Work,
  Info,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../hooks/useAuth';
import { loadAuthSession, persistAuthSession } from '../../services/authStorage';
import { getMyRegistrations } from '../../services/serviceRegistrationService';
import type { ServiceRegistrationResponse, TrainerBooking } from '../../services/serviceRegistrationService';
import { getCurrentTrainerProfile } from '../../services/trainerService';
import type { TrainerResponse } from '../../services/trainerService';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout';
import EditProfileModal from '../../components/Profile/EditProfileModal';
import BookingStatusModal from '../../components/ServiceRegistration/BookingStatusModal';

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const PageWrapper = styled(Box)({
  minHeight: 'calc(100vh - 70px)',
  background: '#f5f7fa',
  paddingBottom: '60px',
});

const CoverImage = styled(Box)(({ theme }) => ({
  background: BRAND_GRADIENT,
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  position: 'relative',
  overflow: 'hidden',
  minHeight: '280px',
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(12),
  },
}));

const ProfileCard = styled(Paper)({
  position: 'relative',
  marginTop: '-120px',
  borderRadius: '24px',
  padding: '32px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  background: 'white',
});

const StatsCard = styled(Card)({
  borderRadius: '20px',
  padding: '24px',
  background: BRAND_GRADIENT,
  color: 'white',
  boxShadow: '0 8px 24px rgba(4,86,104,0.25)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 32px rgba(4,86,104,0.35)',
  },
});

const InfoCard = styled(Card)({
  borderRadius: '20px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  height: '100%',
  transition: 'all 0.3s ease',
  border: '1px solid #f0f0f0',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 28px rgba(0,0,0,0.12)',
    borderColor: '#00b4ff',
  },
});

const ServiceCard = styled(Box)({
  padding: '20px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  border: '2px solid transparent',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#00b4ff',
    transform: 'translateX(8px)',
    boxShadow: '0 8px 24px rgba(0,180,255,0.15)',
  },
});

const InfoItem = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  padding: '16px 0',
  borderBottom: '1px solid #f5f5f5',
  '&:last-child': {
    borderBottom: 'none',
  },
});

const IconBox = styled(Box)({
  width: '48px',
  height: '48px',
  borderRadius: '14px',
  background: 'linear-gradient(135deg, rgba(4,86,104,0.1), rgba(0,180,255,0.1))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#045668',
  flexShrink: 0,
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const Profile: React.FC = () => {
  const { user, checkAuthStatus } = useAuth();
  const [registrations, setRegistrations] = useState<ServiceRegistrationResponse[]>([]);
  const [trainerProfile, setTrainerProfile] = useState<TrainerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<TrainerBooking | null>(null);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<number | null>(null);
  const itemsPerPage = 2; // Hiển thị 2 services mỗi trang

  const isTrainer = user?.role === 'TRAINER';
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin' || user?.role === 'STAFF' || user?.role === 'staff';

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError('');

      if (isTrainer) {
        try {
          const response = await getCurrentTrainerProfile();
          if (response.success) {
            setTrainerProfile(response.data);
          }
        } catch (trainerError: any) {
          console.warn('Error loading trainer profile:', trainerError);
        }
      } else if (!isAdmin) {
        try {
          const response = await getMyRegistrations();
          if (response.success) {
            setRegistrations(response.data);
          }
        } catch (regError: any) {
          console.warn('Error loading registrations:', regError);
        }
      }
    } catch (err: any) {
      console.error('Error loading profile data:', err);
      setError(err.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getActiveRegistrations = () => {
    return registrations.filter(reg => reg.status === 'ACTIVE');
  };

  const getPaginatedRegistrations = () => {
    const activeRegs = getActiveRegistrations();
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return activeRegs.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    const activeRegs = getActiveRegistrations();
    return Math.ceil(activeRegs.length / itemsPerPage);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleEditProfileSuccess = (updatedUser: any) => {
    const session = loadAuthSession();
    if (session && user) {
      const updatedAuthUser = {
        ...user,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        dateOfBirth: updatedUser.dateOfBirth,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
      };
      persistAuthSession(updatedAuthUser, session.remember);
      checkAuthStatus();
    }
    loadUserData();
  };

  const getBookingStatus = (registration: ServiceRegistrationResponse) => {
    if (!registration.upcomingBookings || registration.upcomingBookings.length === 0) {
      return { status: 'NO_BOOKING', label: 'No booking', color: '#9e9e9e' };
    }
    
    const latestBooking = registration.upcomingBookings[0];

    switch (latestBooking.status) {
      case 'PENDING':
        return { status: 'PENDING', label: 'Pending', color: '#ff9800' };
      case 'CONFIRMED':
        return { status: 'CONFIRMED', label: 'Confirmed', color: '#4caf50' };
      case 'REJECTED':
        return { status: 'REJECTED', label: 'Rejected', color: '#f44336' };
      case 'CANCELLED':
        return { status: 'CANCELLED', label: 'Cancelled', color: '#9e9e9e' };
      case 'COMPLETED':
        return { status: 'COMPLETED', label: 'Completed', color: '#2196f3' };
      case 'NO_SHOW':
        return { status: 'NO_SHOW', label: 'No Show', color: '#d32f2f' };
      case 'RESCHEDULED':
        return { status: 'RESCHEDULED', label: 'Rescheduled', color: '#9c27b0' };
      default:
        return { status: latestBooking.status, label: latestBooking.status, color: '#757575' };
    }
  };

  const handleViewBookingStatus = (registration: ServiceRegistrationResponse) => {
    if (registration.upcomingBookings && registration.upcomingBookings.length > 0) {
      setSelectedBooking(registration.upcomingBookings[0]);
      setSelectedRegistrationId(registration.id);
      setBookingModalOpen(true);
    }
  };

  const handleSelectNewTrainer = () => {
    // TODO: Navigate to trainer selection page with registrationId
    console.log('Select new trainer for registration:', selectedRegistrationId);
    // You can implement navigation to trainer selection here
    // For example: navigate(`/services/${registration.service.id}/select-trainer?registrationId=${selectedRegistrationId}`);
  };

  if (loading) {
    return (
      <PowerGymLayout>
        <PageWrapper display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size={56} thickness={4} sx={{ color: '#00b4ff' }} />
        </PageWrapper>
      </PowerGymLayout>
    );
  }

  return (
    <PowerGymLayout>
      <PageWrapper>
        <CoverImage>
          <Box sx={{
            position: 'absolute', top: -80, right: -80, width: 360, height: 360,
            borderRadius: '50%', background: 'rgb(19,102,186)', pointerEvents: 'none',
          }} />
          <Box sx={{
            position: 'absolute', bottom: -60, left: -60, width: 260, height: 260,
            borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
          }} />
          <Box sx={{
            position: 'absolute', top: '30%', left: '25%', width: 180, height: 180,
            borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
          }} />
        </CoverImage>

        <Container maxWidth="lg">
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 3,
                marginTop: '-100px',
                position: 'relative',
                zIndex: 10,
              }}
            >
              {error}
            </Alert>
          )}

          <ProfileCard>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
              {/* Left Section */}
              <Box sx={{ flex: { md: '0 0 33.333%' }, maxWidth: { md: '33.333%' } }}>
                <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                  <Box position="relative" mb={2}>
                    <Avatar
                      src={user?.avatar}
                      sx={{
                        width: 160,
                        height: 160,
                        border: '6px solid white',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                      }}
                    >
                      <Typography variant="h2" fontWeight={700}>
                        {user?.fullName?.charAt(0) || 'U'}
                      </Typography>
                    </Avatar>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        background: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        '&:hover': {
                          background: '#667eea',
                          color: 'white',
                        },
                      }}
                    >

                      <Edit fontSize="small" />
                    </IconButton>

                  </Box>

                  <Typography variant="h4" fontWeight={700} mb={1}>
                    {user?.fullName || 'User'}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={3}
                    sx={{ fontStyle: user?.email ? 'normal' : 'italic', px: 2 }}
                  >
                    {user?.email || 'No bio available'}
                  </Typography>
                  <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" justifyContent="center">
                    <Chip
                      label={isTrainer ? 'Trainer' : isAdmin ? 'Administrator' : 'Member'}
                      sx={{
                        background: BRAND_GRADIENT,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                      }}
                    />
                  </Stack>

                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    fullWidth
                    onClick={() => setEditModalOpen(true)}
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      background: BRAND_GRADIENT,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      boxShadow: '0 4px 16px rgba(4,86,104,0.3)',
                      '&:hover': {
                        background: BRAND_GRADIENT,
                        boxShadow: '0 6px 20px rgba(4,86,104,0.4)',
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                </Box>

                {!isTrainer && !isAdmin && (
                  <Box mt={4}>
                    <StatsCard>
                      <Box textAlign="center">
                        <FitnessCenter sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                        <Typography variant="h3" fontWeight={700} mb={0.5}>
                          {getActiveRegistrations().length}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Active Services
                        </Typography>
                      </Box>
                    </StatsCard>
                  </Box>
                )}
              </Box>

              {/* Right Section */}
              <Box sx={{ flex: { md: '0 0 66.667%' }, maxWidth: { md: '66.667%' } }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                  <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem',
                        minHeight: '56px',
                      },
                      '& .Mui-selected': {
                        color: '#00b4ff !important',
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#00b4ff',
                        height: 3,
                        borderRadius: '3px 3px 0 0',
                      },
                    }}
                  >
                    <Tab label="Personal Info" />
                    {isTrainer && <Tab label="Professional" />}
                    {!isTrainer && !isAdmin && <Tab label="My Services" />}
                  </Tabs>
                </Box>

                {/* Tab 0: Personal Information */}
                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ p: { xs: 2, md: 3 } }}>
                    <InfoCard>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} mb={3} color="#045668">
                        Contact Information
                      </Typography>

                      <InfoItem>
                        <IconBox>
                          <Email />
                        </IconBox>
                        <Box flex={1}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Email Address
                          </Typography>
                          <Typography variant="body1" fontWeight={600} color="text.primary">
                            {user?.email || 'N/A'}
                          </Typography>
                        </Box>
                      </InfoItem>

                      <InfoItem>
                        <IconBox>
                          <Phone />
                        </IconBox>
                        <Box flex={1}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Phone Number
                          </Typography>
                          <Typography variant="body1" fontWeight={600} color="text.primary">
                            {user?.phoneNumber || 'N/A'}
                          </Typography>
                        </Box>
                      </InfoItem>

                      <InfoItem>
                        <IconBox>
                          <CalendarToday />
                        </IconBox>
                        <Box flex={1}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Date of Birth
                          </Typography>
                          <Typography variant="body1" fontWeight={600} color="text.primary">
                            {user?.dateOfBirth || 'N/A'}
                          </Typography>
                        </Box>
                      </InfoItem>
                    </CardContent>
                  </InfoCard>
                  </Box>
                </TabPanel>

                {/* Tab 1: Professional Info (Trainer only) */}
                {isTrainer && (
                  <TabPanel value={tabValue} index={1}>
                    <Box sx={{ p: { xs: 2, md: 3 } }}>
                      <InfoCard>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={700} mb={3} color="#045668">
                          Professional Credentials
                        </Typography>

                        <InfoItem>
                          <IconBox>
                            <School />
                          </IconBox>
                          <Box flex={1}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              Education
                            </Typography>
                            <Typography variant="body1" fontWeight={600} color="text.primary">
                              {trainerProfile?.education || 'Not provided'}
                            </Typography>
                          </Box>
                        </InfoItem>

                        <InfoItem>
                          <IconBox>
                            <Work />
                          </IconBox>
                          <Box flex={1}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              Total Experience
                            </Typography>
                            <Typography variant="body1" fontWeight={600} color="text.primary">
                              {trainerProfile?.totalExperienceYears ? `${trainerProfile.totalExperienceYears} years` : 'Not provided'}
                            </Typography>
                          </Box>
                        </InfoItem>

                        <InfoItem>
                          <IconBox>
                            <FitnessCenter />
                          </IconBox>
                          <Box flex={1}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              Specialties & Experience
                            </Typography>
                            {trainerProfile?.specialties && trainerProfile.specialties.length > 0 ? (
                              <Box mt={1}>
                                {trainerProfile.specialties.map((specialty) => (
                                  <Box key={specialty.id} mb={1.5}>
                                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                      <Chip
                                        label={specialty.specialty.displayName}
                                        size="small"
                                        sx={{
                                          background: specialty.specialty.color || BRAND_GRADIENT,
                                          color: 'white',
                                          fontWeight: 600,
                                        }}
                                      />
                                      {specialty.level && (
                                        <Chip
                                          label={specialty.level}
                                          size="small"
                                          variant="outlined"
                                          sx={{
                                            borderColor: specialty.specialty.color || '#00b4ff',
                                            color: specialty.specialty.color || '#00b4ff',
                                            fontWeight: 600,
                                          }}
                                        />
                                      )}
                                    </Box>
                                    <Typography variant="body2" color="text.primary" fontWeight={600}>
                                      {specialty.experienceYears ? `${specialty.experienceYears} years experience` : 'Experience not specified'}
                                    </Typography>
                                    {specialty.certifications && (
                                      <Typography variant="caption" color="text.secondary">
                                        Certifications: {specialty.certifications}
                                      </Typography>
                                    )}
                                    {specialty.description && (
                                      <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                                        {specialty.description}
                                      </Typography>
                                    )}
                                  </Box>
                                ))}
                              </Box>
                            ) : (
                              <Typography variant="body1" fontWeight={600} color="text.primary">
                                No specialties added
                              </Typography>
                            )}
                          </Box>
                        </InfoItem>

                        <InfoItem>
                          <IconBox>
                            <VerifiedUser />
                          </IconBox>
                          <Box flex={1}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              Certifications & Documents
                            </Typography>
                            {trainerProfile?.documents && trainerProfile.documents.length > 0 ? (
                              <Box mt={1}>
                                {trainerProfile.documents.map((doc) => (
                                  <Box key={doc.id} mb={1}>
                                    <Typography variant="body2" fontWeight={600} color="text.primary">
                                      {doc.documentType.replace(/_/g, ' ')}
                                      {doc.isVerified && (
                                        <Chip
                                          label="Verified"
                                          size="small"
                                          sx={{
                                            ml: 1,
                                            background: 'linear-gradient(135deg, #11998e, #38ef7d)',
                                            color: 'white',
                                            height: '20px',
                                            fontSize: '0.7rem',
                                          }}
                                        />
                                      )}
                                    </Typography>
                                    {doc.description && (
                                      <Typography variant="caption" color="text.secondary">
                                        {doc.description}
                                      </Typography>
                                    )}
                                  </Box>
                                ))}
                              </Box>
                            ) : (
                              <Typography variant="body1" fontWeight={600} color="text.primary">
                                No documents uploaded
                              </Typography>
                            )}
                          </Box>
                        </InfoItem>
                      </CardContent>
                    </InfoCard>
                    </Box>
                  </TabPanel>
                )}

                {/* Tab: My Services (User only) */}
                {!isTrainer && !isAdmin && (
                  <TabPanel value={tabValue} index={1}>
                    <Box sx={{ p: { xs: 2, md: 3 } }}>
                      {getActiveRegistrations().length === 0 ? (
                        <Box 
                          textAlign="center" 
                          py={8}
                          sx={{
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                            borderRadius: '20px',
                          }}
                        >
                          <CardMembership sx={{ fontSize: 64, color: '#00b4ff', mb: 2, opacity: 0.5 }} />
                          <Typography variant="h6" color="text.secondary" fontWeight={600}>
                            No active service registrations
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mt={1}>
                            Start your fitness journey by registering for a service
                          </Typography>
                        </Box>
                      ) : (
                        <>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {getPaginatedRegistrations().map((registration) => {
                              const bookingStatus = getBookingStatus(registration);
                              const hasBooking = registration.upcomingBookings && registration.upcomingBookings.length > 0;
                              
                              return (
                              <ServiceCard key={registration.id}>
                                <Box display="flex" alignItems="flex-start" gap={2}>
                                  <Box
                                    sx={{
                                      width: 64,
                                      height: 64,
                                      borderRadius: '16px',
                                      background: BRAND_GRADIENT,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: 'white',
                                      flexShrink: 0,
                                    }}
                                  >
                                    <FitnessCenter sx={{ fontSize: 32 }} />
                                  </Box>
                                  <Box flex={1}>
                                    <Typography variant="h6" fontWeight={700} mb={1}>
                                      {registration.service.name}
                                    </Typography>
                                    <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                                      <Chip
                                        label={registration.status}
                                        size="small"
                                        sx={{
                                          background: 'linear-gradient(135deg, #11998e, #38ef7d)',
                                          color: 'white',
                                          fontWeight: 600,
                                        }}
                                      />
                                      {registration.trainerName && (
                                        <Chip
                                          label={`PT: ${registration.trainerName}`}
                                          size="small"
                                          sx={{
                                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                            color: 'white',
                                            fontWeight: 600,
                                          }}
                                        />
                                      )}
                                      <Chip
                                        label={bookingStatus.label}
                                        size="small"
                                        icon={hasBooking ? <Info sx={{ fontSize: 16, color: 'white !important' }} /> : undefined}
                                        onClick={() => hasBooking && handleViewBookingStatus(registration)}
                                        sx={{
                                          background: bookingStatus.color,
                                          color: 'white',
                                          fontWeight: 600,
                                          cursor: hasBooking ? 'pointer' : 'default',
                                          '&:hover': hasBooking ? {
                                            opacity: 0.8,
                                          } : {},
                                        }}
                                      />
                                    </Stack>
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                      <Box sx={{ flex: '1 1 50%', minWidth: '150px' }}>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                          Registered
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                          {formatDate(registration.registrationDate)}
                                        </Typography>
                                      </Box>
                                      {registration.expirationDate && (
                                        <Box sx={{ flex: '1 1 50%', minWidth: '150px' }}>
                                          <Typography variant="caption" color="text.secondary" display="block">
                                            Expires
                                          </Typography>
                                          <Typography variant="body2" fontWeight={600}>
                                            {formatDate(registration.expirationDate)}
                                          </Typography>
                                        </Box>
                                      )}
                                    </Box>
                                  </Box>
                                </Box>
                              </ServiceCard>
                              );
                            })}
                          </Box>

                          {/* Pagination */}
                          {getTotalPages() > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                              <Pagination 
                                count={getTotalPages()} 
                                page={page} 
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                                sx={{
                                  '& .MuiPaginationItem-root': {
                                    fontWeight: 600,
                                  },
                                  '& .Mui-selected': {
                                    background: BRAND_GRADIENT,
                                    color: 'white',
                                    '&:hover': {
                                      background: BRAND_GRADIENT,
                                      opacity: 0.9,
                                    },
                                  },
                                }}
                              />
                            </Box>
                          )}
                        </>
                      )}
                    </Box>
                  </TabPanel>
                )}
              </Box>
            </Box>
          </ProfileCard>
        </Container>

        {/* Edit Profile Modal */}
        {user && (
          <EditProfileModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            currentUser={{
              id: user.id,
              fullName: user.fullName || '',
              email: user.email || '',
              phoneNumber: user.phoneNumber,
              dateOfBirth: user.dateOfBirth,
              bio: user.bio,
              avatar: user.avatar,
            }}
            onSuccess={handleEditProfileSuccess}
          />
        )}

        {/* Booking Status Modal */}
        <BookingStatusModal
          open={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          booking={selectedBooking}
          registrationId={selectedRegistrationId || 0}
          onSelectNewTrainer={handleSelectNewTrainer}
        />
      </PageWrapper>
    </PowerGymLayout>
  );
};

export default Profile;
