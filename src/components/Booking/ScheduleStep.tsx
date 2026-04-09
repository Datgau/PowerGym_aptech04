import { Box, Typography, Tooltip } from '@mui/material';
import { CalendarToday, AccessTime, CheckCircle } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersDay, type PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import { BOOKING_SLOTS, formatDateVi, type TimeSlotOption } from '../../services/newBookingService';
import type { ServiceItem } from '../../@type/powergym';
import { ACCENT, DARK } from '../../until/constants.ts';

interface ScheduleStepProps {
    service: ServiceItem;
    startDate: Dayjs | null;
    onDateChange: (date: Dayjs | null) => void;
    endDate: string;
    minDate: Dayjs;
    selectedSlot: TimeSlotOption | null;
    onSlotSelect: (slot: TimeSlotOption | null) => void;
    bookedTimes: Set<string>;
    bookedDates?: Set<string>;
    onMonthChange?: (month: Dayjs) => void;
}

export default function ScheduleStep({
                                         service, startDate, onDateChange, endDate, minDate,
                                         selectedSlot, onSlotSelect, bookedTimes,
                                         bookedDates = new Set(),
                                         onMonthChange,
                                     }: ScheduleStepProps) {

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
                        '&:hover': {
                            backgroundColor: `${ACCENT}50`,
                        },
                        '&.Mui-selected': {
                            backgroundColor: ACCENT,
                            '&:hover': {
                                backgroundColor: ACCENT,
                            },
                        },
                    }),
                }}
            />
        );
    };

    return (
        <Box sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>

                {/* Date picker */}
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
                            slots={{
                                day: CustomDay,
                            }}
                            sx={{
                                '& .MuiPickersDay-root.Mui-selected': {
                                    background: ACCENT,
                                    fontWeight: 800,
                                    '&:hover': {
                                        backgroundColor: ACCENT,
                                    },
                                },
                                '& .MuiPickersDay-root:hover': { background: `${ACCENT}20` },
                                background: '#fff',
                                borderRadius: '12px',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                border: '1.5px solid rgba(0,0,0,0.07)',
                            }}
                        />
                    </LocalizationProvider>

                    {/* Legend */}
                    <Box sx={{
                        mt: 1.5, p: 1.5, borderRadius: '10px',
                        background: '#f8f9fa',
                        border: '1px solid rgba(0,0,0,0.08)',
                    }}>
                        <Typography fontSize="0.75rem" fontWeight={600} color={DARK} mb={0.8}>
                            Legend:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                                width: 20, height: 20, borderRadius: '4px',
                                background: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)',
                                border: '2px solid #00acc1',
                            }} />
                            <Typography fontSize="0.7rem" color="#666">
                                Date with booked schedule
                            </Typography>
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
                    ) : (
                        <Box sx={{
                            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1,
                            maxHeight: 380, overflow: 'auto',
                            '&::-webkit-scrollbar': { width: 4 },
                            '&::-webkit-scrollbar-thumb': { background: ACCENT, borderRadius: 2 },
                        }}>
                            {BOOKING_SLOTS.map(slot => {
                                const isBooked   = bookedTimes.has(slot.startTime);
                                const isSelected = selectedSlot?.startTime === slot.startTime;

                                return (
                                    <Tooltip
                                        key={slot.startTime}
                                        title={isBooked ? 'This time slot is already booked' : ''}
                                        placement="top"
                                    >
                                        <Box
                                            onClick={() => !isBooked && onSlotSelect(isSelected ? null : slot)}
                                            sx={{
                                                p: 1.2, borderRadius: '10px', textAlign: 'center',
                                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                                border: isSelected ? `2px solid ${ACCENT}`
                                                    : isBooked   ? '1.5px solid #fecaca'
                                                        :              '1.5px solid #e5e7eb',
                                                background: isSelected ? `${ACCENT}15`
                                                    : isBooked   ? '#fef2f2'
                                                        :              '#fff',
                                                opacity: isBooked ? 0.55 : 1,
                                                transition: 'all 0.18s',
                                                '&:hover': isBooked ? {} : {
                                                    borderColor: ACCENT,
                                                    background: `${ACCENT}10`,
                                                    transform: 'translateY(-1px)',
                                                },
                                            }}
                                        >
                                            <Typography
                                                fontSize="0.78rem"
                                                fontWeight={isSelected ? 800 : 600}
                                                color={isSelected ? DARK : isBooked ? '#ef4444' : '#374151'}
                                            >
                                                {slot.startTime}
                                            </Typography>
                                            <Typography fontSize="0.65rem" color={isBooked ? '#ef4444' : '#9ca3af'}>
                                                {isBooked ? 'Booked' : slot.endTime}
                                            </Typography>
                                            {isSelected && <CheckCircle sx={{ fontSize: 12, color: ACCENT, mt: 0.3 }} />}
                                        </Box>
                                    </Tooltip>
                                );
                            })}
                        </Box>
                    )}
                </Box>

            </Box>
        </Box>
    );
}
