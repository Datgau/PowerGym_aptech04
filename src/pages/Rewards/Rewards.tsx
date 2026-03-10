import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Chip,
  Grid,
  Zoom
} from '@mui/material';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout.tsx';
import { EmojiEvents, CardGiftcard, Star, Loyalty } from '@mui/icons-material';

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const Rewards: React.FC = () => {
  const rewardTiers = [
    {
      name: 'Bronze',
      range: '0-999 điểm',
      color: '#CD7F32',
      icon: <EmojiEvents />,
      benefits: ['Tích điểm cơ bản', 'Đổi quà theo điểm']
    },
    {
      name: 'Silver',
      range: '1000-2999 điểm',
      color: '#C0C0C0',
      icon: <Star />,
      benefits: ['Tích điểm x1.2', 'Ưu tiên đặt lịch', 'Giảm giá 5%']
    },
    {
      name: 'Gold',
      range: '3000+ điểm',
      color: '#FFD700',
      icon: <Loyalty />,
      benefits: ['Tích điểm x1.5', 'Ưu tiên cao nhất', 'Giảm giá 10%', 'Quà tặng đặc biệt']
    }
  ];

  const pointRules = [
    { action: 'Mỗi lần check-in', points: 10 },
    { action: 'Tham gia lớp nhóm', points: 15 },
    { action: 'Giới thiệu bạn bè', points: 100 },
    { action: 'Đánh giá dịch vụ', points: 5 }
  ];

  const rewards = [
    { name: 'Áo thun PowerGym', points: 1000, icon: <CardGiftcard /> },
    { name: 'Bình nước thể thao', points: 800, icon: <CardGiftcard /> },
    { name: 'Khăn tập PowerGym', points: 600, icon: <CardGiftcard /> },
    { name: '1 buổi PT miễn phí', points: 500, icon: <CardGiftcard /> },
    { name: '1 tuần tập miễn phí', points: 1500, icon: <CardGiftcard /> },
    { name: '1 tháng tập miễn phí', points: 2000, icon: <CardGiftcard /> }
  ];

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
              PowerRewards
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
              Membership Reward Program — train more, earn more rewards.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ── Content Section ── */}
      <Box sx={{ background: '#f4f6f9', py: { xs: 6, md: 9 } }}>
        <Container maxWidth="xl">
          {/* How it works */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="overline"
              sx={{ color: '#1366ba', fontWeight: 700, letterSpacing: 4, fontSize: '0.68rem' }}
            >
              How It Works
            </Typography>
            <Typography variant="h5" fontWeight={700} color="text.primary" mt={0.5} mb={4}>
              Earn Points & Redeem Rewards
            </Typography>

            <Grid container spacing={3}>
              {pointRules.map((rule, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Zoom in timeout={500 + idx * 100}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        border: '1px solid rgba(0,0,0,0.07)',
                        textAlign: 'center',
                        p: 3,
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'translateY(-4px)' },
                      }}
                    >
                      <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
                        {rule.action}
                      </Typography>
                      <Chip
                        label={`+${rule.points} điểm`}
                        sx={{
                          background: BRAND_GRADIENT,
                          color: '#fff',
                          fontWeight: 700,
                        }}
                      />
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Membership Tiers */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="overline"
              sx={{ color: '#1366ba', fontWeight: 700, letterSpacing: 4, fontSize: '0.68rem' }}
            >
              Hạng thành viên
            </Typography>
            <Typography variant="h5" fontWeight={700} color="text.primary" mt={0.5} mb={4}>
              Đặc Quyền Theo Hạng
            </Typography>

            <Grid container spacing={3}>
              {rewardTiers.map((tier, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Zoom in timeout={700 + idx * 100}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        border: '2px solid',
                        borderColor: tier.color,
                        textAlign: 'center',
                        p: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          background: tier.color,
                        },
                      }}
                    >
                      <Box sx={{ color: tier.color, mb: 2 }}>
                        {tier.icon}
                      </Box>
                      <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
                        {tier.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {tier.range}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {tier.benefits.map((benefit, i) => (
                          <Chip
                            key={i}
                            label={benefit}
                            size="small"
                            sx={{ m: 0.5, backgroundColor: 'rgba(0,0,0,0.05)' }}
                          />
                        ))}
                      </Box>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Available Rewards */}
          <Box>
            <Typography
              variant="overline"
              sx={{ color: '#1366ba', fontWeight: 700, letterSpacing: 4, fontSize: '0.68rem' }}
            >
              Quà tặng
            </Typography>
            <Typography variant="h5" fontWeight={700} color="text.primary" mt={0.5} mb={4}>
              Danh Sách Phần Thưởng
            </Typography>

            <Grid container spacing={3}>
              {rewards.map((reward, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Zoom in timeout={900 + idx * 100}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        border: '1px solid rgba(0,0,0,0.07)',
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'translateY(-4px)' },
                      }}
                    >
                      <Box sx={{ color: '#1366ba' }}>
                        {reward.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight={600} color="text.primary">
                          {reward.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {reward.points} điểm
                        </Typography>
                      </Box>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </PowerGymLayout>
  );
};

export default Rewards;