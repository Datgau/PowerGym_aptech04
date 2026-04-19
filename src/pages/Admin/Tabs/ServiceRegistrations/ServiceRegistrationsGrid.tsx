import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Link as MuiLink, IconButton, Tooltip
} from '@mui/material';
import { Assignment, PersonAdd, Payment, Print, Info } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  getAllServiceRegistrations,
  type ServiceRegistrationFilters
} from '../../../../services/serviceRegistrationService';
import { downloadInvoice } from '../../../../services/api';
import type {
  ServiceRegistrationResponse,
  FilterState,
  RegistrationStatus,
  PaymentStatus,
} from '../../../../types/serviceRegistration';
import type { TrainerBooking } from '../../../../services/serviceRegistrationService';
import TablePagination from '../../../../components/Common/TablePagination';
import { usePagination } from '../../../../hooks/usePagination';
import FilterSection from './components/FilterSection';
import SearchBox from './components/SearchBox';
import TrainerAssignmentModal from './components/TrainerAssignmentModal';
import ConfirmPaymentModal from './components/ConfirmPaymentModal';
import BookingStatusModal from '../../../../components/ServiceRegistration/BookingStatusModal';
import type { AssignmentResult } from './components/TrainerAssignmentModal';
import type { ScheduleSelection } from './components/TrainerSchedulePicker';

const PageWrapper = styled(Box)({
  minHeight: '100%',
  background: '#f8faff',
  padding: '32px',
});

const HeaderSection = styled(Box)({
  background: '#ffffff',
  borderRadius: 20,
  border: '1px solid #eaeef8',
  padding: '28px 32px',
  marginBottom: 28,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
});

const HeaderLeft = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
});

const HeaderIconBox = styled(Box)({
  width: 48,
  height: 48,
  borderRadius: 14,
  background: 'linear-gradient(135deg, #00b4ff22, #0066ff22)',
  border: '1px solid #0066ff33',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#0066ff',
});

const ContentSection = styled(Box)({
  background: '#ffffff',
  borderRadius: 20,
  border: '1px solid #eaeef8',
  padding: '24px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
});

// Format date as DD/MM/YYYY
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Get status color
const getStatusColor = (status: RegistrationStatus): 'success' | 'error' | 'warning' | 'default' => {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'EXPIRED':
      return 'error';
    case 'CANCELLED':
      return 'error';
    case 'COMPLETED':
      return 'default';
    default:
      return 'default';
  }
};

// Get payment status color
const getPaymentStatusColor = (status: PaymentStatus | null): 'success' | 'error' | 'warning' | 'default' => {
  if (!status) return 'warning'; // null = đăng ký tại quầy, hiển thị warning (PENDING)
  switch (status) {
    case 'SUCCESS':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'FAILED':
      return 'error';
    case 'EXPIRED':
      return 'error';
    default:
      return 'default';
  }
};

// Get booking status from registration
const getBookingStatus = (registration: ServiceRegistrationResponse) => {
  if (!registration.upcomingBookings || registration.upcomingBookings.length === 0) {
    return { status: 'NO_BOOKING', label: 'No Booking', color: '#9e9e9e', hasBooking: false };
  }
  
  const latestBooking = registration.upcomingBookings[0];
  
  switch (latestBooking.status) {
    case 'PENDING':
      return { status: 'PENDING', label: 'Pending', color: '#ff9800', hasBooking: true };
    case 'CONFIRMED':
      return { status: 'CONFIRMED', label: 'Confirmed', color: '#4caf50', hasBooking: true };
    case 'REJECTED':
      return { status: 'REJECTED', label: 'Rejected', color: '#f44336', hasBooking: true };
    case 'CANCELLED':
      return { status: 'CANCELLED', label: 'Cancelled', color: '#9e9e9e', hasBooking: true };
    case 'COMPLETED':
      return { status: 'COMPLETED', label: 'Completed', color: '#2196f3', hasBooking: true };
    case 'NO_SHOW':
      return { status: 'NO_SHOW', label: 'No Show', color: '#d32f2f', hasBooking: true };
    case 'RESCHEDULED':
      return { status: 'RESCHEDULED', label: 'Rescheduled', color: '#9c27b0', hasBooking: true };
    default:
      return { status: latestBooking.status, label: latestBooking.status, color: '#757575', hasBooking: true };
  }
};

