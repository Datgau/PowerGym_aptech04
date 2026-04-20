import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
  Stack,
  Button,
  CardMedia,
  Grid,
} from '@mui/material';
import { EmojiEvents, TrendingUp, History, Login, Redeem } from '@mui/icons-material';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout.tsx';
import { useReward } from '../../hooks/useReward';
import { useAuth } from '../../hooks/useAuth';
import { usePromotion } from '../../hooks/usePromotion';
import TablePagination from '../../components/Common/TablePagination';
import { usePagination } from '../../hooks/usePagination';

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

// Fixed redeem items with images
const REDEEM_ITEMS = [
  {
    id: 1,
    name: 'Gym Towel',
    description: 'Premium microfiber gym towel with PowerGym logo',
    points: 500,
    image: 'https://khannamphong.vn/wp-content/uploads/2020/06/khan-gym-oceangym.jpg',
  },
  {
    id: 2,
    name: 'Water Bottle',
    description: 'Insulated stainless steel water bottle (750ml)',
    points: 800,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'Sauna Ticket',
    description: 'Single entry sauna session ticket (60 minutes)',
    points: 1200,
    image: 'https://hanteco.vn/hinhanh/tintuc/su-khac-nhau-giua-sauna-va-steambath-la-gi-1.jpg',
  },
  {
    id: 4,
    name: 'Protein Shaker',
    description: 'BPA-free protein shaker with mixing ball',
    points: 600,
    image: 'data:image/jpeg;base64,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',
  },
  {
    id: 5,
    name: 'Gym Bag',
    description: 'Durable sports gym bag with multiple compartments',
    points: 1500,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
  },
  {
    id: 6,
    name: 'Massage Session',
    description: 'Professional sports massage session (30 minutes)',
    points: 2000,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop',
  },
];

