import { useState } from 'react';
import { Box, Typography, Alert, Divider, TextField, Button, CircularProgress, Chip } from '@mui/material';
import { FitnessCenter, Person, CalendarToday, AccessTime, LocalOffer, Check } from '@mui/icons-material';
import type { TrainerSpecialtyItem, TimeSlotOption } from '../../services/newBookingService';
import type { ServiceItem } from '../../@type/powergym';
import { formatDateVi } from '../../services/newBookingService';
import { BRAND, ACCENT, DARK } from '../../until/constants.ts';
import promotionService from '../../services/promotionService';
import type { ApplyPromotionResponse } from '../../@type/reward';

interface ConfirmStepProps {
    service: ServiceItem;
    trainer: TrainerSpecialtyItem | null;
    startDate: Date | null;
    endDate: string;
    slot: TimeSlotOption | null;
    onPromotionApplied?: (promotionData: ApplyPromotionResponse | null) => void;
}

export default function ConfirmStep({ service, trainer, startDate, endDate, slot, onPromotionApplied }: ConfirmStepProps) {
    const [promotionCode, setPromotionCode] = useState('');
    const [applyingPromotion, setApplyingPromotion] = useState(false);
    const [promotionData, setPromotionData] = useState<ApplyPromotionResponse | null>(null);
    const [promotionError, setPromotionError] = useState('');

    const handleApplyPromotion = async () => {
        if (!promotionCode.trim()) {
            setPromotionError('Please enter a promotion code');
            return;
        }

        setApplyingPromotion(true);
        setPromotionError('');

        try {
            console.log('[ConfirmStep] Applying promotion:', {
                code: promotionCode.trim().toUpperCase(),
                orderAmount: service?.price || 0,
                serviceName: service?.name
            });

            const response = await promotionService.applyPromotion({
                promotionCode: promotionCode.trim().toUpperCase(),
                orderAmount: service?.price || 0
            });

            console.log('[ConfirmStep] Promotion response:', response);

            if (response.success) {
                setPromotionData(response);
                onPromotionApplied?.(response);
            } else {
                let errorMsg = response.message || 'Invalid promotion code';
                if (response.debugInfo) {
                    if (process.env.NODE_ENV === 'development') {
                        errorMsg += `\n\nDebug Info:\n${JSON.stringify(response.debugInfo, null, 2)}`;
                    }
                }
                setPromotionError(errorMsg);
                setPromotionData(null);
                onPromotionApplied?.(null);
            }
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || 'Failed to apply promotion code';
            setPromotionError(errorMsg);
            setPromotionData(null);
            onPromotionApplied?.(null);
        } finally {
            setApplyingPromotion(false);
        }
    };

    const handleRemovePromotion = () => {
        setPromotionCode('');
        setPromotionData(null);
        setPromotionError('');
        onPromotionApplied?.(null);
    };

    const originalPrice = service?.price || 0;
    const discountAmount = promotionData?.discountAmount || 0;
    const finalPrice = promotionData?.finalAmount || originalPrice;
    const rows = [
        {
            icon: <FitnessCenter />,
            label: 'Service Plan',
            value: service?.name,
        },
        {
            icon: <Person />,
            label: 'Trainer',
            value: trainer?.fullName ?? '⚠️ Not selected — Admin will assign',
        },
        {
            icon: <CalendarToday />,
            label: 'Start Date',
            value: startDate ? formatDateVi(startDate.toISOString().split('T')[0]) : '—',
        },
        {
            icon: <CalendarToday />,
            label: 'End Date',
            value: endDate ? formatDateVi(endDate) : '—',
        },
        {
            icon: <AccessTime />,
            label: 'Time Slot',
            value: slot ? `${slot.startTime} – ${slot.endTime}` : '—',
        },
    ];

    return (
        <Box sx={{ p: 2.5 }}>
            <Alert severity="success" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.82rem' }}>
                Please review the information below. After confirming, you will proceed to <strong>payment</strong>.
                The booking is only saved once payment is successful.
            </Alert>

            <Box sx={{
                background: '#fff', borderRadius: '16px',
                border: '1.5px solid rgba(0,180,255,0.15)',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(4,86,104,0.08)',
            }}>
                {/* Card header */}
                <Box sx={{ background: BRAND, px: 2.5, py: 2 }}>
                    <Typography fontWeight={800} color="#fff" fontSize="1rem">
                        Booking Summary
                    </Typography>
                    <Typography fontSize="0.75rem" color="rgba(255,255,255,0.75)">
                        Please review carefully before payment
                    </Typography>
                </Box>

                {/* Info rows */}
                {rows.map((row, i) => (
                    <Box key={i}>
                        <Box sx={{ px: 2.5, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ color: ACCENT, display: 'flex', flexShrink: 0 }}>
                                {row.icon}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    fontSize="0.72rem" color="#888" fontWeight={600}
                                    textTransform="uppercase" letterSpacing={0.5}
                                >
                                    {row.label}
                                </Typography>
                                <Typography fontSize="0.9rem" fontWeight={700} color="#1a1a2e">
                                    {row.value}
                                </Typography>
                            </Box>
                        </Box>
                        {i < rows.length - 1 && <Divider />}
                    </Box>
                ))}

                {/* Promotion Code Section */}
                <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocalOffer sx={{ color: ACCENT, fontSize: 18 }} />
                        <Typography fontSize="0.85rem" fontWeight={700} color={DARK}>
                            Promotion Code
                        </Typography>
                    </Box>

                    {!promotionData ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                size="small"
                                placeholder="Enter code"
                                value={promotionCode}
                                onChange={(e) => setPromotionCode(e.target.value.toUpperCase())}
                                disabled={applyingPromotion}
                                error={!!promotionError}
                                helperText={promotionError}
                                sx={{
                                    flex: 1,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                    },
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleApplyPromotion}
                                disabled={applyingPromotion || !promotionCode.trim()}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: '8px',
                                    background: ACCENT,
                                    minWidth: '80px',
                                    '&:hover': { background: BRAND },
                                }}
                            >
                                {applyingPromotion ? <CircularProgress size={20} color="inherit" /> : 'Apply'}
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1.5,
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                            border: '1px solid #81c784',
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                    icon={<Check sx={{ fontSize: 16 }} />}
                                    label={promotionData.promotionCode}
                                    size="small"
                                    sx={{
                                        background: '#4caf50',
                                        color: '#fff',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                    }}
                                />
                                <Typography fontSize="0.8rem" fontWeight={600} color="#2e7d32">
                                    {promotionData.promotionName}
                                </Typography>
                            </Box>
                            <Button
                                size="small"
                                onClick={handleRemovePromotion}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    color: '#d32f2f',
                                    fontWeight: 600,
                                }}
                            >
                                Remove
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* Price */}
                <Box sx={{
                    px: 2.5, py: 2,
                    background: 'linear-gradient(135deg, #f0fbff, #e6f6ff)',
                    borderTop: '2px solid rgba(0,180,255,0.15)',
                }}>
                    {promotionData && discountAmount > 0 && (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography fontSize="0.85rem" color="#666">Original Price</Typography>
                                <Typography fontSize="0.85rem" color="#666" sx={{ textDecoration: 'line-through' }}>
                                    {originalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography fontSize="0.85rem" color="#4caf50" fontWeight={600}>Discount</Typography>
                                <Typography fontSize="0.85rem" color="#4caf50" fontWeight={700}>
                                    -{discountAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </Typography>
                            </Box>
                        </>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography fontWeight={700} color={DARK}>Total Payment</Typography>
                        <Typography fontWeight={900} fontSize="1.3rem" color={ACCENT}>
                            {finalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Typography fontSize="0.75rem" color="#888" mt={1.5} textAlign="center">
                * The booking will be created automatically after successful payment
            </Typography>
        </Box>
    );
}