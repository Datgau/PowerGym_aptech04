import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  TextField,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Tooltip,
} from '@mui/material';
import { Close, PersonAdd, CalendarMonth } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getAvailableTrainers } from '../../../../../services/serviceRegistrationService';
import { enhancedServiceRegistrationService } from '../../../../../services/enhancedServiceRegistrationService';
import type { AvailableTrainerResponse } from '../../../../../types/serviceRegistration';
import TrainerSchedulePicker, { type ScheduleSelection } from './TrainerSchedulePicker';

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    maxWidth: 680,
    width: '100%',
  },
});

const StyledDialogTitle = styled(DialogTitle)({
  background: 'linear-gradient(135deg, #f8faff, #ffffff)',
  borderBottom: '1px solid #eaeef8',
  padding: '24px 32px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const StyledDialogContent = styled(DialogContent)({
  padding: '24px 32px',
});

const TrainerCard = styled(Box)<{ selected: boolean }>(({ selected }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: 16,
  borderRadius: 12,
  border: `2px solid ${selected ? '#0066ff' : '#eaeef8'}`,
  background: selected ? '#f0f7ff' : '#ffffff',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': { borderColor: '#0066ff', background: '#f8faff' },
}));

const PrimaryButton = styled(Button)({
  background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
  borderRadius: 10,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 14,
  padding: '10px 24px',
  color: '#fff',
  boxShadow: '0 4px 16px rgba(0,102,255,0.28)',
  '&:hover': {
    background: 'linear-gradient(135deg, #00c6ff, #0077ff)',
    boxShadow: '0 6px 24px rgba(0,102,255,0.38)',
  },
  '&:disabled': { background: '#cbd5e1', color: '#94a3b8', boxShadow: 'none' },
});

export interface AssignmentResult {
  trainerId: number;
  trainerName: string;
  schedule: ScheduleSelection;
}

interface TrainerAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  registrationId: number;
  serviceName: string;
  onSuccess: (result: AssignmentResult) => void;
}