const Rewards: React.FC = () => {
  const { isLoggedIn, requireAuth } = useAuth();
  const { reward, transactions: allTransactions, loading, error } = useReward();
  const { promotions, loading: promotionsLoading, error: promotionsError } = usePromotion();

  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(5);

  const transactions = React.useMemo(() => {
    const startIndex = paginationState.page * paginationState.rowsPerPage;
    const endIndex = startIndex + paginationState.rowsPerPage;
    return allTransactions.slice(startIndex, endIndex);
  }, [allTransactions, paginationState.page, paginationState.rowsPerPage]);

  React.useEffect(() => {
    const totalPages = Math.ceil(allTransactions.length / paginationState.rowsPerPage);
    setPaginationData(totalPages, allTransactions.length);
  }, [allTransactions.length, paginationState.rowsPerPage, setPaginationData]);

  const getMembershipColor = (level: string) => {
    // Use brand gradient for all membership levels
    return BRAND_GRADIENT;
  };

  const getMembershipIcon = (level: string) => {
    switch (level) {
      case 'PLATINUM':
        return '💎';
      case 'GOLD':
        return '🏆';
      default:
        return '🥈';
    }
  };

  const progressToNext = reward?.nextLevel
    ? ((reward.totalPoints % 5000) / 5000) * 100
    : 100;

  return (
    <PowerGymLayout>
      {/* ── Hero Banner ── */}
      <Box
        sx={{
          background: BRAND_GRADIENT,
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
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

        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography
              variant="overline"
              sx={{
                color: 'rgba(255,255,255,0.75)',
                letterSpacing: 5,
                fontSize: '0.7rem',
                fontWeight: 600,
                display: 'block',
                mb: 2,
              }}
            >
              PowerGym Premium
            </Typography>

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.4rem', md: '3.8rem' },
                color: '#fff',
                lineHeight: 1.15,
                mb: 2,
                letterSpacing: '-0.5px',
              }}
            >
              My Rewards
            </Typography>

            <Box sx={{
              width: 56, height: 3,
              background: 'rgba(255,255,255,0.5)',
              borderRadius: 2, mx: 'auto', mb: 3,
            }} />

            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.78)',
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                lineHeight: 1.8,
                maxWidth: 520,
                mx: 'auto',
              }}
            >
              Earn points and get special benefits with every purchase
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ── Content Section ── */}
      <Box sx={{ background: '#f4f6f9', py: { xs: 6, md: 9 } }}>
        <Container maxWidth="xl">
          {/* Public Content - For unauthenticated users */}
            {!isLoggedIn && (
                <>
                    {promotionsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                            <CircularProgress size={60} />
                        </Box>
                    ) : promotionsError ? (
                        <Alert severity="error" sx={{ borderRadius: 3, mb: 3 }}>
                            {promotionsError}
                        </Alert>
                    ) : (
                        <>
                            {/* Login CTA Banner */}
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: 3,
                                    border: '1px solid rgba(0,0,0,0.07)',
                                    mb: 4,
                                    background: BRAND_GRADIENT,
                                    color: 'white',
                                }}
                            >
                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                    <Login sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                        Log in to unlock personalized offers
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                                        Access your reward points, transaction history, and exclusive promotions
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => requireAuth()}
                                        sx={{
                                            bgcolor: 'white',
                                            color: '#045668',
                                            fontWeight: 600,
                                            px: 4,
                                            '&:hover': {
                                                bgcolor: 'rgba(255,255,255,0.9)',
                                            },
                                        }}
                                    >
                                        See now
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Public Promotions */}
                            <Box>
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}
                                >
                                    Public Reward Redemption Programs
                                </Typography>

                                {promotions.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 8 }}>
                                        <Typography variant="h6" color="text.secondary">
                                            No promotions available
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: {
                                                xs: '1fr',
                                                sm: 'repeat(2, 1fr)',
                                                md: 'repeat(3, 1fr)',
                                            },
                                            gap: 3,
                                        }}
                                    >
                                        {promotions.map((promotion) => (
                                            <Card
                                                key={promotion.id}
                                                elevation={0}
                                                sx={{
                                                    borderRadius: 3,
                                                    border: '1px solid rgba(0,0,0,0.07)',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                {promotion.image && (
                                                    <Box
                                                        component="img"
                                                        src={promotion.image}
                                                        alt={promotion.title}
                                                        sx={{
                                                            width: '100%',
                                                            height: 200,
                                                            objectFit: 'cover',
                                                            borderRadius: '12px 12px 0 0',
                                                        }}
                                                    />
                                                )}
                                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                                        {promotion.title}
                                                    </Typography>

                                                    {promotion.subtitle && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                            {promotion.subtitle}
                                                        </Typography>
                                                    )}

                                                    {promotion.description && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                            {promotion.description}
                                                        </Typography>
                                                    )}

                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        {promotion.discountPercentage && (
                                                            <Chip
                                                                label={`${promotion.discountPercentage}% OFF`}
                                                                color="primary"
                                                                size="small"
                                                            />
                                                        )}

                                                        {promotion.discountAmount && (
                                                            <Chip
                                                                label={`-${promotion.discountAmount.toLocaleString()} VND`}
                                                                color="primary"
                                                                size="small"
                                                            />
                                                        )}
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </>
                    )}
                </>
            )}

          {/* Private Content - For authenticated users */}
          {isLoggedIn && (
            <>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                  <CircularProgress size={60} />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ borderRadius: 3 }}>
                  {error}
                </Alert>
              ) : !reward ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    No reward data available
                  </Typography>
                </Box>
              ) : (
                <>
                  {/* Section header */}
                  <Stack direction="row" alignItems="flex-end" justifyContent="space-between" mb={5}>
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: '#1366ba', fontWeight: 700, letterSpacing: 4, fontSize: '0.68rem' }}
                      >
                        Membership Status
                      </Typography>
                      <Typography variant="h5" fontWeight={700} color="text.primary" mt={0.5}>
                        {reward.membershipLevelDisplay} Member
                      </Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Top Row: Membership Card + Quick Stats */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
                        gap: 3,
                      }}
                    >
                      {/* Membership Card */}
                      <Card
                        elevation={0}
                        sx={{
                          background: getMembershipColor(reward.membershipLevel),
                          color: 'white',
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: 3,
                          border: '1px solid rgba(0,0,0,0.07)',
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                            <Box>
                              <Typography variant="overline" sx={{ opacity: 0.9 }}>
                                Membership Level
                              </Typography>
                              <Typography variant="h3" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getMembershipIcon(reward.membershipLevel)} {reward.membershipLevelDisplay}
                              </Typography>
                            </Box>
                            <Chip
                              icon={<EmojiEvents />}
                              label={`${reward.totalPoints.toLocaleString()} points`}
                              sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '1rem',
                                px: 1,
                              }}
                            />
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Points Value
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {reward.pointsValue.toLocaleString()} VNĐ
                              </Typography>
                            </Box>
                          </Box>

                          {reward.nextLevel && (
                            <Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                  Progress to {reward.nextLevel}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {reward.pointsToNextLevel.toLocaleString()} points remaining
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={progressToNext}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: 'rgba(255,255,255,0.2)',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: 'white',
                                    borderRadius: 4,
                                  },
                                }}
                              />
                            </Box>
                          )}
                        </CardContent>
                      </Card>

                      {/* Quick Stats */}
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr',
                          gap: 2,
                        }}
                      >
                        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.07)' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 2,
                                  background: BRAND_GRADIENT,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <TrendingUp sx={{ color: 'white' }} />
                              </Box>
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Total Points
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                  {reward.totalPoints.toLocaleString()}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>

                        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.07)' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 2,
                                  background: BRAND_GRADIENT,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <History sx={{ color: 'white' }} />
                              </Box>
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Transactions
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                  {allTransactions.length}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    </Box>

                    {/* Transaction History */}
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.07)' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                          Transaction History
                        </Typography>

                        {allTransactions.length === 0 ? (
                          <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography color="text.secondary">No transactions yet</Typography>
                          </Box>
                        ) : (
                          <>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              {transactions.map((transaction) => (
                                <Box
                                  key={transaction.id}
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: 'background.default',
                                  }}
                                >
                                  <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                      {transaction.description}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {transaction.formattedDate}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={`${transaction.transactionType === 'EARN' ? '+' : '-'}${transaction.points} points`}
                                    color={transaction.transactionType === 'EARN' ? 'success' : 'error'}
                                    sx={{ fontWeight: 600 }}
                                  />
                                </Box>
                              ))}
                            </Box>

                            <Box mt={3}>
                              <TablePagination
                                count={paginationState.totalElements}
                                page={paginationState.page}
                                rowsPerPage={paginationState.rowsPerPage}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 20]}
                                labelRowsPerPage="Transactions per page:"
                              />
                            </Box>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* Redeem Points Section */}
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.07)' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                          <Redeem sx={{ color: '#1366ba', fontSize: 28 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Redeem Points
                          </Typography>
                        </Box>

                        <Grid container spacing={3}>
                          {REDEEM_ITEMS.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                              <Card
                                elevation={0}
                                sx={{
                                  borderRadius: 2,
                                  border: '1.5px solid #ebebeb',
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                    transform: 'translateY(-4px)',
                                  },
                                }}
                              >
                                <CardMedia
                                  component="img"
                                  height="180"
                                  image={item.image}
                                  alt={item.name}
                                  sx={{ objectFit: 'cover' }}
                                />
                                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1.1rem' }}>
                                    {item.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {item.description}
                                  </Typography>
                                  <Box sx={{ borderTop: '1px solid #ebebeb', pt: 2, mt: 'auto' }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                      <Chip
                                        icon={<EmojiEvents sx={{ fontSize: 16 }} />}
                                        label={`${item.points} points`}
                                        sx={{
                                          bgcolor: '#fff3e0',
                                          color: '#f57c00',
                                          fontWeight: 700,
                                          fontSize: '0.9rem',
                                        }}
                                      />
                                      <Button
                                        variant="contained"
                                        size="small"
                                        disabled={!reward || reward.totalPoints < item.points}
                                        sx={{
                                          borderRadius: 2,
                                          textTransform: 'none',
                                          fontWeight: 600,
                                          background: BRAND_GRADIENT,
                                          '&:hover': {
                                            opacity: 0.9,
                                          },
                                          '&:disabled': {
                                            bgcolor: '#ffffff',
                                            color: '#a8a8a8',
                                          }
                                        }}
                                      >
                                        Redeem
                                      </Button>
                                    </Box>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                </>
              )}
            </>
          )}
        </Container>
      </Box>
    </PowerGymLayout>
  );
};

export default Rewards;
