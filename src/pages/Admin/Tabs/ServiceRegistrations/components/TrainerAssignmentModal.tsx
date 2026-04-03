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
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
  Divider
} from '@mui/material';
import { Close, PersonAdd } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getAvailableTrainers } from '../../../../../services/serviceRegistrationService';
import { enhancedServiceRegistrationService } from '../../../../../services/enhancedServiceRegistrationService';
import type { AvailableTrainerResponse } from '../../../../../types/serviceRegistration';

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    maxWidth: 600,
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
  '&:hover': {
    borderColor: '#0066ff',
    background: '#f8faff',
  },
}));

const ConfirmButton = styled(Button)({
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
  '&:disabled': {
    background: '#cbd5e1',
    color: '#94a3b8',
    boxShadow: 'none',
  },
});

interface TrainerAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  registrationId: number;
  serviceName: string;
  onSuccess: () => void;
}

const TrainerAssignmentModal: React.FC<TrainerAssignmentModalProps> = ({
  open,
  onClose,
  registrationId,
  serviceName,
  onSuccess,
}) => {
  const [availableTrainers, setAvailableTrainers] = useState<AvailableTrainerResponse[]>([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      loadAvailableTrainers();
    } else {
      // Reset state when modal closes
      setSelectedTrainerId(null);
      setNotes('');
      setError('');
    }
  }, [open, registrationId]);

  const loadAvailableTrainers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAvailableTrainers(registrationId);
      
      if (response.success) {
        setAvailableTrainers(response.data);
        if (response.data.length === 0) {
          setError('No trainers available for this service category');
        }
      } else {
        setError(response.message || 'Failed to load available trainers');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load available trainers');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedTrainerId) return;

    try {
      setAssigning(true);
      setError('');
      
      const response = await enhancedServiceRegistrationService.assignTrainer(
        registrationId,
        selectedTrainerId,
        notes || undefined
      );

      if (response.success) {
        onSuccess();
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
            <PersonAdd />
          </Box>
          <Box>
            <Typography fontWeight={700} fontSize={18} color="#0f172a">
              Assign Trainer
            </Typography>
            <Typography fontSize={13} color="#64748b">
              {serviceName}
            </Typography>
          </Box>
        </Box>
        <Button
          onClick={onClose}
          sx={{ minWidth: 'auto', color: '#64748b' }}
        >
          <Close />
        </Button>
      </StyledDialogTitle>

      <StyledDialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress size={40} thickness={3} sx={{ color: '#0066ff' }} />
              <Typography color="text.secondary" fontSize={14}>
                Loading available trainers...
              </Typography>
            </Stack>
          </Box>
        ) : (
          <>
            <Typography fontWeight={600} fontSize={14} color="#0f172a" mb={2}>
              Select a trainer:
            </Typography>

            <RadioGroup value={selectedTrainerId} onChange={(e) => setSelectedTrainerId(Number(e.target.value))}>
              <Stack spacing={2}>
                {availableTrainers.map((trainer) => (
                  <TrainerCard
                    key={trainer.id}
                    selected={selectedTrainerId === trainer.id}
                    onClick={() => setSelectedTrainerId(trainer.id)}
                  >
                    <FormControlLabel
                      value={trainer.id}
                      control={<Radio sx={{ display: 'none' }} />}
                      label=""
                      sx={{ margin: 0, position: 'absolute', opacity: 0 }}
                    />
                    <Avatar
                      src={trainer.avatar || undefined}
                      sx={{ width: 48, height: 48 }}
                    >
                      {trainer.fullName.charAt(0)}
                    </Avatar>
                    <Box flex={1}>
                      <Typography fontWeight={600} fontSize={15} color="#0f172a">
                        {trainer.fullName}
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                        {trainer.specialtyNames.slice(0, 3).map((specialty, index) => (
                          <Chip
                            key={index}
                            label={specialty}
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
                        {trainer.totalExperienceYears} years experience
                      </Typography>
                    </Box>
                  </TrainerCard>
                ))}
              </Stack>
            </RadioGroup>

            {availableTrainers.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes (optional)"
                  placeholder="Add any notes about this trainer assignment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </>
            )}
          </>
        )}
      </StyledDialogContent>

      <DialogActions sx={{ padding: '16px 32px 24px' }}>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            color: '#64748b',
          }}
        >
          Cancel
        </Button>
        <ConfirmButton
          onClick={handleAssign}
          disabled={!selectedTrainerId || assigning || loading}
          startIcon={assigning ? <CircularProgress size={16} color="inherit" /> : <PersonAdd />}
        >
          {assigning ? 'Assigning...' : 'Assign Trainer'}
        </ConfirmButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default TrainerAssignmentModal;
