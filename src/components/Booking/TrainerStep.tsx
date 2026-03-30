import { Box, TextField, InputAdornment, Alert, Typography, Skeleton } from '@mui/material';
import { Person, Search, SportsGymnastics } from '@mui/icons-material';
import type { TrainerSpecialtyItem } from '../../services/newBookingService';
import TrainerCard from './TrainerCard';

interface TrainerStepProps {
    trainers: TrainerSpecialtyItem[];
    loading: boolean;
    selected: TrainerSpecialtyItem | null;
    onSelect: (trainer: TrainerSpecialtyItem | null) => void;
    searchQuery: string;
    onSearch: (query: string) => void;
}

export default function TrainerStep({
                                        trainers, loading, selected, onSelect, searchQuery, onSearch,
                                    }: TrainerStepProps) {
    return (
        <Box sx={{ p: 2.5 }}>
            <Alert severity="info" icon={<Person />} sx={{ mb: 2, borderRadius: '10px', fontSize: '0.82rem' }}>
                The trainer must have expertise matching your service plan. You can skip this step — an Admin will assign a trainer for you.
            </Alert>

            <TextField
                fullWidth
                size="small"
                placeholder="Search trainer by name or specialty..."
                value={searchQuery}
                onChange={e => onSearch(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search fontSize="small" />
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />

            {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {[1, 2, 3].map(i => <Skeleton key={i} variant="rounded" height={100} />)}
                </Box>
            ) : trainers.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6, color: '#888' }}>
                    <SportsGymnastics sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                    <Typography>No matching trainers found</Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {trainers.map(trainer => (
                        <TrainerCard
                            key={trainer.id}
                            trainer={trainer}
                            selected={selected?.id === trainer.id}
                            onSelect={onSelect}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}