import { Box, Typography, Alert, Divider } from '@mui/material';
import { FitnessCenter, Person, CalendarToday, AccessTime } from '@mui/icons-material';
import type { TrainerSpecialtyItem, TimeSlotOption } from '../../services/newBookingService';
import type { ServiceItem } from '../../@type/powergym';
import { formatDateVi } from '../../services/newBookingService';
import { BRAND, ACCENT, DARK } from '../../until/constants.ts';

interface ConfirmStepProps {
    service: ServiceItem;
    trainer: TrainerSpecialtyItem | null;
    startDate: Date | null;
    endDate: string;
    slot: TimeSlotOption | null;
}

export default function ConfirmStep({ service, trainer, startDate, endDate, slot }: ConfirmStepProps) {
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

                {/* Price */}
                <Box sx={{
                    px: 2.5, py: 2,
                    background: 'linear-gradient(135deg, #f0fbff, #e6f6ff)',
                    borderTop: '2px solid rgba(0,180,255,0.15)',
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography fontWeight={700} color={DARK}>Total Payment</Typography>
                        <Typography fontWeight={900} fontSize="1.3rem" color={ACCENT}>
                            {service?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
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