const ServiceRegistrationsGrid: React.FC = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<ServiceRegistrationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: null,
    paymentStatus: null,
    registrationType: null,
    searchQuery: '',
  });
  const [selectedRegistration, setSelectedRegistration] = useState<ServiceRegistrationResponse | null>(null);
  const [openTrainerModal, setOpenTrainerModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<TrainerBooking | null>(null);
  const [printingInvoice, setPrintingInvoice] = useState<number | null>(null);
  // Stores the trainer + schedule chosen in TrainerAssignmentModal so ConfirmPaymentModal can skip the picker
  const [lastAssignment, setLastAssignment] = useState<AssignmentResult | null>(null);

  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(10);

  useEffect(() => {
    loadRegistrations();
  }, [paginationState.page, paginationState.rowsPerPage, filters]);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      setError('');

      const filterParams: ServiceRegistrationFilters = {};
      if (filters.status) filterParams.status = filters.status;
      if (filters.paymentStatus) filterParams.paymentStatus = filters.paymentStatus;
      if (filters.registrationType) filterParams.registrationType = filters.registrationType;
      if (filters.searchQuery) filterParams.searchQuery = filters.searchQuery;

      const response = await getAllServiceRegistrations(
        paginationState.page,
        paginationState.rowsPerPage,
        filterParams
      );

      if (response.success) {
        const pageData = response.data;
        setRegistrations(pageData.content);
        setPaginationData(pageData.totalPages, pageData.totalElements);
      } else {
        setError(response.message || 'Failed to load service registrations');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load service registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
    // Reset to first page when filters change
    handleChangePage(null, 0);
  };

  const handleClearFilters = () => {
    setFilters({
      status: null,
      paymentStatus: null,
      registrationType: null,
      searchQuery: '',
    });
    handleChangePage(null, 0);
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: value,
    }));
    // Reset to first page when search changes
    handleChangePage(null, 0);
  };

  const handleOpenTrainerModal = (registration: ServiceRegistrationResponse) => {
    setSelectedRegistration(registration);
    setOpenTrainerModal(true);
  };

  const handleOpenPaymentModal = (registration: ServiceRegistrationResponse) => {
    setSelectedRegistration(registration);
    setOpenPaymentModal(true);
  };

  const handleAssignmentSuccess = (result: AssignmentResult) => {
    setLastAssignment(result);
    setOpenTrainerModal(false);
    // Keep selectedRegistration so ConfirmPaymentModal can open right after
    loadRegistrations();
    // Auto-open payment modal so admin can confirm payment immediately
    setOpenPaymentModal(true);
  };
  const handlePaymentSuccess = () => {
    setOpenPaymentModal(false);
    setSelectedRegistration(null);
    setLastAssignment(null);
    loadRegistrations();
  };

  const handleMemberClick = (userId: number) => {
    // Navigate to admin dashboard with members tab
    // This assumes the AdminDashboard has a members tab at index 1
    navigate(`/admin?tab=1&memberId=${userId}`);
  };

  const handlePrintInvoice = async (registration: ServiceRegistrationResponse) => {
    if (!registration.paymentOrderId) {
      setError('No payment order found for this registration');
      return;
    }

    try {
      setPrintingInvoice(registration.id);
      const blob = await downloadInvoice(registration.paymentOrderId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${registration.paymentOrderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download invoice');
    } finally {
      setPrintingInvoice(null);
    }
  };

  const handleViewBookingStatus = (registration: ServiceRegistrationResponse) => {
    if (registration.upcomingBookings && registration.upcomingBookings.length > 0) {
      setSelectedBooking(registration.upcomingBookings[0]);
      setSelectedRegistration(registration);
      setOpenBookingModal(true);
    }
  };

  const handleReassignTrainer = () => {
    // Close booking modal and open trainer assignment modal
    setOpenBookingModal(false);
    if (selectedRegistration) {
      setOpenTrainerModal(true);
    }
  };

  if (loading && registrations.length === 0) {
    return (
      <PageWrapper display="flex" justifyContent="center" alignItems="center" minHeight={360}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={40} thickness={3} sx={{ color: '#0066ff' }} />
          <Typography color="text.secondary" fontSize={14}>Loading service registrations...</Typography>
        </Stack>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* ── Header ── */}
      <HeaderSection>
        <HeaderLeft>
          <HeaderIconBox>
            <Assignment sx={{ fontSize: 22 }} />
          </HeaderIconBox>
          <Box>
            <Typography fontWeight={700} fontSize={20} color="#0f172a" lineHeight={1.3}>
              Service Registrations
            </Typography>
            <Typography fontSize={13.5} color="#64748b" mt={0.3}>
              Manage member service registrations and trainer assignments
            </Typography>
          </Box>
        </HeaderLeft>
      </HeaderSection>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontSize: 13.5 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <ContentSection>
        {/* ── Filters and Search ── */}
        <FilterSection
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <SearchBox
          value={filters.searchQuery}
          onChange={handleSearchChange}
        />

        <TableContainer component={Paper} sx={{
          overflowX: 'auto',
          borderRadius: 3,
          border: '1px solid #eaeef8',
          boxShadow: 'none'
        }}>
          <Table sx={{ minWidth: { xs: 800, md: 1000 } }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8faff' }}>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Member</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Service</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Payment Status</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Registration Date</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Expiration Date</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Trainer</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Booking Status</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Type</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Status</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrations.map((registration) => {
                const bookingStatus = getBookingStatus(registration);
                const canReassignTrainer = bookingStatus.status === 'REJECTED';
                
                return (
                <TableRow key={registration.id} hover sx={{ '&:hover': { backgroundColor: '#f8faff' } }}>
                  <TableCell>
                    <Box>
                      <MuiLink
                        component="button"
                        onClick={() => handleMemberClick(registration.user.id)}
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', md: '1rem' },
                          color: '#0066ff',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          display: 'block',
                          textAlign: 'left',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {registration.user.fullName}
                      </MuiLink>
                      <Typography variant="body2" color="text.secondary" fontSize={{ xs: '0.75rem', md: '0.875rem' }}>
                        {registration.user.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    {registration.service.name}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={registration.paymentStatus || 'PENDING'}
                      color={getPaymentStatusColor(registration.paymentStatus)}
                      size="small"
                      sx={{ fontSize: { xs: '0.75rem', md: '0.8125rem' } }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    {formatDate(registration.registrationDate)}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    {formatDate(registration.expirationDate)}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    {registration.trainerName || 'No Trainer'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={bookingStatus.label}
                      size="small"
                      icon={bookingStatus.hasBooking ? <Info sx={{ fontSize: 16, color: 'white !important' }} /> : undefined}
                      onClick={() => bookingStatus.hasBooking && handleViewBookingStatus(registration)}
                      sx={{
                        fontSize: { xs: '0.75rem', md: '0.8125rem' },
                        background: bookingStatus.color,
                        color: 'white',
                        cursor: bookingStatus.hasBooking ? 'pointer' : 'default',
                        '&:hover': bookingStatus.hasBooking ? {
                          opacity: 0.8,
                        } : {},
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={registration.registrationType || 'ONLINE'}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: { xs: '0.75rem', md: '0.8125rem' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={registration.status}
                      color={getStatusColor(registration.status)}
                      size="small"
                      sx={{ fontSize: { xs: '0.75rem', md: '0.8125rem' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>

                      {/* Set Trainer / Reassign Trainer */}
                      <Tooltip
                          title={
                            canReassignTrainer
                                ? 'Reassign trainer (booking rejected)'
                                : registration.trainerName
                                ? 'Trainer already assigned'
                                : 'Assign trainer'
                          }
                      >
                      <span>
                        <IconButton
                            size="small"
                            onClick={() => handleOpenTrainerModal(registration)}
                            disabled={!!registration.trainerName && !canReassignTrainer}
                            color={canReassignTrainer ? 'error' : registration.trainerName ? 'default' : 'primary'}
                        >
                          <PersonAdd fontSize="small" />
                        </IconButton>
                      </span>
                      </Tooltip>

                      {/* Confirm Payment */}
                      <Tooltip
                          title={
                            registration.registrationType === 'COUNTER' &&
                            (registration.paymentStatus === 'PENDING' || !registration.paymentStatus)
                                ? 'Confirm payment'
                                : 'No payment required'
                          }
                      >
                          <span>
                            <IconButton
                                size="small"
                                onClick={() => handleOpenPaymentModal(registration)}
                                disabled={
                                  !(
                                      registration.registrationType === 'COUNTER' &&
                                      (registration.paymentStatus === 'PENDING' || !registration.paymentStatus)
                                  )
                                }
                                color="success"
                            >
                              <Payment fontSize="small" />
                            </IconButton>
                          </span>
                      </Tooltip>

                      {/* Print Invoice */}
                      <Tooltip
                          title={
                            !registration.paymentOrderId
                                ? 'No payment order'
                                : 'Download invoice'
                          }
                      >
                          <span>
                            <IconButton
                                size="small"
                                onClick={() => handlePrintInvoice(registration)}
                                disabled={!registration.paymentOrderId || printingInvoice === registration.id}
                                color="secondary"
                            >
                              {printingInvoice === registration.id ? (
                                <CircularProgress size={16} />
                              ) : (
                                <Print fontSize="small" />
                              )}
                            </IconButton>
                          </span>
                      </Tooltip>

                    </Stack>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={3}>
          <TablePagination
            count={paginationState.totalElements}
            page={paginationState.page}
            rowsPerPage={paginationState.rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            labelRowsPerPage="Registrations per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} registrations`
            }
          />
        </Box>

        {registrations.length === 0 && !loading && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              No service registrations found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filters.searchQuery || filters.status || filters.paymentStatus || filters.registrationType
                ? 'Try adjusting your filters or search query'
                : 'Service registrations will appear here'}
            </Typography>
          </Box>
        )}
      </ContentSection>

      {/* ── Trainer Assignment Modal ── */}
      {selectedRegistration && (
        <TrainerAssignmentModal
          open={openTrainerModal}
          onClose={() => {
            setOpenTrainerModal(false);
            setSelectedRegistration(null);
          }}
          registrationId={selectedRegistration.id}
          serviceName={selectedRegistration.service.name}
          onSuccess={handleAssignmentSuccess}
        />
      )}

      {/* ── Confirm Payment Modal ── */}
      {selectedRegistration && (
        <ConfirmPaymentModal
          open={openPaymentModal}
          onClose={() => {
            setOpenPaymentModal(false);
            setSelectedRegistration(null);
            setLastAssignment(null);
          }}
          registrationId={selectedRegistration.id}
          memberName={selectedRegistration.user.fullName}
          serviceName={selectedRegistration.service.name}
          amount={selectedRegistration.service.price}
          trainerId={lastAssignment?.trainerId ?? selectedRegistration.trainerId ?? undefined}
          trainerName={lastAssignment?.trainerName ?? selectedRegistration.trainerName ?? undefined}
          preselectedSchedule={
            lastAssignment?.schedule ?? 
            (selectedRegistration.upcomingBookings && selectedRegistration.upcomingBookings.length > 0
              ? {
                  date: new Date(selectedRegistration.upcomingBookings[0].bookingDate),
                  slot: {
                    start: selectedRegistration.upcomingBookings[0].startTime,
                    end: selectedRegistration.upcomingBookings[0].endTime,
                    label: `${selectedRegistration.upcomingBookings[0].startTime} - ${selectedRegistration.upcomingBookings[0].endTime}`
                  }
                }
              : null)
          }
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* ── Booking Status Modal ── */}
      {selectedRegistration && selectedBooking && (
        <BookingStatusModal
          open={openBookingModal}
          onClose={() => {
            setOpenBookingModal(false);
            setSelectedBooking(null);
            setSelectedRegistration(null);
          }}
          booking={selectedBooking}
          registrationId={selectedRegistration.id}
          onSelectNewTrainer={handleReassignTrainer}
        />
      )}
    </PageWrapper>
  );
};

export default ServiceRegistrationsGrid;
