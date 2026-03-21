import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Stack,
    Zoom,
    Snackbar,
    Alert
} from '@mui/material';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout.tsx';
import PaymentPackageCard from './PaymentPackageCard.tsx';
import MoMoPaymentModal from '../../components/Payment/MoMoPaymentModal.tsx';
import TablePagination from '../../components/Common/TablePagination.tsx';
import { useMembershipPaginated } from '../../hooks/useMembershipPaginated.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import type { MoMoPaymentResponse } from '../../services/paymentService';

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const Pricing: React.FC = () => {
    const { 
        packages, 
        loading, 
        registerPackage, 
        paginationState,
        handleChangePage,
        handleChangeRowsPerPage
    } = useMembershipPaginated(8);
    const { requireAuth } = useAuth();
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning',
    });

    const handlePackageSelect = async (packageId: string): Promise<void> => {
        if (!requireAuth()) return;

        try {
            const success = await registerPackage(packageId, 'CARD');

            if (success) {
                setSnackbar({
                    open: true,
                    message: 'Package registered successfully! Please confirm at the service desk.',
                    severity: 'success'
                });
            } else {
                setSnackbar({
                    open: true,
                    message: 'Package registration failed. Please try again.',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('Package registration error:', error);
            setSnackbar({
                open: true,
                message: 'An error occurred while registering the package.',
                severity: 'error'
            });
        }
    };
    const handlePayNow = (pkg: any) => {
        if (!requireAuth()) return;
        setSelectedPackage(pkg);
        setPaymentModalOpen(true);
    };

    const handlePaymentSuccess = (response: MoMoPaymentResponse) => {
        setSnackbar({
            open: true,
            message: `Payment successful! Order ID: ${response.orderId}`,
            severity: 'success'
        });
        setPaymentModalOpen(false);
        setSelectedPackage(null);
    };

    // Convert packages to format expected by PackageCard
    const availablePackages = packages.map(pkg => ({
        id: pkg.packageId,
        name: pkg.name,
        duration: `${pkg.duration} days`,
        price: `$${pkg.price.toLocaleString('en-US')}`,
        originalPrice: pkg.originalPrice
            ? `$${pkg.originalPrice.toLocaleString('en-US')}`
            : undefined,
        features: pkg.features,
        isPopular: pkg.isPopular,
        color: pkg.color || (pkg.isPopular ? '#FF4444' : '#155e9a'),
        description: pkg.description
    }));

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
                            Membership Pricing
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
                            Choose the training plan that fits your goals — from beginner to advanced,
                            every fitness journey starts here.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* ── Packages Section ── */}
            <Box sx={{ background: '#f4f6f9', py: { xs: 6, md: 9 } }}>
                <Container maxWidth="xl">
                    {/* Section header */}
                    <Stack direction="row" alignItems="flex-end" justifyContent="space-between" mb={5}>
                        <Box>
                            <Typography
                                variant="overline"
                                sx={{ color: '#1366ba', fontWeight: 700, letterSpacing: 4, fontSize: '0.68rem' }}
                            >
                                Membership Package
                            </Typography>
                            <Typography variant="h5" fontWeight={700} color="text.primary" mt={0.5}>
                                {paginationState.totalElements} Package{paginationState.totalElements !== 1 ? 's' : ''} Available
                            </Typography>
                        </Box>
                    </Stack>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: { xs: 3, md: 4 },
                        }}
                    >
                        {availablePackages.map((pkg, index) => (
                            <Zoom in timeout={500 + index * 100} key={pkg.id}>
                                <Box
                                    sx={{
                                        flex: {
                                            xs: '1 1 100%',
                                            sm: '1 1 calc(50% - 16px)',
                                            lg: '1 1 calc(33.333% - 22px)',
                                            xl: '1 1 calc(25% - 24px)',
                                        },
                                        maxWidth: {
                                            xs: '100%',
                                            sm: 'calc(50% - 16px)',
                                            lg: 'calc(33.333% - 22px)',
                                            xl: 'calc(25% - 24px)',
                                        },
                                        minWidth: 260,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-6px)',
                                            zIndex: 2,
                                        },
                                        // Popular badge glow
                                        ...(pkg.isPopular && {
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                inset: -2,
                                                borderRadius: '16px',
                                                background: BRAND_GRADIENT,
                                                zIndex: 0,
                                                opacity: 0.35,
                                                filter: 'blur(8px)',
                                            },
                                        }),
                                        '& > *': { position: 'relative', zIndex: 1, height: '100%' },
                                    }}
                                >
                                    <PaymentPackageCard
                                        package={pkg}
                                        onSelect={() => handlePackageSelect(pkg.id)}
                                        onPayNow={() => handlePayNow(pkg)}
                                        processing={false}
                                    />
                                </Box>
                            </Zoom>
                        ))}
                    </Box>

                    {availablePackages.length === 0 && !loading && (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" color="text.secondary">
                                No data
                            </Typography>
                        </Box>
                    )}

                    {/* Pagination */}
                    {paginationState.totalElements > paginationState.rowsPerPage && (
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            mt: 6,

                        }}>
                            <TablePagination
                                count={paginationState.totalElements}
                                page={paginationState.page}
                                rowsPerPage={paginationState.rowsPerPage}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[8, 16, 24, 32]}
                                labelRowsPerPage="Packages per page:"
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} packages`
                                }
                            />
                        </Box>
                    )}
                </Container>
            </Box>

            <MoMoPaymentModal
                open={paymentModalOpen}
                onClose={() => {
                    setPaymentModalOpen(false);
                    setSelectedPackage(null);
                }}
                onSuccess={handlePaymentSuccess}
                defaultAmount={selectedPackage ? parseInt(selectedPackage.price.replace(/[^\d]/g, '')) : 0}
                defaultOrderInfo={selectedPackage ? `Thanh toán PowerGym - Gói thành viên: ${selectedPackage.name}` : ''}
                itemType="MEMBERSHIP"
                itemId={selectedPackage?.id}
                itemName={selectedPackage?.name}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
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

export default Pricing;