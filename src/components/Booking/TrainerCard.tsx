import { Box, Avatar, Typography, Chip } from '@mui/material';
import { Star, WorkspacePremium, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import type { TrainerSpecialtyItem } from '../../services/newBookingService';
import { ACCENT, LEVEL_COLOR } from '../../until/constants.ts';

interface TrainerCardProps {
    trainer: TrainerSpecialtyItem;
    selected: boolean;
    onSelect: (trainer: TrainerSpecialtyItem) => void;
}

export default function TrainerCard({ trainer, selected, onSelect }: TrainerCardProps) {
    return (
        <Box
            onClick={() => onSelect(trainer)}
            sx={{
                display: 'flex', alignItems: 'center', gap: 2,
                p: 1.5, borderRadius: '14px', cursor: 'pointer',
                border: selected ? `2px solid ${ACCENT}` : '1.5px solid rgba(0,0,0,0.09)',
                background: selected ? 'linear-gradient(135deg, #f0fbff, #e6f6ff)' : '#fff',
                boxShadow: selected ? `0 0 0 3px rgba(0,180,255,0.15)` : '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s',
                '&:hover': { borderColor: ACCENT, boxShadow: '0 4px 16px rgba(0,180,255,0.15)' },
            }}
        >
            <Avatar
                src={trainer.avatar}
                sx={{
                    width: 60, height: 60,
                    border: selected ? `3px solid ${ACCENT}` : '3px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
            >
                {trainer.fullName.charAt(0)}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography fontWeight={700} fontSize="0.92rem" color="#1a1a2e">
                        {trainer.fullName}
                    </Typography>

                    {trainer.totalExperienceYears && (
                        <Chip
                            icon={<Star sx={{ fontSize: '12px !important' }} />}
                            label={`${trainer.totalExperienceYears} yrs exp`}
                            size="small"
                            sx={{
                                height: 20, fontSize: '0.65rem',
                                background: '#fef3c7', color: '#92400e',
                                fontWeight: 700,
                                '.MuiChip-icon': { color: '#f59e0b' },
                            }}
                        />
                    )}
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {trainer.specialties.slice(0, 3).map(sp => {
                        const color = LEVEL_COLOR[sp.level?.toUpperCase() ?? 'BEGINNER'];
                        return (
                            <Chip
                                key={sp.id}
                                icon={<WorkspacePremium sx={{ fontSize: '11px !important' }} />}
                                label={sp.specialty.displayName}
                                size="small"
                                sx={{
                                    height: 18, fontSize: '0.62rem', fontWeight: 600,
                                    background: `${color}18`,
                                    color,
                                    border: `1px solid ${color}30`,
                                    '.MuiChip-icon': { color: 'inherit' },
                                }}
                            />
                        );
                    })}
                </Box>
            </Box>

            {selected
                ? <CheckCircle sx={{ color: ACCENT, fontSize: 24, flexShrink: 0 }} />
                : <RadioButtonUnchecked sx={{ color: '#d1d5db', fontSize: 24, flexShrink: 0 }} />}
        </Box>
    );
}