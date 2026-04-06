import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
  Grid,
  Chip,
  Avatar,
  Alert,
  Snackbar,
  IconButton
} from '@mui/material';
import {
  EmojiEvents,
  TrendingUp,
  People,
  Stars,
  Visibility
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import type { UserReward } from '../../../../@type/reward';
import TablePagination from '../../../../components/Common/TablePagination';
import { usePagination } from '../../../../hooks/usePagination';
import UserRewardDetailModal from './UserRewardDetailModal';
import {rewardService} from "../../../../services/rewardService.ts";

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
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
});

const HeaderIconBox = styled(Box)({
  width: 48,
  height: 48,
  borderRadius: 14,
  background: 'linear-gradient(135deg, #ffd70022, #ffa50022)',
  border: '1px solid #ffd70033',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffa500',
});

const StatCard = styled(Card)({
  borderRadius: 16,
  border: '1px solid #eaeef8',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transform: 'translateY(-2px)',
  },
});

const ContentSection = styled(Box)({
  background: '#ffffff',
  borderRadius: 20,
  border: '1px solid #eaeef8',
  padding: '24px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
});

const RewardsPage: React.FC = () => {
  const [allRewards, setAllRewards] = useState<UserReward[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(10);

  const rewards = React.useMemo(() => {
    const startIndex = paginationState.page * paginationState.rowsPerPage;
    const endIndex = startIndex + paginationState.rowsPerPage;
    return allRewards.slice(startIndex, endIndex);
  }, [allRewards, paginationState.page, paginationState.rowsPerPage]);

  React.useEffect(() => {
    const totalPages = Math.ceil(allRewards.length / paginationState.rowsPerPage);
    setPaginationData(totalPages, allRewards.length);
  }, [allRewards.length, paginationState.rowsPerPage, setPaginationData]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rewardsData, statsData] = await Promise.all([
        rewardService.getAllUserRewards(0, 20),
        rewardService.getRewardStatistics()
      ]);
      setAllRewards(rewardsData);
      setStatistics(statsData);
    } catch (error: any) {
      console.error('Load data error:', error);
      showNotification(error.response?.data?.message || 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
  };

  const handleViewDetails = (userId: number) => {
    setSelectedUserId(userId);
    setDetailModalOpen(true);
  };

  const getMembershipColor = (level: string) => {
    switch (level) {
      case 'PLATINUM':
        return { bg: '#e8f5e9', color: '#2e7d32', border: '#81c784' };
      case 'GOLD':
        return { bg: '#fff8e1', color: '#f57c00', border: '#ffb74d' };
      default:
        return { bg: '#f5f5f5', color: '#616161', border: '#bdbdbd' };
    }
  };

  if (loading) {
    return (
      <PageWrapper display="flex" justifyContent="center" alignItems="center" minHeight={360}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={40} thickness={3} sx={{ color: '#ffa500' }} />
          <Typography color="text.secondary" fontSize={14}>Loading rewards data...</Typography>
        </Stack>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <HeaderSection>
        <Box display="flex" alignItems="center" gap={2}>
          <HeaderIconBox>
            <EmojiEvents sx={{ fontSize: 22 }} />
          </HeaderIconBox>
          <Box>
            <Typography fontWeight={700} fontSize={20} color="#0f172a" lineHeight={1.3}>
              Rewards Management
            </Typography>
            <Typography fontSize={13.5} color="#64748b" mt={0.3}>
              Monitor user rewards and membership levels
            </Typography>
          </Box>
        </Box>
      </HeaderSection>

      {/* User Rewards List */}
      <ContentSection>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={700}>
            User Rewards
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {paginationState.totalElements} total users
          </Typography>
        </Box>

        {rewards.length > 0 ? (
          <>
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 900 }}>
                {/* Table Header */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1.2fr 1fr 80px',
                    gap: 2,
                    p: 2,
                    bgcolor: '#f8faff',
                    borderRadius: '12px 12px 0 0',
                    border: '1px solid #eaeef8',
                    borderBottom: 'none',
                  }}
                >
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    USER INFO
                  </Typography>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    CONTACT
                  </Typography>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    LEVEL
                  </Typography>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" textAlign="right">
                    POINTS
                  </Typography>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" textAlign="center">
                    ACTION
                  </Typography>
                </Box>

                {/* Table Body */}
                <Stack spacing={0}>
                  {rewards.map((reward, index) => {
                    const membershipStyle = getMembershipColor(reward.membershipLevel);
                    return (
                      <Box
                        key={reward.id}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 2fr 1.2fr 1fr 80px',
                          gap: 2,
                          p: 2.5,
                          bgcolor: '#ffffff',
                          border: '1px solid #eaeef8',
                          borderTop: index === 0 ? '1px solid #eaeef8' : 'none',
                          borderRadius: index === rewards.length - 1 ? '0 0 12px 12px' : 0,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: '#f8faff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          },
                        }}
                      >
                        {/* User Info */}
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              width: 44,
                              height: 44,
                              bgcolor: membershipStyle.bg,
                              color: membershipStyle.color,
                              fontWeight: 700,
                              fontSize: '1rem',
                            }}
                          >
                            {reward.userName ? reward.userName.charAt(0).toUpperCase() : reward.userId}
                          </Avatar>
                          <Box minWidth={0} flex={1}>
                            <Typography variant="body2" fontWeight={600} color="#0f172a" noWrap>
                              {reward.userName || `User #${reward.userId}`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              ID: {reward.userId}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Contact */}
                        <Box minWidth={0}>
                          <Typography variant="caption" color="text.secondary" display="block" noWrap>
                            {reward.userEmail || 'No email'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" noWrap mt={0.5}>
                            {reward.userPhone || 'No phone'}
                          </Typography>
                        </Box>

                        {/* Membership */}
                        <Box>
                          <Chip
                            label={reward.membershipLevelDisplay}
                            size="small"
                            sx={{
                              bgcolor: membershipStyle.bg,
                              color: membershipStyle.color,
                              border: `1px solid ${membershipStyle.border}`,
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              height: 24,
                            }}
                          />
                          {reward.nextLevel && (
                            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                              {reward.pointsToNextLevel} to {reward.nextLevel}
                            </Typography>
                          )}
                        </Box>

                        {/* Points */}
                        <Box textAlign="right">
                          <Typography variant="h6" fontWeight={700} color="#ffa500">
                            {reward.totalPoints.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {reward.pointsValue.toLocaleString('vi-VN')}đ
                          </Typography>
                        </Box>

                        {/* Action */}
                        <Box display="flex" justifyContent="center">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(reward.userId)}
                            sx={{
                              color: '#1976d2',
                              bgcolor: '#f0f6ff',
                              borderRadius: '8px',
                              width: 32,
                              height: 32,
                              '&:hover': {
                                bgcolor: '#dbeaff',
                                transform: 'scale(1.05)',
                              },
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <Visibility sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            </Box>

            <Box mt={3}>
              <TablePagination
                count={paginationState.totalElements}
                page={paginationState.page}
                rowsPerPage={paginationState.rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 50]}
              />
            </Box>
          </>
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
              No rewards data yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#aaa', mt: 1 }}>
              User rewards will appear here once they start earning points.
            </Typography>
          </Box>
        )}
      </ContentSection>

      <UserRewardDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        userId={selectedUserId || 0}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </PageWrapper>
  );
};

export default RewardsPage;
