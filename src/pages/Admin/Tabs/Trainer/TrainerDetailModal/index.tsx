import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, IconButton, Avatar,
  Chip, Divider, List, CircularProgress, Alert,
  Tabs, Tab, Badge,
} from '@mui/material';
import {
  Close, Email, Phone, School, Work,
  Person, FiberManualRecord, Schedule, Assessment, PendingActions,
} from '@mui/icons-material';
import { getTrainerById, verifyTrainerDocument } from '../../../../../services/trainerService';
import trainerManagementService from '../../../../../services/trainerManagementService';
import type { TrainerDetailModalProps, TrainerDetailState } from './types';
import { dialogPaper } from './constants';
import InfoRow from './components/InfoRow';
import ProfileTab from './components/ProfileTab';
import ScheduleTab from './components/ScheduleTab';
import PendingRequestsTab from './components/PendingRequestsTab';
import StatisticsTab from './components/StatisticsTab';

const TrainerDetailModal: React.FC<TrainerDetailModalProps> = ({ open, onClose, trainerId }) => {
  const [state, setState] = useState<TrainerDetailState>({
    trainer: null, loading: false, error: '', activeTab: 0,
    schedule: null, pendingRequests: [], statistics: null,
    loadingSchedule: false, loadingRequests: false, loadingStats: false,
  });

  const { trainer, loading, error, activeTab, schedule, pendingRequests, statistics,
    loadingSchedule, loadingRequests, loadingStats } = state;

  const set = (patch: Partial<TrainerDetailState>) => setState(prev => ({ ...prev, ...patch }));

  const loadTrainerDetail = async () => {
    if (!trainerId) return;
    try {
      set({ loading: true, error: '' });
      const response = await getTrainerById(trainerId);
      if (response.success) set({ trainer: response.data });
      else set({ error: response.message });
    } catch (err: any) {
      set({ error: err.message || 'Failed to load trainer details.' });
    } finally {
      set({ loading: false });
    }
  };

  const loadSchedule = async () => {
    if (!trainerId) return;
    try {
      set({ loadingSchedule: true });
      const fromDate = new Date().toISOString().split('T')[0];
      const toDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const response = await trainerManagementService.getTrainerSchedule(trainerId, fromDate, toDate);
      if (response.success) set({ schedule: response.data });
    } catch (err) {
      console.error('Failed to load schedule:', err);
    } finally {
      set({ loadingSchedule: false });
    }
  };

  const loadPendingRequests = async () => {
    if (!trainerId) return;
    try {
      set({ loadingRequests: true });
      const response = await trainerManagementService.getTrainerPendingRequests(trainerId);
      if (response.success) set({ pendingRequests: response.data });
    } catch (err) {
      console.error('Failed to load pending requests:', err);
    } finally {
      set({ loadingRequests: false });
    }
  };

  const loadStatistics = async () => {
    if (!trainerId) return;
    try {
      set({ loadingStats: true });
      const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const toDate = new Date().toISOString().split('T')[0];
      const response = await trainerManagementService.getTrainerStatistics(trainerId, fromDate, toDate);
      if (response.success) set({ statistics: response.data });
    } catch (err) {
      console.error('Failed to load statistics:', err);
    } finally {
      set({ loadingStats: false });
    }
  };

  useEffect(() => {
    if (open && trainerId) {
      loadTrainerDetail();
      if (activeTab === 1) loadSchedule();
      if (activeTab === 2) loadPendingRequests();
      if (activeTab === 3) loadStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, trainerId, activeTab]);

  const handleVerifyDocument = async (documentId: number, isVerified: boolean) => {
    try {
      await verifyTrainerDocument(documentId, isVerified);
      await loadTrainerDetail();
    } catch (err: any) {
      set({ error: err.message || 'Failed to update document status.' });
    }
  };

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
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: dialogPaper }}>
      {/* Title */}
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
          <IconButton onClick={onClose} size="small"
            sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Body */}
      <DialogContent dividers sx={{ p: 0, bgcolor: 'grey.50', display: 'flex', overflow: 'hidden', flexGrow: 1 }}>
        {error && (
          <Alert severity="error" sx={{ position: 'absolute', top: 8, left: 8, right: 8, zIndex: 1 }}>
            {error}
          </Alert>
        )}

        {/* Left sidebar */}
        <Box sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0, borderRight: '1px solid',
          borderColor: 'divider', bgcolor: '#fff', overflowY: 'auto', p: 2.5 }}>
          <Box textAlign="center" mb={2}>
            <Avatar src={trainer?.avatar}
              sx={{ width: 100, height: 100, mx: 'auto', mb: 1.5, fontSize: 38, fontWeight: 700,
                bgcolor: 'primary.light', border: '4px solid', borderColor: 'primary.main' }}>
              {trainer?.fullName?.charAt(0)}
            </Avatar>
            <Chip icon={<FiberManualRecord sx={{ fontSize: '10px !important' }} />}
              label={trainer?.isActive ? 'Active' : 'Inactive'}
              color={trainer?.isActive ? 'success' : 'error'} size="small" sx={{ fontWeight: 700 }} />
          </Box>

          <Divider sx={{ mb: 2 }} />

          <List dense disablePadding>
            <InfoRow icon={<Email />} text={trainer?.email} />
            <InfoRow icon={<Phone />} text={trainer?.phoneNumber || 'Not provided'} />
            {displayExp > 0 && <InfoRow icon={<Work />} text={`${displayExp} years experience`} />}
            {trainer?.education && <InfoRow icon={<School />} text={trainer.education} />}
          </List>

          {trainer?.emergencyContact && (
            <Box mt={2.5}>
              <Divider sx={{ mb: 1.5 }} />
              <Typography variant="caption" fontWeight={700} textTransform="uppercase"
                letterSpacing={1} color="text.secondary">
                Emergency Contact
              </Typography>
              <Typography variant="body2" fontWeight={600} mt={0.5}>{trainer.emergencyContact}</Typography>
              {trainer.emergencyPhone && (
                <Typography variant="body2" color="text.secondary">{trainer.emergencyPhone}</Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Right: tabs */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fff' }}>
            <Tabs value={activeTab} onChange={(_, v) => set({ activeTab: v })} sx={{ px: 3 }}>
              <Tab icon={<Person />} label="Profile" iconPosition="start" sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab icon={<Schedule />} label="Schedule" iconPosition="start" sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab icon={<Badge badgeContent={pendingRequests.length} color="error"><PendingActions /></Badge>}
                label="Requests" iconPosition="start" sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab icon={<Assessment />} label="Statistics" iconPosition="start" sx={{ textTransform: 'none', fontWeight: 600 }} />
            </Tabs>
          </Box>

          {activeTab === 0 && trainer && <ProfileTab trainer={trainer} onVerifyDocument={handleVerifyDocument} />}
          {activeTab === 1 && <ScheduleTab loading={loadingSchedule} schedule={schedule} />}
          {activeTab === 2 && <PendingRequestsTab loading={loadingRequests} pendingRequests={pendingRequests} />}
          {activeTab === 3 && <StatisticsTab loading={loadingStats} statistics={statistics} />}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, bgcolor: '#fff', borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
        <Button onClick={onClose} variant="outlined" sx={{ fontWeight: 700 }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrainerDetailModal;