const TrainerAssignmentModal: React.FC<TrainerAssignmentModalProps> = ({
                                                                         open,
                                                                         onClose,
                                                                         registrationId,
                                                                         serviceName,
                                                                         onSuccess,
                                                                       }) => {
  type Step = 'trainer' | 'schedule';

  const [step, setStep] = useState<Step>('trainer');
  const [availableTrainers, setAvailableTrainers] = useState<AvailableTrainerResponse[]>([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [schedule, setSchedule] = useState<ScheduleSelection | null>(null);

  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setStep('trainer');
      setSelectedTrainerId(null);
      setNotes('');
      setSchedule(null);
      setError('');
      loadAvailableTrainers();
    }
  }, [open, registrationId]);

  const loadAvailableTrainers = async () => {
    try {
      setLoadingTrainers(true);
      setError('');
      const response = await getAvailableTrainers(registrationId);
      if (response.success) {
        setAvailableTrainers(response.data);
        if (response.data.length === 0) setError('No trainers available for this service');
      } else {
        setError(response.message || 'Failed to load trainers');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load trainers');
    } finally {
      setLoadingTrainers(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedTrainerId || !schedule) return;

    try {
      setAssigning(true);
      setError('');

      const response = await enhancedServiceRegistrationService.assignTrainer(
          registrationId,
          selectedTrainerId,
          notes || undefined
      );

      if (response.success) {
        const trainer = availableTrainers.find((t) => t.id === selectedTrainerId)!;
        onSuccess({
          trainerId: selectedTrainerId,
          trainerName: trainer.fullName,
          schedule,
        });
        onClose();
      } else {
        setError(response.message || 'Failed to assign trainer');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to assign trainer');
    } finally {
      setAssigning(false);
    }
  };

  const selectedTrainer = availableTrainers.find((t) => t.id === selectedTrainerId);

  return (
      <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <StyledDialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #00b4ff22, #0066ff22)',
                  border: '1px solid #0066ff33',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0066ff',
                }}
            >
              {step === 'trainer' ? <PersonAdd /> : <CalendarMonth />}
            </Box>
            <Box>
              <Typography fontWeight={700} fontSize={18} color="#0f172a">
                {step === 'trainer' ? 'Select Trainer' : 'Select Schedule'}
              </Typography>
              <Typography fontSize={13} color="#64748b">
                {serviceName} · Step {step === 'trainer' ? '1' : '2'} / 2
              </Typography>
            </Box>
          </Box>
          <Button onClick={onClose} sx={{ minWidth: 'auto', color: '#64748b' }}>
            <Close />
          </Button>
        </StyledDialogTitle>

        <StyledDialogContent>
          {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
          )}

          {step === 'trainer' && (
              <>
                {loadingTrainers ? (
                    <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                      <Stack alignItems="center" spacing={2}>
                        <CircularProgress size={40} thickness={3} sx={{ color: '#0066ff' }} />
                        <Typography color="text.secondary" fontSize={14}>
                          Loading trainers...
                        </Typography>
                      </Stack>
                    </Box>
                ) : (
                    <>
                      <Typography fontWeight={600} fontSize={14} color="#0f172a" mb={2}>
                        Select a trainer:
                      </Typography>
                      <Stack spacing={2}>
                        {availableTrainers.map((trainer) => (
                            <TrainerCard
                                key={trainer.id}
                                selected={selectedTrainerId === trainer.id}
                                onClick={() => setSelectedTrainerId(trainer.id)}
                            >
                              <Avatar src={trainer.avatar || undefined} sx={{ width: 48, height: 48 }}>
                                {trainer.fullName.charAt(0)}
                              </Avatar>
                              <Box flex={1}>
                                <Typography fontWeight={600} fontSize={15} color="#0f172a">
                                  {trainer.fullName}
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                                  {trainer.specialtyNames.slice(0, 3).map((s, i) => (
                                      <Chip
                                          key={i}
                                          label={s}
                                          size="small"
                                          sx={{
                                            fontSize: 11,
                                            height: 20,
                                            background: '#f0f7ff',
                                            color: '#0066ff',
                                            border: '1px solid #0066ff33',
                                          }}
                                      />
                                  ))}
                                </Box>
                                <Typography fontSize={12} color="#64748b" mt={0.5}>
                                  {trainer.totalExperienceYears} years of experience
                                </Typography>
                              </Box>
                            </TrainerCard>
                        ))}
                      </Stack>

                      {availableTrainers.length > 0 && (
                          <>
                            <Divider sx={{ my: 3 }} />
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Notes (optional)"
                                placeholder="Add notes for this trainer assignment..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          </>
                      )}
                    </>
                )}
              </>
          )}

          {step === 'schedule' && selectedTrainer && (
              <TrainerSchedulePicker
                  trainerId={selectedTrainer.id}
                  trainerName={selectedTrainer.fullName}
                  value={schedule}
                  onChange={setSchedule}
              />
          )}
        </StyledDialogContent>

        <DialogActions sx={{ padding: '16px 32px 24px', gap: 1 }}>
          <Button
              onClick={onClose}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, color: '#64748b' }}
          >
            Cancel
          </Button>

          {step === 'schedule' && (
              <Button
                  onClick={() => setStep('trainer')}
                  variant="outlined"
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Back
              </Button>
          )}

          {step === 'trainer' ? (
              <Tooltip title={!selectedTrainerId ? 'Please select a trainer' : ''}>
            <span>
              <PrimaryButton
                  onClick={() => setStep('schedule')}
                  disabled={!selectedTrainerId || loadingTrainers}
                  startIcon={<CalendarMonth />}
              >
                Select Schedule
              </PrimaryButton>
            </span>
              </Tooltip>
          ) : (
              <Tooltip title={!schedule ? 'Please select date and time' : ''}>
            <span>
              <PrimaryButton
                  onClick={handleAssign}
                  disabled={!schedule || assigning}
                  startIcon={
                    assigning ? <CircularProgress size={16} color="inherit" /> : <PersonAdd />
                  }
              >
                {assigning ? 'Assigning...' : 'Confirm Assignment'}
              </PrimaryButton>
            </span>
              </Tooltip>
          )}
        </DialogActions>
      </StyledDialog>
  );
};

export default TrainerAssignmentModal;