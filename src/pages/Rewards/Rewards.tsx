import React from 'react';
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
} from '@mui/material';
import { EmojiEvents, TrendingUp, History, Login } from '@mui/icons-material';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout.tsx';
import { useReward } from '../../hooks/useReward';
import { useAuth } from '../../hooks/useAuth';
import { usePromotion } from '../../hooks/usePromotion';

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const Rewards: React.FC = () => {
  const { isLoggedIn, requireAuth } = useAuth();
  const { reward, transactions, loading, error } = useReward();
  const { promotions, loading: promotionsLoading, error: promotionsError } = usePromotion();

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
                                  {transactions.length}
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

                        {transactions.length === 0 ? (
                          <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography color="text.secondary">No transactions yet</Typography>
                          </Box>
                        ) : (
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
                        )}
                      </CardContent>
                    </Card>

                    {promotionsLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : promotions.length > 0 && (
                      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.07)' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                              Redeem points
                          </Typography>
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
                                  borderRadius: 2,
                                  border: '1px solid rgba(0,0,0,0.05)',
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
                                      borderRadius: '8px 8px 0 0',
                                    }}
                                  />
                                )}
                                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1rem' }}>
                                    {promotion.title}
                                  </Typography>
                                  {promotion.subtitle && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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
                                        label={`-${promotion.discountAmount.toLocaleString()} VNĐ`}
                                        color="primary"
                                        size="small"
                                      />
                                    )}
                                  </Box>
                                </CardContent>
                              </Card>
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    )}
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
