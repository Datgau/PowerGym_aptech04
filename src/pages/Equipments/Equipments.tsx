import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Zoom
} from '@mui/material';
import { AttachMoney } from '@mui/icons-material';
import { PowerGymLayout } from "../../components/PowerGym";
import { useEquipments, useEquipmentCategories } from '../../hooks/useEquipments';
import type { Equipment } from '../../services/equipmentService';

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const Equipments: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const { equipments, loading: equipmentsLoading, error: equipmentsError } = useEquipments(true, selectedCategoryId);
  const { categories, loading: categoriesLoading } = useEquipmentCategories(true);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getEquipmentImage = (equipment: Equipment) =>
    equipment.image || '/images/default-equipment.jpg';

  if (equipmentsLoading || categoriesLoading) {
    return (
      <PowerGymLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </PowerGymLayout>
    );
  }

  if (equipmentsError) {
    return (
      <PowerGymLayout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="error">
            Error occurred: {equipmentsError}
          </Typography>
        </Box>
      </PowerGymLayout>
    );
  }

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
              Gym Equipment
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
              Discover high-quality gym equipment — from modern cardio machines
              to professional training tools.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ── Equipments Section ── */}
      <Box sx={{ background: '#f4f6f9', py: { xs: 6, md: 9 } }}>
        <Container maxWidth="xl">
          {/* Section header */}
          <Stack direction="row" alignItems="flex-end" justifyContent="space-between" mb={4}>
            <Box>
              <Typography
                variant="overline"
                sx={{ color: '#1366ba', fontWeight: 700, letterSpacing: 4, fontSize: '0.68rem' }}
              >
                Training Equipment
              </Typography>
              <Typography variant="h5" fontWeight={700} color="text.primary" mt={0.5}>
                {equipments.length} Equipment Available
              </Typography>
            </Box>
          </Stack>

          {/* Category Filter */}
          <Box sx={{ mb: 5 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label="All"
                onClick={() => setSelectedCategoryId(undefined)}
                color={selectedCategoryId === undefined ? 'primary' : 'default'}
                variant={selectedCategoryId === undefined ? 'filled' : 'outlined'}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  '&.MuiChip-filled': {
                    background: BRAND_GRADIENT,
                  },
                }}
              />
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  onClick={() => setSelectedCategoryId(category.id)}
                  color={selectedCategoryId === category.id ? 'primary' : 'default'}
                  variant={selectedCategoryId === category.id ? 'filled' : 'outlined'}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    '&.MuiChip-filled': {
                      background: BRAND_GRADIENT,
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Equipments Grid */}
          {equipments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" mb={2}>
                {selectedCategoryId 
                  ? 'No equipment available in this category.' 
                  : 'No equipment available.'}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {selectedCategoryId 
                  ? 'Try selecting a different category or check back later.'
                  : 'Equipment data is being loaded or no equipment has been added yet.'}
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => window.location.reload()}
                sx={{ borderRadius: 2 }}
              >
                Refresh Page
              </Button>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                lg: 'repeat(3, 1fr)' 
              }, 
              gap: 3 
            }}>
              {equipments.map((equipment, idx) => (
                <Box key={equipment.id}>
                  <Zoom in timeout={500 + idx * 100}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'rgba(0,0,0,0.07)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        opacity: equipment.isActive ? 1 : 0.6,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: '0 20px 48px rgba(0,0,0,0.12)',
                        },
                      }}
                    >
                      {/* Image */}
                      <Box sx={{ position: 'relative', height: 200 }}>
                        <CardMedia
                          component="img"
                          image={getEquipmentImage(equipment)}
                          alt={equipment.name}
                          sx={{
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            '&:hover': { transform: 'scale(1.06)' },
                          }}
                        />
                        <Box sx={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.45) 100%)',
                        }} />
                        <Chip
                          label={equipment.category.name}
                          size="small"
                          sx={{
                            position: 'absolute', top: 12, left: 12,
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(8px)',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.68rem',
                            letterSpacing: 1,
                            border: '1px solid rgba(255,255,255,0.25)',
                            textTransform: 'uppercase',
                          }}
                        />
                        {!equipment.isActive && (
                          <Chip
                            label="Inactive"
                            size="small"
                            sx={{
                              position: 'absolute', top: 12, right: 12,
                              background: 'rgba(220,38,38,0.85)',
                              color: '#fff', fontWeight: 600, fontSize: '0.68rem',
                            }}
                          />
                        )}
                      </Box>

                      {/* Content */}
                      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
                          {equipment.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.75, flex: 1, mb: 2 }}
                        >
                          {equipment.description && equipment.description.length > 100
                            ? equipment.description.slice(0, 100) + '…'
                            : equipment.description || 'No description available'}
                        </Typography>

                        {/* Price and Quantity */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <AttachMoney sx={{ fontSize: 18, color: '#045668' }} />
                            <Typography variant="h6" fontWeight={700} color="text.primary">
                              {formatPrice(equipment.price)}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            Qty: {equipment.quantity}
                          </Typography>
                        </Stack>

                        <Button
                          fullWidth
                          variant="contained"
                          disabled={!equipment.isActive}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            background: BRAND_GRADIENT,
                            boxShadow: '0 4px 16px rgba(4,86,104,0.3)',
                            '&:hover': {
                              boxShadow: '0 8px 24px rgba(4,86,104,0.45)',
                              background: BRAND_GRADIENT,
                            },
                            '&.Mui-disabled': {
                              background: '#ccc',
                              boxShadow: 'none',
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </PowerGymLayout>
  );
};

export default Equipments;