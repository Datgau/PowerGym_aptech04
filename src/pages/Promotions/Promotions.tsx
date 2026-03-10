import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Zoom
} from '@mui/material';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout.tsx';

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const Promotions: React.FC = () => {
  const promotions = [
    {
      id: 1,
      title: 'TET 2024 PROMOTION',
      description: '50% off 6-month package + 1 free month',
      validUntil: '29/02/2024',
      discount: '50%'
    },
    {
      id: 2,
      title: 'STUDENT DISCOUNT',
      description: '30% off all packages for students with valid ID',
      validUntil: '31/12/2024',
      discount: '30%'
    },
    {
      id: 3,
      title: 'GROUP REGISTRATION',
      description: '20% off for group registration of 3 or more people',
      validUntil: '31/03/2024',
      discount: '20%'
    }
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
              Khuyến Mãi Đặc Biệt
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
              Những ưu đãi hấp dẫn dành riêng cho bạn — tiết kiệm chi phí,
              tối đa hóa trải nghiệm tập luyện.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ── Promotions Section ── */}
      <Box sx={{ background: '#f4f6f9', py: { xs: 6, md: 9 } }}>
        <Container maxWidth="xl">
          {/* Section header */}
          <Stack direction="row" alignItems="flex-end" justifyContent="space-between" mb={5}>
            <Box>
              <Typography
                variant="overline"
                sx={{ color: '#1366ba', fontWeight: 700, letterSpacing: 4, fontSize: '0.68rem' }}
              >
                Ưu đại hiện tại
              </Typography>
              <Typography variant="h5" fontWeight={700} color="text.primary" mt={0.5}>
                {promotions.length} Chương Trình Khuyến Mãi
              </Typography>
            </Box>
          </Stack>

          {/* Promotions Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {promotions.map((promotion, idx) => (
              <Zoom in timeout={500 + idx * 100} key={promotion.id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'rgba(0,0,0,0.07)',
                    position: 'relative',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 20px 48px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  {/* Discount Badge */}
                  <Chip
                    label={promotion.discount}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: BRAND_GRADIENT,
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1rem',
                      zIndex: 1,
                    }}
                  />

                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
                      {promotion.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ lineHeight: 1.75, mb: 3 }}
                    >
                      {promotion.description}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Có hiệu lực đến: {promotion.validUntil}
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        background: BRAND_GRADIENT,
                        boxShadow: '0 4px 16px rgba(4,86,104,0.3)',
                        '&:hover': {
                          boxShadow: '0 8px 24px rgba(4,86,104,0.45)',
                          background: BRAND_GRADIENT,
                        },
                      }}
                    >
                      Đăng Ký Ngay
                    </Button>
                  </CardContent>
                </Card>
              </Zoom>
            ))}
          </Box>

          {/* Terms Section */}
          <Box sx={{ mt: 8 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'rgba(0,0,0,0.07)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
                  Điều Khoản & Điều Kiện
                </Typography>
                <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
                  <li>Các chương trình khuyến mãi không thể kết hợp với nhau</li>
                  <li>Giảm giá sinh viên yêu cầu thẻ sinh viên hợp lệ</li>
                  <li>Đăng ký nhóm yêu cầu thanh toán cùng lúc</li>
                  <li>PowerGym có quyền thay đổi điều khoản mà không cần thông báo trước</li>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </PowerGymLayout>
  );
};

export default Promotions;