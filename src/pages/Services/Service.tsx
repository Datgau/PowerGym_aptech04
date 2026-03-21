import React, { useState } from 'react';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout.tsx';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    Container,
    Chip,
    Stack,
    Divider
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PaymentIcon from '@mui/icons-material/Payment';
import { useGymServicesPaginated} from "../../hooks/useGymServices.ts";
import ServiceDetailModal from "./ServiceDetailModal.tsx";
import MoMoPaymentModal from '../../components/Payment/MoMoPaymentModal.tsx';
import TablePagination from '../../components/Common/TablePagination.tsx';
import { registerService } from '../../services/serviceRegistrationService';
import { useAuth } from "../../hooks/useAuth.ts";
import type { MoMoPaymentResponse } from '../../services/paymentService';
import RichTextDisplay from "../../components/Common/RichTextDisplay.tsx";

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const Service: React.FC = () => {
  const { 
    services, 
    loading, 
    error, 
    currentPage, 
    totalElements,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage
  } = useGymServicesPaginated(6);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [registering, setRegistering] = useState<number | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedServiceForPayment, setSelectedServiceForPayment] = useState<any>(null);
  const { requireAuth } = useAuth();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning',
  });
  const getServiceImage = (service: any) =>
      service.images?.[0] || '/images/default-service.jpg';
    const handleRegister = async (serviceId: number) => {
        if (!requireAuth()) return;
        try {
            setRegistering(serviceId);
            const response = await registerService({ serviceId });

            if (response.success) {
                setSnackbar({
                    open: true,
                    message: 'Registration successful! The admin will be notified.',
                    severity: 'success'
                });
            }
        } catch (err: any) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Registration failed',
                severity: 'error'
            });
        } finally {
            setRegistering(null);
        }
    };

    const handlePayNow = (service: any) => {
        if (!requireAuth()) return;
        setSelectedServiceForPayment(service);
        setPaymentModalOpen(true);
    };

    const handlePaymentSuccess = (response: MoMoPaymentResponse) => {
        setSnackbar({
            open: true,
            message: `Payment successful! Order ID: ${response.orderId}`,
            severity: 'success'
        });
        setPaymentModalOpen(false);
        setSelectedServiceForPayment(null);
    };

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
                Our Services
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
                  Choose the training package that fits your goals — from beginner to advanced, every fitness journey starts here.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* ── Cards Section ── */}
        <Box sx={{ background: '#f4f6f9', py: { xs: 6, md: 9 } }}>
          <Container maxWidth="xl">

            {/* Section header */}
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between" mb={5}>
              <Box>
                <Typography
                    variant="overline"
                    sx={{ color: '#1366ba', fontWeight: 700, letterSpacing: 4, fontSize: '0.68rem' }}
                >
                    Service Categories
                </Typography>
                  <Typography variant="h5" fontWeight={700} color="text.primary" mt={0.5}>
                      {totalElements} Available Services
                  </Typography>
              </Box>
            </Stack>

            {/* Grid */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress size={60} />
              </Box>
            ) : error ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="error" mb={2}>
                  {error}
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => window.location.reload()}
                  sx={{ borderRadius: 2 }}
                >
                  Retry
                </Button>
              </Box>
            ) : services.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No services available at the moment.
                </Typography>
              </Box>
            ) : (
              <>
                <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(3,1fr)' },
                      gap: 3,
                    }}
                >
              {services.map((service, idx) => (
                  <Card
                      key={service.id}
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'rgba(0,0,0,0.07)',
                        display: 'flex',
                        flexDirection: 'column',
                        opacity: service.isActive ? 1 : 0.5,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        animationName: 'fadeUp',
                        animationDuration: '0.5s',
                        animationFillMode: 'both',
                        animationDelay: `${idx * 0.07}s`,
                        '@keyframes fadeUp': {
                          from: { opacity: 0, transform: 'translateY(24px)' },
                          to: { opacity: 1, transform: 'translateY(0)' },
                        },
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: '0 20px 48px rgba(0,0,0,0.12)',
                        },
                      }}
                  >
                    {/* Image */}
                    <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
                      <CardMedia
                          component="img"
                          image={getServiceImage(service)}
                          alt={service.name}
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
                          label={typeof service.category === 'object' ? service.category.displayName || service.category.name : service.category}
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
                      {!service.isActive && (
                          <Chip
                              label="Disable"
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
                        {service.name}
                      </Typography>

                        <Typography variant="body2" component="div" color="text.secondary" sx={{ lineHeight: 1.75, flex: 1 }}>
                            <RichTextDisplay
                                content={
                                    service.description.length > 100
                                        ? service.description.slice(0, 100) + '…'
                                        : service.description
                                }
                            />
                        </Typography>

                      <Divider sx={{ my: 2 }} />

                      {/* Price & Duration */}
                        <Stack direction="row" spacing={2.5} mb={3}>
                            {/* Price */}
                            <Box
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    p: 1.5,
                                    borderRadius: 2,
                                    background: 'rgba(4, 86, 104, 0.05)',
                                    border: '1px solid rgba(4, 86, 104, 0.1)',
                                    transition: 'all .25s ease',
                                    '&:hover': {
                                        background: 'rgba(4, 86, 104, 0.1)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        background: 'rgba(4, 86, 104, 0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <AttachMoneyIcon sx={{ fontSize: 20, color: '#02cbf8' }} />
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary" lineHeight={1}>
                                        Price
                                    </Typography>
                                    <Typography variant="inherit" fontWeight={500} lineHeight={1}>
                                        ${service.price.toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Duration */}
                            <Box
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    p: 1.5,
                                    borderRadius: 2,
                                    background: 'rgba(4, 86, 104, 0.05)',
                                    border: '1px solid rgba(4, 86, 104, 0.1)',
                                    transition: 'all .25s ease',
                                    '&:hover': {
                                        background: 'rgba(4, 86, 104, 0.1)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        background: 'rgba(4,86,104,0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <AccessTimeIcon sx={{ fontSize: 20, color: '#02cbf8' }} />
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary" lineHeight={1}>
                                        Duration
                                    </Typography>
                                    <Typography variant="inherit" fontWeight={500} lineHeight={1}>
                                        {service.duration} days
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>

                      {/* Buttons */}
                      <Stack direction="column" spacing={1.5}>
                        <Stack direction="row" spacing={1.5}>
                          <Button
                              fullWidth
                              variant="outlined"
                              onClick={() => setSelectedService(service)}
                              sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.82rem',
                                borderColor: 'rgba(0,0,0,0.18)',
                                color: 'text.primary',
                                '&:hover': {
                                  borderColor: '#1366ba',
                                  color: '#1366ba',
                                  background: 'rgba(19,102,186,0.05)',
                                },
                              }}
                          >
                            Detail
                          </Button>
                          <Button
                              fullWidth
                              variant="contained"
                              disabled={!service.isActive || registering === service.id}
                              endIcon={registering !== service.id && <ArrowForwardIcon fontSize="small" />}
                              onClick={() => handleRegister(service.id)}
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
                            {registering === service.id
                                ? <CircularProgress size={20} sx={{ color: '#fff' }} />
                                : 'Sign up directly'}
                          </Button>
                        </Stack>
                        
                        {/* Payment Button */}
                        <Button
                            fullWidth
                            variant="contained"
                            disabled={!service.isActive}
                            startIcon={<PaymentIcon fontSize="small" />}
                            onClick={() => handlePayNow(service)}
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              background: 'linear-gradient(135deg, #d82d8b, #a4036f)',
                              boxShadow: '0 4px 16px rgba(216,45,139,0.3)',
                              '&:hover': {
                                boxShadow: '0 8px 24px rgba(216,45,139,0.45)',
                                background: 'linear-gradient(135deg, #c02a7f, #8f0362)',
                              },
                              '&.Mui-disabled': {
                                background: '#ccc',
                                boxShadow: 'none',
                              },
                            }}
                        >
                          Payment Method Momo
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
              ))}
            </Box>

            {/* Pagination */}
            {totalElements > rowsPerPage && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 6,

              }}>
                <TablePagination
                  count={totalElements}
                  page={currentPage}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[6, 12, 18, 24]}
                  labelRowsPerPage="Services per page:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} services`
                  }
                />
              </Box>
            )}
          </>
        )}
          </Container>
        </Box>

        <ServiceDetailModal
            open={Boolean(selectedService)}
            service={selectedService}
            onClose={() => setSelectedService(null)}
        />

        <MoMoPaymentModal
            open={paymentModalOpen}
            onClose={() => {
              setPaymentModalOpen(false);
              setSelectedServiceForPayment(null);
            }}
            onSuccess={handlePaymentSuccess}
            defaultAmount={selectedServiceForPayment?.price || 0}
            defaultOrderInfo={selectedServiceForPayment ? `Thanh toán PowerGym - Dịch vụ: ${selectedServiceForPayment.name}` : ''}
            itemType="SERVICE"
            itemId={selectedServiceForPayment?.id?.toString()}
            itemName={selectedServiceForPayment?.name}
        />

        <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
              severity={snackbar.severity}
              variant="filled"
              onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </PowerGymLayout>
  );
};

export default Service;