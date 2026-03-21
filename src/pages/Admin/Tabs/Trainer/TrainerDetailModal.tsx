import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Badge,
} from '@mui/material';
import {
  Close,
  Email,
  Phone,
  School,
  Work,
  Person,
  Description,
  Verified,
  Warning,
  Download,
  FiberManualRecord,
  Schedule,
  Assessment,
  PendingActions,
  CheckCircle,
  Cancel,
  Star,
  TrendingUp,
} from '@mui/icons-material';
import {
  getTrainerById,
  verifyTrainerDocument,
  type TrainerResponse,
} from '../../../../services/trainerService';
import trainerManagementService, {
  type TrainerScheduleResponse,
  type TrainerBookingInfo,
  type TrainerStatisticsResponse,
} from '../../../../services/trainerManagementService';

interface TrainerDetailModalProps {
  open: boolean;
  onClose: () => void;
  trainerId: number | null;
}

/* ─── Helpers ─────────────────────────────────────────────── */

const specialtyColorMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
  PERSONAL_TRAINER: 'primary',
  BOXING: 'warning',
  YOGA: 'success',
  CARDIO: 'info',
  GYM: 'secondary',
};

const levelColorMap: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
  BEGINNER: 'info',
  INTERMEDIATE: 'warning',
  ADVANCED: 'success',
  EXPERT: 'error',
};

const documentTypeLabels: Record<string, string> = {
  ID_CARD: 'National ID',
  PASSPORT: 'Passport',
  CERTIFICATE: 'Certificate',
  LICENSE: 'License',
  DIPLOMA: 'Diploma',
  HEALTH_CERTIFICATE: 'Health Certificate',
  CRIMINAL_RECORD: 'Criminal Record',
  CV: 'Curriculum Vitae',
};

const getSpecialtyColor = (s: string): 'primary' | 'secondary' | 'success' | 'warning' | 'info' => specialtyColorMap[s] ?? 'primary';
const getLevelColor = (s: string): 'success' | 'warning' | 'info' | 'error' => levelColorMap[s] ?? 'info';
const formatDocumentType = (t: string) => documentTypeLabels[t] ?? t;

/* ─── Section header ──────────────────────────────────────── */
const SectionHeader = ({ icon, title, count }: { icon: React.ReactNode; title: string; count?: number }) => (
    <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={2}
        pb={1.5}
        sx={{ borderBottom: '2px solid', borderColor: 'primary.main' }}
    >
      <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>{icon}</Box>
      <Typography variant="h6" fontWeight={700} letterSpacing={-0.3}>
        {title}
      </Typography>
      {count !== undefined && (
          <Chip
              label={count}
              size="small"
              sx={{ ml: 'auto', fontWeight: 700, bgcolor: 'primary.main', color: '#fff', height: 22, fontSize: 12 }}
          />
      )}
    </Box>
);

