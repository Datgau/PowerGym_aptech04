import { Box, Typography, Button } from '@mui/material';

interface EmptyStateProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
                                       title = 'No data available',
                                       description = 'There is currently no content to display.',
                                       actionLabel,
                                       onAction,
                                   }: EmptyStateProps) {
    return (
        <Box
            sx={{
                py: { xs: 6, md: 8 },
                px: 3,
                textAlign: 'center',
                borderRadius: 3,
                border: '1px solid #e5e7eb',
                background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)',
            }}
        >
            {/* Title */}
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 600,
                    color: '#111827',
                    mb: 1,
                }}
            >
                {title}
            </Typography>

            {/* Description */}
            <Typography
                variant="body2"
                sx={{
                    color: '#6b7280',
                    maxWidth: 420,
                    mx: 'auto',
                    lineHeight: 1.6,
                    mb: actionLabel ? 3 : 0,
                }}
            >
                {description}
            </Typography>

            {/* Action */}
            {actionLabel && (
                <Button
                    variant="contained"
                    onClick={onAction}
                    sx={{
                        borderRadius: '999px',
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 3,
                        boxShadow: 'none',
                        backgroundColor: '#111827',
                        '&:hover': {
                            backgroundColor: '#000',
                            boxShadow: 'none',
                        },
                    }}
                >
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
}