/**
 * Shared schedule picker used by both TrainerAssignmentModal and ConfirmPaymentModal.
 * Shows a week-view calendar + time-slot grid for a given trainer.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Skeleton,
  Divider,
} from '@mui/material';
import { ChevronLeft, ChevronRight, CalendarMonth, AccessTime, CheckCircle } from '@mui/icons-material';
import { getTrainerBookedSlots } from '../../../../../services/serviceRegistrationService';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TimeSlot {
  start: string; // HH:mm
  end: string;   // HH:mm
  label: string;
}

export interface ScheduleSelection {
  date: Date;
  slot: TimeSlot;
}

interface TrainerSchedulePickerProps {
  trainerId: number;
  trainerName: string;
  value: ScheduleSelection | null;
  onChange: (sel: ScheduleSelection | null) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const ALL_SLOTS: TimeSlot[] = (() => {
  const slots: TimeSlot[] = [];
  for (let h = 8; h < 21; h++) {
    const start = `${String(h).padStart(2, '0')}:00`;
    const end   = `${String(h + 1).padStart(2, '0')}:00`;
    slots.push({ start, end, label: `${start} – ${end}` });
  }
  return slots;
})();

const DAYS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const toDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getMonday = (d: Date) => {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(d);
  mon.setDate(d.getDate() + diff);
  mon.setHours(0, 0, 0, 0);
  return mon;
};

// ─── Component ────────────────────────────────────────────────────────────────

const TrainerSchedulePicker: React.FC<TrainerSchedulePickerProps> = ({
  trainerId,
  trainerName,
  value,
  onChange,
}) => {
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(value?.date ?? null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(value?.slot ?? null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Sync internal state when value prop changes (e.g. modal re-opens)
  useEffect(() => {
    setSelectedDate(value?.date ?? null);
    setSelectedSlot(value?.slot ?? null);
  }, [value]);

  const loadSlots = useCallback(async (date: Date) => {
    setSlotsLoading(true);
    try {
      const res = await getTrainerBookedSlots(trainerId, toDateStr(date));
      if (res.success) setBookedSlots(res.data.bookedSlots ?? []);
    } catch {
      setBookedSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [trainerId]);

  const handleSelectDate = (d: Date) => {
    setSelectedDate(d);
    setSelectedSlot(null);
    onChange(null); // clear selection until slot is picked
    loadSlots(d);
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    if (selectedDate) onChange({ date: selectedDate, slot });
  };

  const handlePrevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(weekStart.getDate() - 7);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (prev >= getMonday(today)) setWeekStart(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(weekStart.getDate() + 7);
    setWeekStart(next);
  };

  const isBooked = (slot: TimeSlot) =>
    bookedSlots.some((b) => {
      const [bs, be] = b.split('-');
      return bs === slot.start && be === slot.end;
    });

  const today = new Date(); today.setHours(0, 0, 0, 0);

  const weekLabel = (() => {
    const end = new Date(weekStart);
    end.setDate(weekStart.getDate() + 6);
    return `${weekStart.getDate()}/${weekStart.getMonth() + 1} – ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`;
  })();

  return (
    <Box>
      {/* Trainer label */}
      <Typography fontSize={13} color="#64748b" mb={2}>
        Xem lịch của trainer{' '}
        <Box component="span" fontWeight={700} color="#0066ff">{trainerName}</Box>
        {' '}và chọn khung giờ phù hợp.
      </Typography>

      {/* Week navigation */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
        <IconButton size="small" onClick={handlePrevWeek}>
          <ChevronLeft />
        </IconButton>
        <Typography fontWeight={600} fontSize={14} color="#0f172a">{weekLabel}</Typography>
        <IconButton size="small" onClick={handleNextWeek}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Day picker */}
      <Box display="flex" gap={0.75} justifyContent="center">
        {Array.from({ length: 7 }, (_, i) => {
          const d = new Date(weekStart);
          d.setDate(weekStart.getDate() + i);
          const isPast = d < today;
          const isSelected = selectedDate ? isSameDay(d, selectedDate) : false;
          const isToday = isSameDay(d, today);

          return (
            <Box
              key={i}
              onClick={() => !isPast && handleSelectDate(d)}
              sx={{
                width: 44, height: 60, borderRadius: 2,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                cursor: isPast ? 'not-allowed' : 'pointer',
                border: isSelected ? '2px solid #0066ff' : '1px solid #eaeef8',
                background: isSelected
                  ? 'linear-gradient(135deg, #0066ff, #00b4ff)'
                  : isToday ? '#f0f7ff' : '#fff',
                opacity: isPast ? 0.4 : 1,
                transition: 'all 0.15s',
                '&:hover': !isPast ? { borderColor: '#0066ff', background: '#f0f7ff' } : {},
              }}
            >
              <Typography fontSize={10} fontWeight={600}
                color={isSelected ? '#fff' : '#64748b'} lineHeight={1}>
                {DAYS_VI[d.getDay()]}
              </Typography>
              <Typography fontSize={15} fontWeight={700} mt={0.3}
                color={isSelected ? '#fff' : isToday ? '#0066ff' : '#0f172a'}>
                {d.getDate()}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Time slots */}
      {selectedDate ? (
        <>
          <Typography fontWeight={600} fontSize={13} color="#0f172a" mb={0.5}>
            Khung giờ ngày{' '}
            {selectedDate.toLocaleDateString('vi-VN', {
              weekday: 'long', day: 'numeric', month: 'numeric',
            })}
          </Typography>
          <Typography fontSize={12} color="#64748b" mb={1}>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mr: 2 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: 1, background: '#fff5f5', border: '1px solid #fca5a5', display: 'inline-block' }} />
              Đã đặt
            </Box>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: 1, background: '#f0f7ff', border: '1px solid #0066ff', display: 'inline-block' }} />
              Đang chọn
            </Box>
          </Typography>

          {slotsLoading ? (
            <Box display="flex" flexWrap="wrap" gap={1}>
              {Array.from({ length: 13 }, (_, i) => (
                <Skeleton key={i} variant="rounded" width={90} height={34} />
              ))}
            </Box>
          ) : (
            <Box display="flex" flexWrap="wrap" gap={1}>
              {ALL_SLOTS.map((slot) => {
                const booked = isBooked(slot);
                const selected = selectedSlot?.start === slot.start;
                return (
                  <Chip
                    key={slot.start}
                    label={slot.label}
                    onClick={() => !booked && handleSelectSlot(slot)}
                    icon={<AccessTime sx={{ fontSize: '14px !important' }} />}
                    sx={{
                      cursor: booked ? 'not-allowed' : 'pointer',
                      fontWeight: selected ? 700 : 500,
                      fontSize: 12,
                      border: selected
                        ? '2px solid #0066ff'
                        : booked ? '1px solid #fca5a5' : '1px solid #eaeef8',
                      background: selected
                        ? 'linear-gradient(135deg, #0066ff22, #00b4ff22)'
                        : booked ? '#fff5f5' : '#f8faff',
                      color: selected ? '#0066ff' : booked ? '#ef4444' : '#374151',
                      opacity: booked ? 0.7 : 1,
                      '& .MuiChip-icon': {
                        color: selected ? '#0066ff' : booked ? '#ef4444' : '#94a3b8',
                      },
                    }}
                  />
                );
              })}
            </Box>
          )}
        </>
      ) : (
        <Box sx={{
          textAlign: 'center', py: 4, color: '#94a3b8',
          background: '#f8faff', borderRadius: 2, border: '1px dashed #cbd5e1',
        }}>
          <CalendarMonth sx={{ fontSize: 36, mb: 1, opacity: 0.5 }} />
          <Typography fontSize={13}>Chọn ngày để xem khung giờ trống</Typography>
        </Box>
      )}

      {/* Selected summary */}
      {selectedDate && selectedSlot && (
        <Box sx={{
          mt: 2, p: 1.5, background: '#f0f7ff', borderRadius: 2,
          border: '1px solid #0066ff33', display: 'flex', alignItems: 'center', gap: 1,
        }}>
          <CheckCircle sx={{ color: '#0066ff', fontSize: 18 }} />
          <Typography fontSize={13} fontWeight={600} color="#0066ff">
            Đã chọn:{' '}
            {selectedDate.toLocaleDateString('vi-VN', {
              weekday: 'short', day: 'numeric', month: 'numeric',
            })}
            {' · '}
            {selectedSlot.label}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TrainerSchedulePicker;
