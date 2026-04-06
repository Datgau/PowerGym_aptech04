import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Stack,
  Chip,
  Card,
  CardContent,
  Divider,
  Alert
} from '@mui/material';
import {
  Close,
  TrendingUp,
  TrendingDown,
  EmojiEvents
} from '@mui/icons-material';
import type { RewardTransaction } from '../../../../@type/reward';
import { rewardService } from '../../../../services/rewardService';

interface UserRewardDetailModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

const UserRewardDetailModal: React.FC<UserRewardDetailModalProps> = ({
  open,
  onClose,
  userId
}) => {
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && userId) {
      loadTransactions();
    }
  }, [open, userId]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await rewardService.getUserTransactions(userId);
      setTransactions(data);
    } catch (error: any) {
      console.error('Load transactions error:', error);
      setError(error.response?.data?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ffd70022, #ffa50022)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffa500',
              }}
            >
              <EmojiEvents sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h6" fontWeight={700}>
              User #{userId} - Reward Transactions
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress size={40} thickness={3} sx={{ color: '#ffa500' }} />
              <Typography color="text.secondary" fontSize={14}>
                Loading transactions...
              </Typography>
            </Stack>
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : transactions.length > 0 ? (
          <Stack spacing={2}>
            {transactions.map((transaction) => (
              <Card
                key={transaction.id}
                elevation={0}
                sx={{
                  border: '1.5px solid #ebebeb',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          bgcolor: transaction.transactionType === 'EARN' ? '#e8f5e9' : '#fff3e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: transaction.transactionType === 'EARN' ? '#2e7d32' : '#f57c00',
                        }}
                      >
                        {transaction.transactionType === 'EARN' ? (
                          <TrendingUp sx={{ fontSize: 20 }} />
                        ) : (
                          <TrendingDown sx={{ fontSize: 20 }} />
                        )}
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {transaction.transactionTypeDisplay}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.formattedDate}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={`${transaction.transactionType === 'EARN' ? '+' : '-'}${transaction.points} points`}
                      sx={{
                        bgcolor: transaction.transactionType === 'EARN' ? '#e8f5e9' : '#fff3e0',
                        color: transaction.transactionType === 'EARN' ? '#2e7d32' : '#f57c00',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    />
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography variant="body2" color="text.secondary">
                    {transaction.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 8,
              borderRadius: '16px',
              border: '2px dashed #e8e8e8',
              bgcolor: '#fafafa',
            }}
          >
            <Typography variant="h6" sx={{ color: '#555', fontWeight: 600 }}>
              No transactions yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#aaa', mt: 1 }}>
              This user hasn't earned or redeemed any points.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserRewardDetailModal;
