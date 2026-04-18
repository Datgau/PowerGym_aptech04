import { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Tooltip, Chip, Skeleton } from '@mui/material';
import { CalendarToday, AccessTime, CheckCircle, Block } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersDay, type PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import { BOOKING_SLOTS, formatDateVi, getTrainerDailySchedule, type TimeSlotOption } from '../../services/newBookingService';
import { getTrainerBookedSlots } from '../../services/serviceRegistrationService';
import type { ServiceItem } from '../../@type/powergym';
import { ACCENT, DARK } from '../../until/constants.ts';

interface ScheduleStepProps {
    service: ServiceItem;
    /** Selected trainer id — when provided, working hours and booked slots are fetched */
    trainerId?: number | null;
    startDate: Dayjs | null;
    onDateChange: (date: Dayjs | null) => void;
    endDate: string;
    minDate: Dayjs;
    selectedSlot: TimeSlotOption | null;
    onSlotSelect: (slot: TimeSlotOption | null) => void;
    /** @deprecated pass trainerId instead; kept for backward compat */
    bookedTimes?: Set<string>;
    bookedDates?: Set<string>;
    onMonthChange?: (month: Dayjs) => void;
}

export default function ScheduleStep({
    service, trainerId, startDate, onDateChange, endDate, minDate,
    selectedSlot, onSlotSelect,
    bookedTimes: externalBookedTimes = new Set(),
    bookedDates = new Set(),
    onMonthChange,
}: ScheduleStepProps) {

    // ── Trainer-aware slot state ──────────────────────────────────────────────
    const [bookedSlots, setBookedSlots]       = useState<Set<string>>(new Set());
    const [unavailableSlots, setUnavailableSlots] = useState<Set<string>>(new Set());
    const [loadingSlots, setLoadingSlots]     = useState(false);

    const fetchSlotsForDate = useCallback(async (date: Dayjs) => {
        if (!trainerId) {
            // No trainer selected — fall back to externally provided bookedTimes
            setBookedSlots(externalBookedTimes);
            setUnavailableSlots(new Set());
            return;
        }

        setLoadingSlots(true);
        try {
            const dateStr = date.format('YYYY-MM-DD');

            // Fetch booked slots and working hours in parallel
            const [bookedRes, scheduleRes] = await Promise.allSettled([
                getTrainerBookedSlots(trainerId, dateStr),
                getTrainerDailySchedule(trainerId, dateStr),
            ]);

            // Booked slots: "HH:mm-HH:mm" strings
            const booked = new Set<string>();
            if (bookedRes.status === 'fulfilled' && bookedRes.value.success && bookedRes.value.data?.bookedSlots) {
                for (const s of bookedRes.value.data.bookedSlots) {
                    const [start] = s.split('-');
                    booked.add(start);
                }
            }
            setBookedSlots(booked);

            // Unavailable slots: those outside working hours
            const unavailable = new Set<string>();
            if (scheduleRes.status === 'fulfilled' && scheduleRes.value.success && scheduleRes.value.data?.dailySlots) {
                const dailySlots = scheduleRes.value.data.dailySlots;
                // Only restrict slots if trainer HAS configured working hours.
                // Empty dailySlots means no schedule configured → allow all (same as backend logic).
                if (dailySlots.length > 0) {
                    const availableStarts = new Set(
                        dailySlots
                            .filter((s: any) => s.status === 'AVAILABLE')
                            .map((s: any) => (s.startTime as string).substring(0, 5))
                    );
                    for (const slot of BOOKING_SLOTS) {
                        if (!availableStarts.has(slot.startTime)) {
                            unavailable.add(slot.startTime);
                        }
                    }
                }
            }
            setUnavailableSlots(unavailable);
        } catch {
            setBookedSlots(new Set());
            setUnavailableSlots(new Set());
        } finally {
            setLoadingSlots(false);
        }
    }, [trainerId, externalBookedTimes]);

    // Re-fetch whenever date or trainer changes
    useEffect(() => {
        if (startDate) fetchSlotsForDate(startDate);
        else {
            setBookedSlots(new Set());
            setUnavailableSlots(new Set());
        }
    }, [startDate, trainerId, fetchSlotsForDate]);

    // ── Calendar custom day ───────────────────────────────────────────────────
    const CustomDay = (props: PickersDayProps) => {
        const day = props.day as Dayjs;
        const dateStr = day.format('YYYY-MM-DD');
        const hasBooking = bookedDates.has(dateStr);
        return (
            <PickersDay
                {...props}
                sx={{
                    ...(hasBooking && {
                        backgroundColor: `${ACCENT}30`,
                        fontWeight: 600,
                        '&:hover': { backgroundColor: `${ACCENT}50` },
                        '&.Mui-selected': {
                            backgroundColor: ACCENT,
                            '&:hover': { backgroundColor: ACCENT },
                        },
                    }),
                }}
            />
        );
    };

    // ── Slot status helpers ───────────────────────────────────────────────────
    const isBooked       = (slot: TimeSlotOption) => bookedSlots.has(slot.startTime);
    const isUnavailable  = (slot: TimeSlotOption) => !isBooked(slot) && unavailableSlots.has(slot.startTime);
    const isDisabled     = (slot: TimeSlotOption) => isBooked(slot) || isUnavailable(slot);
    const isSelected     = (slot: TimeSlotOption) => selectedSlot?.startTime === slot.startTime;

    const slotBorder = (slot: TimeSlotOption) => {
        if (isSelected(slot))    return `2px solid ${ACCENT}`;
        if (isBooked(slot))      return '1.5px solid #fca5a5';
        if (isUnavailable(slot)) return '1.5px solid #fca5a5';
        return '1.5px solid #e5e7eb';
    };
    const slotBg = (slot: TimeSlotOption) => {
        if (isSelected(slot))    return `${ACCENT}15`;
        if (isBooked(slot))      return '#fef2f2';
        if (isUnavailable(slot)) return '#fef2f2';
        return '#fff';
    };
    const slotColor = (slot: TimeSlotOption) => {
        if (isSelected(slot))    return DARK;
        if (isDisabled(slot))    return '#ef4444';
        return '#374151';
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <Box sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>

                {/* ── Date picker ── */}
                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <CalendarToday sx={{ color: ACCENT, fontSize: 18 }} />
                        <Typography fontWeight={700} fontSize="0.9rem" color="#1a1a2e">
                            Select Start Date
                        </Typography>
                    </Box>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticDatePicker
                            displayStaticWrapperAs="desktop"
                            value={startDate}
                            onChange={onDateChange}
                            onMonthChange={onMonthChange}
                            minDate={minDate}
                            slots={{ day: CustomDay }}
                            sx={{
                                '& .MuiPickersDay-root.Mui-selected': {
                                    background: ACCENT, fontWeight: 800,
                                    '&:hover': { backgroundColor: ACCENT },
                                },
                                '& .MuiPickersDay-root:hover': { background: `${ACCENT}20` },
                                background: '#fff', borderRadius: '12px',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                border: '1.5px solid rgba(0,0,0,0.07)',
                            }}
                        />
                    </LocalizationProvider>

                    {/* Legend */}
                    <Box sx={{
                        mt: 1.5, p: 1.5, borderRadius: '10px',
                        background: '#f8f9fa', border: '1px solid rgba(0,0,0,0.08)',
                    }}>
                        <Typography fontSize="0.75rem" fontWeight={600} color={DARK} mb={0.8}>
                            Legend:
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{
                                    width: 20, height: 20, borderRadius: '4px',
                                    background: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)',
                                    border: '2px solid #00acc1',
                                }} />
                                <Typography fontSize="0.7rem" color="#666">Date with booked schedule</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{
                                    width: 20, height: 20, borderRadius: '4px',
                                    background: '#fef2f2', border: '1.5px solid #fca5a5',
                                }} />
                                <Typography fontSize="0.7rem" color="#666">Booked / Outside working hours</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {startDate && endDate && (
                        <Box sx={{
                            mt: 1.5, p: 1.5, borderRadius: '10px',
                            background: 'linear-gradient(135deg, #f0fbff, #e6f6ff)',
                            border: '1px solid rgba(0,180,255,0.2)',
                        }}>
                            <Typography fontSize="0.78rem" fontWeight={600} color={DARK}>
                                📅 Plan duration: <strong>{service.duration} days</strong>
                            </Typography>
                            <Typography fontSize="0.74rem" color="#555" mt={0.3}>
                                Start: <strong>{formatDateVi(startDate.format('YYYY-MM-DD'))}</strong>
                            </Typography>
                            <Typography fontSize="0.74rem" color="#555">
                                End: <strong>{formatDateVi(endDate)}</strong>
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* ── Time slots ── */}
                <Box sx={{ flex: '1 1 240px', minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <AccessTime sx={{ color: ACCENT, fontSize: 18 }} />
                        <Typography fontWeight={700} fontSize="0.9rem" color="#1a1a2e">
                            Select Time Slot
                        </Typography>
                    </Box>

                    {!startDate ? (
                        <Box sx={{
                            p: 3, textAlign: 'center', color: '#aaa', borderRadius: '12px',
                            border: '1.5px dashed #d1d5db', background: '#fafafa',
                        }}>
                            <CalendarToday sx={{ fontSize: 36, mb: 1, opacity: 0.3 }} />
                            <Typography fontSize="0.82rem">Please select a date first</Typography>
                        </Box>
                    ) : loadingSlots ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {Array.from({ length: 8 }, (_, i) => (
                                <Skeleton key={i} variant="rounded" width={100} height={36} sx={{ borderRadius: '8px' }} />
                            ))}
                        </Box>
                    ) : (
                        <>
                            {/* No working hours warning — only show when trainer has schedule configured but day is fully blocked */}
                            {unavailableSlots.size === BOOKING_SLOTS.length && unavailableSlots.size > 0 && (
                                <Box sx={{
                                    p: 2, mb: 1.5, borderRadius: 2,
                                    background: '#fff3e0', border: '1px solid #ffb74d',
                                    display: 'flex', alignItems: 'center', gap: 1,
                                }}>
                                    <Block sx={{ color: '#f57c00', fontSize: 18 }} />
                                    <Typography fontSize="0.8rem" color="#e65100" fontWeight={600}>
                                        Trainer is not available on this day. Please select another date.
                                    </Typography>
                                </Box>
                            )}
                            {/* Legend for slots */}
                            <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: 1, background: '#fef2f2', border: '1px solid #fca5a5' }} />
                                    <Typography fontSize="0.68rem" color="#666">Booked / Unavailable</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: 1, background: `${ACCENT}15`, border: `1px solid ${ACCENT}` }} />
                                    <Typography fontSize="0.68rem" color="#666">Selected</Typography>
                                </Box>
                            </Box>

                            <Box sx={{
                                display: 'flex', flexWrap: 'wrap', gap: 1,
                                maxHeight: 340, overflow: 'auto',
                                '&::-webkit-scrollbar': { width: 4 },
                                '&::-webkit-scrollbar-thumb': { background: ACCENT, borderRadius: 2 },
                            }}>
                                {BOOKING_SLOTS.map(slot => {
                                    const disabled = isDisabled(slot);
                                    const selected = isSelected(slot);
                                    const tooltipTitle = isBooked(slot)
                                        ? 'This time slot is already booked'
                                        : isUnavailable(slot)
                                        ? 'Outside trainer working hours'
                                        : '';

                                    return (
                                        <Tooltip key={slot.startTime} title={tooltipTitle} placement="top">
                                            <Chip
                                                label={`${slot.startTime} – ${slot.endTime}`}
                                                onClick={() => !disabled && onSlotSelect(selected ? null : slot)}
                                                icon={
                                                    selected ? <CheckCircle sx={{ fontSize: '14px !important' }} />
                                                    : disabled ? <Block sx={{ fontSize: '14px !important' }} />
                                                    : <AccessTime sx={{ fontSize: '14px !important' }} />
                                                }
                                                sx={{
                                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                                    fontWeight: selected ? 700 : 500,
                                                    fontSize: '0.75rem',
                                                    border: slotBorder(slot),
                                                    background: slotBg(slot),
                                                    color: slotColor(slot),
                                                    opacity: disabled ? 0.65 : 1,
                                                    transition: 'all 0.18s',
                                                    '& .MuiChip-icon': {
                                                        color: selected ? ACCENT
                                                            : disabled ? '#ef4444'
                                                            : '#94a3b8',
                                                    },
                                                    '&:hover': disabled ? {} : {
                                                        borderColor: ACCENT,
                                                        background: `${ACCENT}10`,
                                                        transform: 'translateY(-1px)',
                                                    },
                                                }}
                                            />
                                        </Tooltip>
                                    );
                                })}
                            </Box>

                            {/* Selected summary */}
                            {selectedSlot && (
                                <Box sx={{
                                    mt: 2, p: 1.5, background: '#f0f7ff', borderRadius: 2,
                                    border: `1px solid ${ACCENT}33`,
                                    display: 'flex', alignItems: 'center', gap: 1,
                                }}>
                                    <CheckCircle sx={{ color: ACCENT, fontSize: 18 }} />
                                    <Typography fontSize="0.8rem" fontWeight={600} color={DARK}>
                                        Selected: {startDate?.format('ddd D/M')} · {selectedSlot.startTime} – {selectedSlot.endTime}
                                    </Typography>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
