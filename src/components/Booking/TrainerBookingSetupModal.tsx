import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Dialog, DialogContent, DialogTitle,
    Box, Typography, Button, IconButton,
    Stepper, Step, StepLabel,
} from '@mui/material';
import {
    Close, FitnessCenter, NavigateNext, NavigateBefore, EventAvailable,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import dayjs, { type Dayjs } from 'dayjs';

import {
    calcEndDate,
    getTrainerDailySchedule,
    getTrainersByServiceId,
    validateBooking,
    type TrainerSpecialtyItem,
    type TimeSlotOption,
} from '../../services/newBookingService';
import type { ServiceItem } from '../../@type/powergym';

import TrainerStep   from './TrainerStep';
import ScheduleStep  from './ScheduleStep';
import ConfirmStep   from './ConfirmStep';
import { BRAND, ACCENT, DARK, STEPS } from '../../until/constants.ts';

export interface BookingData {
    trainerId: number | null;
    trainerName: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    endDate: string;
}

interface Props {
    open: boolean;
    service: ServiceItem;
    userId: number;
    onClose: () => void;
    onReadyToPay: (bookingData: BookingData) => void;
}
export default function TrainerBookingSetupModal({
                                                     open, service, userId, onClose, onReadyToPay,
                                                 }: Props) {
    const [step, setStep] = useState(0);

    /* Step 1 — Trainer selection */
    const [trainers,        setTrainers]        = useState<TrainerSpecialtyItem[]>([]);
    const [loadingTrainers, setLoadingTrainers] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState<TrainerSpecialtyItem | null>(null);
    const [searchQuery,     setSearchQuery]     = useState('');

    /* Step 2 — Schedule */
    const [startDate,    setStartDate]    = useState<Dayjs | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlotOption | null>(null);
    const [bookedTimes,  setBookedTimes]  = useState<Set<string>>(new Set());
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        if (open) {
            setStep(0);
            setTrainers([]);
            setSelectedTrainer(null);
            setSearchQuery('');
            setStartDate(null);
            setSelectedSlot(null);
            setBookedTimes(new Set());
        }
    }, [open]);

    useEffect(() => {
        if (open && service) loadTrainers();
    }, [open, service]);

    const loadTrainers = async () => {
        setLoadingTrainers(true);
        try {
            const res = await getTrainersByServiceId(Number(service.id));
            if (res.success && res.data) {
                setTrainers(res.data);
            }
        } catch (error) {
            console.error("Error loading trainers:", error);
            toast.error("Unable to load trainer list");
        } finally {
            setLoadingTrainers(false);
        }
    };

    const filteredTrainers = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return trainers.filter(t =>
            t.fullName.toLowerCase().includes(q) ||
            t.specialties.some(s => s.specialty.displayName.toLowerCase().includes(q))
        );
    }, [trainers, searchQuery]);


    const loadBookedSlots = useCallback(async (trainerId: number, date: Dayjs) => {
        setLoadingSlots(true);
        try {
            const res = await getTrainerDailySchedule(trainerId, date.format('YYYY-MM-DD'));
            if (res.success && res.data?.dailySlots) {
                const bookedSlots = res.data.dailySlots.filter(
                    s => s.status === 'BOOKED' || s.status === 'DAY_OFF'
                );
                const booked = new Set<string>(bookedSlots.map(s => s.startTime));
                setBookedTimes(booked);
                if (bookedSlots.length > 0) {
                    toast.info(`Trainer có ${bookedSlots.length} khung giờ đã bận vào ngày này. Các slot màu đỏ không thể chọn.`, { autoClose: 3000 });
                }
            } else {
                setBookedTimes(new Set());
            }
        } catch {
            setBookedTimes(new Set());
        } finally {
            setLoadingSlots(false);
        }
    }, []);

    useEffect(() => {
        if (selectedTrainer && startDate) {
            loadBookedSlots(selectedTrainer.id, startDate);
        }
    }, [selectedTrainer, startDate, loadBookedSlots]);

    const endDate = useMemo(() => {
        if (!startDate) return '';
        return calcEndDate(startDate.format('YYYY-MM-DD'), service.duration || 30);
    }, [startDate, service.duration]);

    const minDate = dayjs().add(1, 'day');

    /* ── Validate time slot selection ──────────────────────────────────────── */
    const handleSlotSelect = async (slot: TimeSlotOption | null) => {
        if (!slot || !startDate) {
            setSelectedSlot(slot);
            return;
        }

        // Validate booking before selecting
        try {
            await validateBooking(userId, {
                trainerId: selectedTrainer?.id,
                serviceRegistrationId: 0, // Dummy value for validation (not used in backend)
                bookingDate: startDate.format('YYYY-MM-DD'),
                startTime: slot.startTime,
                endTime: slot.endTime,
            });
            
            // If validation passes, select the slot
            setSelectedSlot(slot);
        } catch (error: any) {
            // Show error message from API
            const errorMsg = error?.response?.data?.message || 'This time slot is not available';
            toast.error(errorMsg, { autoClose: 4000 });
            setSelectedSlot(null);
        }
    };

    /* ── Navigation ──────────────────────────────────────────────────────── */
    const handleNext = () => {
        if (step === 0) {
            setStep(1);
        } else if (step === 1) {
            if (!startDate)    { toast.error('Please select a start date');  return; }
            if (!selectedSlot) { toast.error('Please select a time slot');   return; }
            setStep(2);
        } else {
            onReadyToPay({
                trainerId:   selectedTrainer?.id ?? null,
                trainerName: selectedTrainer?.fullName ?? 'Not selected (Admin will assign)',
                bookingDate: startDate!.format('YYYY-MM-DD'),
                startTime:   selectedSlot!.startTime,
                endTime:     selectedSlot!.endTime,
                endDate,
            });
        }
    };

    const canNext = () => {
        if (step === 0) return true; // trainer is optional
        if (step === 1) return !!startDate && !!selectedSlot;
        return true;
    };

    const nextLabel =
        step === 0 ? (selectedTrainer ? 'Next' : 'Skip (Admin assigns)') :
            step === 1 ? 'Next' :
                'Proceed to Payment';
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 32px 80px rgba(0,102,255,0.22)',
                },
            }}
        >
            {/* ── Header ── */}
            <DialogTitle sx={{ p: 0 }}>
                <Box sx={{
                    background: BRAND,
                    px: 3, py: 2.5,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <FitnessCenter sx={{ color: '#fff', fontSize: 24 }} />
                        <Box>
                            <Typography fontWeight={800} color="#fff" fontSize="1rem">
                                Book a Session with Trainer
                            </Typography>
                            <Typography fontSize="0.75rem" color="rgba(255,255,255,0.75)">
                                {service?.name}
                            </Typography>
                        </Box>
                    </Box>

                    <IconButton
                        size="small"
                        onClick={onClose}
                        sx={{
                            color: '#fff',
                            background: 'rgba(255,255,255,0.15)',
                            '&:hover': { background: 'rgba(255,255,255,0.3)' },
                        }}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                </Box>

                <Box sx={{ px: 3, pt: 2, pb: 1, background: '#f8fafc' }}>
                    <Stepper activeStep={step} alternativeLabel>
                        {STEPS.map((label, i) => (
                            <Step key={label} completed={step > i}>
                                <StepLabel
                                    StepIconProps={{
                                        sx: {
                                            '&.Mui-active':    { color: ACCENT },
                                            '&.Mui-completed': { color: DARK },
                                        },
                                    }}
                                >
                                    <Typography
                                        fontSize="0.72rem"
                                        fontWeight={600}
                                        color={step >= i ? DARK : '#aaa'}
                                    >
                                        {label}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </DialogTitle>

            {/* ── Body ── */}
            <DialogContent sx={{
                p: 0,
                overflow: 'auto',
                maxHeight: '72vh',
                '&::-webkit-scrollbar':       { width: 5 },
                '&::-webkit-scrollbar-thumb': { background: ACCENT, borderRadius: 3 },
            }}>
                {step === 0 && (
                    <TrainerStep
                        trainers={filteredTrainers}
                        loading={loadingTrainers}
                        selected={selectedTrainer}
                        onSelect={setSelectedTrainer}
                        searchQuery={searchQuery}
                        onSearch={setSearchQuery}
                    />
                )}
                {step === 1 && (
                    <ScheduleStep
                        service={service}
                        startDate={startDate}
                        onDateChange={d => { setStartDate(d); setSelectedSlot(null); }}
                        endDate={endDate}
                        minDate={minDate}
                        selectedSlot={selectedSlot}
                        onSlotSelect={handleSlotSelect}
                        bookedTimes={bookedTimes}
                        loading={loadingSlots}
                    />
                )}
                {step === 2 && (
                    <ConfirmStep
                        service={service}
                        trainer={selectedTrainer}
                        startDate={startDate ? startDate.toDate() : null}
                        endDate={endDate}
                        slot={selectedSlot}
                    />
                )}
            </DialogContent>

            {/* ── Footer ── */}
            <Box sx={{
                px: 3, py: 2,
                borderTop: '1px solid rgba(0,0,0,0.07)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#f8fafc',
            }}>
                <Button
                    startIcon={<NavigateBefore />}
                    disabled={step === 0}
                    onClick={() => setStep(s => s - 1)}
                    sx={{
                        textTransform: 'none', fontWeight: 600, color: DARK,
                        '&:hover': { background: 'rgba(4,86,104,0.08)' },
                    }}
                >
                    Back
                </Button>

                {/* Step indicator dots */}
                <Box sx={{ display: 'flex', gap: 0.8 }}>
                    {STEPS.map((_, i) => (
                        <Box
                            key={i}
                            sx={{
                                width: i === step ? 20 : 8, height: 8, borderRadius: 4,
                                background: i <= step ? ACCENT : '#d1d5db',
                                transition: 'all 0.3s',
                            }}
                        />
                    ))}
                </Box>

                <Button
                    variant="contained"
                    endIcon={step < 2 ? <NavigateNext /> : <EventAvailable />}
                    disabled={!canNext()}
                    onClick={handleNext}
                    sx={{
                        textTransform: 'none', fontWeight: 700,
                        background: BRAND, borderRadius: '10px',
                        px: 3, py: 1,
                        boxShadow: '0 4px 14px rgba(4,86,104,0.35)',
                        '&:hover': { boxShadow: '0 6px 20px rgba(4,86,104,0.5)' },
                    }}
                >
                    {nextLabel}
                </Button>
            </Box>
        </Dialog>
    );
}