/* ─── Component ───────────────────────────────────────────── */
const TrainerDetailModal: React.FC<TrainerDetailModalProps> = ({ open, onClose, trainerId }) => {
  const [trainer, setTrainer] = useState<TrainerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [schedule, setSchedule] = useState<TrainerScheduleResponse | null>(null);
  const [pendingRequests, setPendingRequests] = useState<TrainerBookingInfo[]>([]);
  const [statistics, setStatistics] = useState<TrainerStatisticsResponse | null>(null);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (open && trainerId) {
      loadTrainerDetail();
      // Load additional data when switching tabs
      if (activeTab === 1) loadSchedule();
      if (activeTab === 2) loadPendingRequests();
      if (activeTab === 3) loadStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, trainerId, activeTab]);

  const loadSchedule = async () => {
    if (!trainerId) return;
    try {
      setLoadingSchedule(true);
      const fromDate = new Date().toISOString().split('T')[0];
      const toDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const response = await trainerManagementService.getTrainerSchedule(trainerId, fromDate, toDate);
      if (response.success) setSchedule(response.data);
    } catch (err: any) {
      console.error('Failed to load schedule:', err);
    } finally {
      setLoadingSchedule(false);
    }
  };

  const loadPendingRequests = async () => {
    if (!trainerId) return;
    try {
      setLoadingRequests(true);
      const response = await trainerManagementService.getTrainerPendingRequests(trainerId);
      if (response.success) setPendingRequests(response.data);
    } catch (err: any) {
      console.error('Failed to load pending requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const loadStatistics = async () => {
    if (!trainerId) return;
    try {
      setLoadingStats(true);
      const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const toDate = new Date().toISOString().split('T')[0];
      const response = await trainerManagementService.getTrainerStatistics(trainerId, fromDate, toDate);
      if (response.success) setStatistics(response.data);
    } catch (err: any) {
      console.error('Failed to load statistics:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (open && trainerId) loadTrainerDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, trainerId]);

  const loadTrainerDetail = async () => {
    if (!trainerId) return;
    try {
      setLoading(true);
      setError('');
      const response = await getTrainerById(trainerId);
      if (response.success) setTrainer(response.data);
      else setError(response.message);
    } catch (err: any) {
      setError(err.message || 'Failed to load trainer details.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' | 'primary' => {
    switch (status) {
      case 'CONFIRMED': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'error';
      case 'COMPLETED': return 'info';
      case 'CANCELLED': return 'primary';
      default: return 'primary';
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return timeString; // Return original string if parsing fails
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  };

  const handleVerifyDocument = async (documentId: number, isVerified: boolean) => {
    try {
      await verifyTrainerDocument(documentId, isVerified);
      await loadTrainerDetail();
    } catch (err: any) {
      setError(err.message || 'Failed to update document status.');
    }
  };

  const renderProfileTab = () => (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {/* Bio */}
      {trainer?.bio && (
        <Card sx={sectionCard}>
          <CardContent sx={{ p: 3 }}>
            <SectionHeader icon={<Person />} title="About" />
            <Typography
              variant="body2"
              color="text.secondary"
              lineHeight={1.8}
              sx={{ whiteSpace: 'pre-wrap' }}
            >
              {trainer.bio}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Specialties */}
      <Card sx={sectionCard}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader icon={<School />} title="Specialties" count={trainer?.specialties?.length ?? 0} />

          {trainer?.specialties?.length ? (
            trainer.specialties.map((specialty, i) => (
              <Card key={i} variant="outlined" sx={specialtyItem}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box display="flex" gap={1} alignItems="center" mb={1.5} flexWrap="wrap">
                    <Chip
                      label={specialty.specialty?.displayName ?? 'Unknown'}
                      color={getSpecialtyColor(specialty.specialty?.name ?? '')}
                      sx={{ fontWeight: 700 }}
                    />
                    <Chip
                      label={specialty.level}
                      color={getLevelColor(specialty.level ?? 'BEGINNER')}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  {specialty.description && (
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1.5 }}>
                      {specialty.description}
                    </Typography>
                  )}

                  <Box display="flex" gap={2}>
                    {specialty.experienceYears && (
                      <Box flex={1}>
                        <StatCell label="Experience" value={`${specialty.experienceYears} yrs`} />
                      </Box>
                    )}
                    {specialty.certifications && (
                      <Box flex={1}>
                        <StatCell label="Certifications" value={specialty.certifications} />
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Alert severity="info">No specialties on record.</Alert>
          )}
        </CardContent>
      </Card>

      <Card sx={sectionCard}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader icon={<Description />} title="Documents" count={trainer?.documents?.length ?? 0} />

          {trainer?.documents?.length ? (
            trainer.documents.map((doc, i) => (
              <Card key={i} variant="outlined" sx={docItem(doc.isVerified)}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                      <Typography variant="subtitle2" fontWeight={700}>
                        {formatDocumentType(doc.documentType)}
                      </Typography>
                      <Chip
                        icon={doc.isVerified
                          ? <Verified sx={{ fontSize: '14px !important' }} />
                          : <Warning sx={{ fontSize: '14px !important' }} />}
                        label={doc.isVerified ? 'Verified' : 'Pending'}
                        color={doc.isVerified ? 'success' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>

                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={() => window.open(doc.fileUrl, '_blank')}
                      >
                        Download
                      </Button>
                      <Button
                        size="small"
                        variant={doc.isVerified ? 'outlined' : 'contained'}
                        color={doc.isVerified ? 'error' : 'success'}
                        onClick={() => handleVerifyDocument(doc.id, !doc.isVerified)}
                        sx={{ fontWeight: 700 }}
                      >
                        {doc.isVerified ? 'Revoke' : 'Verify'}
                      </Button>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" mt={1} sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                    {doc.fileName}
                  </Typography>

                  {doc.description && (
                    <Typography variant="body2" mt={0.5} paragraph sx={{ mb: 1 }}>
                      {doc.description}
                    </Typography>
                  )}

                  <Box display="flex" gap={2} mt={0.5}>
                    <Box flex={1}>
                      <StatCell
                        label="Uploaded"
                        value={new Date(doc.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      />
                    </Box>
                    {doc.expiryDate && (
                      <Box flex={1}>
                        <StatCell
                          label="Expires"
                          value={new Date(doc.expiryDate).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        />
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Alert severity="info">No documents uploaded yet.</Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );

  const renderScheduleTab = () => (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
      {loadingSchedule ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : schedule ? (
        <Card sx={sectionCard}>
          <CardContent sx={{ p: 3 }}>
            <SectionHeader 
              icon={<Schedule />} 
              title={`Schedule (${formatDate(schedule.fromDate)} - ${formatDate(schedule.toDate)})`} 
              count={schedule.totalBookings}
            />
            
            {/* Schedule Summary */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
              <Box flex={1} minWidth={120}>
                <StatCell label="Total Bookings" value={(schedule.totalBookings || 0).toString()} />
              </Box>
              <Box flex={1} minWidth={120}>
                <StatCell label="Confirmed" value={(schedule.confirmedBookings || 0).toString()} />
              </Box>
              <Box flex={1} minWidth={120}>
                <StatCell label="Pending" value={(schedule.pendingBookings || 0).toString()} />
              </Box>
              <Box flex={1} minWidth={120}>
                <StatCell label="Avg/Day" value={(schedule.averageBookingsPerDay || 0).toFixed(1)} />
              </Box>
            </Box>

            {/* Daily Schedules */}
            {schedule.dailySchedules && schedule.dailySchedules.map((day, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={600}>
                      {formatDate(day.date)} ({day.dayOfWeek})
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Chip 
                        label={`${day.totalBookings || 0} bookings`} 
                        size="small" 
                        color={(day.totalBookings || 0) > 0 ? 'primary' : 'default'}
                      />
                      {day.hasConflicts && (
                        <Chip label="Conflicts" size="small" color="error" />
                      )}
                    </Box>
                  </Box>

                  {day.bookings && day.bookings.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Service</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {day.bookings.map((booking) => (
                            <TableRow key={booking.bookingId}>
                              <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                  {booking.startTime ? formatTime(booking.startTime) : 'N/A'} - {booking.endTime ? formatTime(booking.endTime) : 'N/A'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{booking.clientName || 'Unknown Client'}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {booking.clientEmail || 'No email'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{booking.serviceName || 'Unknown Service'}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {booking.serviceCategory || 'Unknown Category'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={booking.status || 'UNKNOWN'} 
                                  size="small" 
                                  color={getStatusColor(booking.status || 'UNKNOWN')}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="info">No bookings for this day</Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Alert severity="info">No schedule data available</Alert>
      )}
    </Box>
  );

  const renderPendingRequestsTab = () => (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
      {loadingRequests ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <Card sx={sectionCard}>
          <CardContent sx={{ p: 3 }}>
            <SectionHeader 
              icon={<PendingActions />} 
              title="Pending Booking Requests" 
              count={pendingRequests.length}
            />
            
            {pendingRequests.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Booking Code</TableCell>
                      <TableCell>Client</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <TableRow key={request.bookingId}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {request.bookingCode || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{request.clientName || 'Unknown Client'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {request.clientEmail || 'No email'}
                          </Typography>
                          {request.clientPhone && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {request.clientPhone}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{request.serviceName || 'Unknown Service'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {request.serviceCategory || 'Unknown Category'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {request.startTime ? formatTime(request.startTime) : 'N/A'} - {request.endTime ? formatTime(request.endTime) : 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {request.createdAt ? new Date(request.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {request.createdAt ? new Date(request.createdAt).toLocaleDateString('vi-VN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<CheckCircle />}
                              onClick={() => {
                                // Handle confirm booking
                                console.log('Confirm booking:', request.bookingId);
                              }}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<Cancel />}
                              onClick={() => {
                                // Handle reject booking
                                console.log('Reject booking:', request.bookingId);
                              }}
                            >
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">No pending booking requests</Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );

  const renderStatisticsTab = () => (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
      {loadingStats ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : statistics ? (
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Overview Stats */}
          <Card sx={sectionCard}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader 
                icon={<Assessment />} 
                title={`Statistics (${formatDate(statistics.fromDate)} - ${formatDate(statistics.toDate)})`}
              />
              
              <Box display="flex" gap={2} flexWrap="wrap">
                <Box flex={1} minWidth={120}>
                  <StatCell label="Total Bookings" value={(statistics.totalBookings || 0).toString()} />
                </Box>
                <Box flex={1} minWidth={120}>
                  <StatCell label="Completed" value={(statistics.completedBookings || 0).toString()} />
                </Box>
                <Box flex={1} minWidth={120}>
                  <StatCell label="Completion Rate" value={`${(statistics.completionRate || 0).toFixed(1)}%`} />
                </Box>
                <Box flex={1} minWidth={120}>
                  <StatCell 
                    label="Average Rating" 
                    value={`${(statistics.averageRating || 0).toFixed(1)} ⭐`} 
                  />
                </Box>
                <Box flex={1} minWidth={120}>
                  <StatCell 
                    label="Total Revenue" 
                    value={`${(statistics.totalRevenue || 0).toLocaleString('vi-VN')} VNĐ`} 
                  />
                </Box>
                <Box flex={1} minWidth={120}>
                  <StatCell 
                    label="Avg Revenue/Session" 
                    value={`${(statistics.averageRevenuePerSession || 0).toLocaleString('vi-VN')} VNĐ`} 
                  />
                </Box>
                <Box flex={1} minWidth={120}>
                  <StatCell label="New Clients" value={(statistics.newClientsCount || 0).toString()} />
                </Box>
                <Box flex={1} minWidth={120}>
                  <StatCell 
                    label="Client Retention" 
                    value={`${(statistics.clientRetentionRate || 0).toFixed(1)}%`} 
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Service Breakdown */}
          {statistics.serviceBreakdown && statistics.serviceBreakdown.length > 0 && (
            <Card sx={sectionCard}>
              <CardContent sx={{ p: 3 }}>
                <SectionHeader 
                  icon={<TrendingUp />} 
                  title="Service Performance" 
                  count={statistics.serviceBreakdown.length}
                />
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell align="right">Bookings</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                        <TableCell align="right">Avg Rating</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {statistics.serviceBreakdown.map((service, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {service.serviceName || 'Unknown Service'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {service.serviceCategory || 'Unknown Category'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{service.bookingCount || 0}</TableCell>
                          <TableCell align="right">
                            {(service.revenue || 0).toLocaleString('vi-VN')} VNĐ
                          </TableCell>
                          <TableCell align="right">
                            <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                              <Star sx={{ fontSize: 16, color: '#ffc107' }} />
                              <Typography variant="body2">
                                {(service.averageRating || 0).toFixed(1)}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Box>
      ) : (
        <Alert severity="info">No statistics data available</Alert>
      )}
    </Box>
  );
  if (loading) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: dialogPaper }}>
          <DialogContent>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={240}>
              <CircularProgress />
            </Box>
          </DialogContent>
        </Dialog>
    );
  }

  /* ── Empty state ── */
  if (!trainer && !loading) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: dialogPaper }}>
          <DialogContent>
            <Alert severity="error" sx={{ mt: 1 }}>Trainer not found.</Alert>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} variant="outlined">Close</Button>
          </DialogActions>
        </Dialog>
    );
  }

  const displayExp = (() => {
    const total = trainer?.totalExperienceYears ?? 0;
    const maxSpec = trainer?.specialties?.reduce((m, s) => Math.max(m, s.experienceYears ?? 0), 0) ?? 0;
    return total || maxSpec;
  })();

  return (
      <Dialog
          open={open}
          onClose={onClose}
          maxWidth="lg"
          fullWidth
          PaperProps={{ sx: dialogPaper }}
      >
        {/* ── Title bar ── */}
        <DialogTitle sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="overline" color="text.secondary" fontWeight={600} letterSpacing={1.5}>
                Trainer Profile
              </Typography>
              <Typography variant="h5" fontWeight={800} letterSpacing={-0.5} lineHeight={1.2}>
                {trainer?.fullName}
              </Typography>
            </Box>
            <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' },
                }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        {/* ── Body: two-column layout ── */}
        <DialogContent
            dividers
            sx={{
              p: 0,
              bgcolor: 'grey.50',
              display: 'flex',
              overflow: 'hidden',   // parent does NOT scroll; children scroll independently
              flexGrow: 1,
            }}
        >
          {error && (
              <Alert
                  severity="error"
                  sx={{ position: 'absolute', top: 8, left: 8, right: 8, zIndex: 1 }}
              >
                {error}
              </Alert>
          )}

          {/* ── LEFT: profile card — fixed, no scroll ── */}
          <Box
              sx={{
                width: { xs: '100%', md: 280 },
                flexShrink: 0,
                borderRight: '1px solid',
                borderColor: 'divider',
                bgcolor: '#fff',
                overflowY: 'auto',
                p: 2.5,
              }}
          >
            <Box textAlign="center" mb={2}>
              <Avatar
                  src={trainer?.avatar}
                  sx={{
                    width: 100,
                    height: 100,
                    mx: 'auto',
                    mb: 1.5,
                    fontSize: 38,
                    fontWeight: 700,
                    bgcolor: 'primary.light',
                    border: '4px solid',
                    borderColor: 'primary.main',
                  }}
              >
                {trainer?.fullName?.charAt(0)}
              </Avatar>

              <Chip
                  icon={<FiberManualRecord sx={{ fontSize: '10px !important' }} />}
                  label={trainer?.isActive ? 'Active' : 'Inactive'}
                  color={trainer?.isActive ? 'success' : 'error'}
                  size="small"
                  sx={{ fontWeight: 700 }}
              />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <List dense disablePadding>
              <InfoRow icon={<Email />} text={trainer?.email} />
              <InfoRow icon={<Phone />} text={trainer?.phoneNumber || 'Not provided'} />
              {displayExp > 0 && (
                  <InfoRow icon={<Work />} text={`${displayExp} yrs experience`} />
              )}
              {trainer?.education && (
                  <InfoRow icon={<School />} text={trainer.education} />
              )}
            </List>

            {trainer?.emergencyContact && (
                <Box mt={2.5}>
                  <Divider sx={{ mb: 1.5 }} />
                  <Typography
                      variant="caption"
                      fontWeight={700}
                      textTransform="uppercase"
                      letterSpacing={1}
                      color="text.secondary"
                  >
                    Emergency Contact
                  </Typography>
                  <Typography variant="body2" fontWeight={600} mt={0.5}>
                    {trainer.emergencyContact}
                  </Typography>
                  {trainer.emergencyPhone && (
                      <Typography variant="body2" color="text.secondary">
                        {trainer.emergencyPhone}
                      </Typography>
                  )}
                </Box>
            )}
          </Box>

          {/* ── RIGHT: tabbed content ── */}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fff' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                sx={{ px: 3 }}
              >
                <Tab 
                  icon={<Person />} 
                  label="Profile" 
                  iconPosition="start"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                />
                <Tab 
                  icon={<Schedule />} 
                  label="Schedule" 
                  iconPosition="start"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                />
                <Tab 
                  icon={
                    <Badge badgeContent={pendingRequests.length} color="error">
                      <PendingActions />
                    </Badge>
                  } 
                  label="Requests" 
                  iconPosition="start"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                />
                <Tab 
                  icon={<Assessment />} 
                  label="Statistics" 
                  iconPosition="start"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                />
              </Tabs>
            </Box>

            {/* Tab Content */}
            {activeTab === 0 && renderProfileTab()}
            {activeTab === 1 && renderScheduleTab()}
            {activeTab === 2 && renderPendingRequestsTab()}
            {activeTab === 3 && renderStatisticsTab()}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, bgcolor: '#fff', borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
          <Button onClick={onClose} variant="outlined" sx={{ fontWeight: 700 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
  );
};
const InfoRow = ({ icon, text }: { icon: React.ReactNode; text?: string | null }) => (
    <ListItem disablePadding sx={{ mb: 1 }}>
      <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>{icon}</ListItemIcon>
      <ListItemText
          primary={text}
          primaryTypographyProps={{ variant: 'body2', color: 'text.primary', fontWeight: 500 }}
      />
    </ListItem>
);

const StatCell = ({ label, value }: { label: string; value: string }) => (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.8}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700}>
        {value}
      </Typography>
    </Box>
);
const dialogPaper = {
  borderRadius: 3,
  // Chiều cao cố định để dialog không co giãn theo nội dung
  height: '90vh',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
};

const sectionCard = {
  borderRadius: 2.5,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  border: '1px solid',
  borderColor: 'divider',
};

const specialtyItem = {
  borderRadius: 2,
  mb: 2,
  '&:last-child': { mb: 0 },
  bgcolor: 'grey.50',
  '&:hover': { bgcolor: 'grey.100' },
  transition: 'background-color 0.15s',
};

const docItem = (verified: boolean) => ({
  borderRadius: 2,
  mb: 2,
  '&:last-child': { mb: 0 },
  borderLeft: '4px solid',
  borderLeftColor: verified ? 'success.main' : 'warning.main',
  bgcolor: verified ? 'rgba(46,125,50,0.03)' : 'rgba(237,108,2,0.03)',
});

export default TrainerDetailModal;