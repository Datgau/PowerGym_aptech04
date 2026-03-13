import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    IconButton,
    useTheme,
    useMediaQuery,
    Avatar,
    Chip,
    Divider,
    Fade,
} from '@mui/material';
import {
    Close,
    Person,
    Schedule,
    LocalOffer,
} from '@mui/icons-material';
import RichTextDisplay from '../../../../../components/Common/RichTextDisplay.tsx';
import type { StoryItem } from '../../../../../services/storyService.ts';

interface Props {
    open: boolean;
    story: StoryItem | null;
    onClose: () => void;
    adminActions?: React.ReactNode; // 👈 slot cho admin buttons
}

const StoryDetailModal = ({ open, story, onClose, adminActions }: Props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [imageLoaded, setImageLoaded] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
        const diffInMonths = Math.floor(diffInDays / 30);
        return `${diffInMonths}mo ago`;
    };

    if (!story) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : 3,
                    maxHeight: '95vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                }
            }}
            TransitionComponent={Fade}
            transitionDuration={400}
        >
            {/* Header */}
            <Box
                sx={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, #00b4ff 0%, #0066ff 100%)',
                    color: 'white',
                    p: 2,
                    flexShrink: 0,
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                        zIndex: 2,
                    }}
                    size="small"
                >
                    <Close />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 6 }}>
                    <Avatar
                        src={story.userAvatar}
                        alt={story.userName}
                        sx={{
                            width: 48,
                            height: 48,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                        }}
                        imgProps={{ referrerPolicy: 'no-referrer', crossOrigin: 'anonymous' }}
                    >
                        <Person />
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                            {story.userName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Schedule fontSize="small" sx={{ opacity: 0.8 }} />
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    {getTimeAgo(story.createdAt)}
                                </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>•</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                {formatDate(story.createdAt)}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Content */}
            <DialogContent
                sx={{
                    p: 0,
                    overflow: 'auto',
                    flex: 1,
                    '&::-webkit-scrollbar': { width: 8 },
                    '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: 4 },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#00b4ff',
                        borderRadius: 4,
                        '&:hover': { background: '#0099e6' },
                    },
                }}
            >
                {/* Story Image */}
                <Box sx={{ position: 'relative', mb: 3 }}>
                    <Box
                        sx={{
                            position: 'relative',
                            height: { xs: 300, sm: 400, md: 450 },
                            overflow: 'hidden',
                            background: '#f5f5f5',
                        }}
                    >
                        <img
                            src={story.imageUrl}
                            alt={story.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'opacity 0.3s ease',
                                opacity: imageLoaded ? 1 : 0,
                            }}
                            onLoad={() => setImageLoaded(true)}
                        />
                        {!imageLoaded && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                                    backgroundSize: '20px 20px',
                                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                                    animation: 'shimmer 1.5s infinite linear',
                                }}
                            />
                        )}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '40%',
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
                                pointerEvents: 'none',
                            }}
                        />
                    </Box>
                </Box>

                {/* Story Content */}
                <Box sx={{ p: 3 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            fontWeight={700}
                            sx={{
                                mb: 2,
                                color: '#2c3e50',
                                lineHeight: 1.2,
                                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                            }}
                        >
                            {story.title}
                        </Typography>

                        {story.tag && (
                            <Box sx={{ mb: 2 }}>
                                <Chip
                                    icon={<LocalOffer />}
                                    label={story.tag}
                                    sx={{
                                        background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                                        color: 'white',
                                        fontWeight: 600,
                                        '& .MuiChip-icon': { color: 'white' },
                                    }}
                                />
                            </Box>
                        )}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ mb: 4 }}>
                        <RichTextDisplay
                            content={story.content}
                            sx={{
                                '& p': { fontSize: { xs: '1rem', sm: '1.1rem' }, lineHeight: 1.7, color: '#4a5568', mb: 2 },
                                '& h1, & h2, & h3, & h4, & h5, & h6': { color: '#2d3748', fontWeight: 600, mt: 3, mb: 2 },
                                '& ul, & ol': { pl: 3, mb: 2 },
                                '& li': { mb: 1, color: '#4a5568' },
                                '& blockquote': {
                                    borderLeft: '4px solid #00b4ff',
                                    pl: 2, ml: 0,
                                    fontStyle: 'italic',
                                    color: '#666',
                                    background: '#f8f9fa',
                                    py: 1,
                                    borderRadius: '0 4px 4px 0',
                                },
                            }}
                        />
                    </Box>
                </Box>
            </DialogContent>

            {/* Admin Actions Footer */}
            {adminActions && (
                <DialogActions
                    sx={{
                        p: 0,
                        flexShrink: 0,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    {adminActions}
                </DialogActions>
            )}

            <style>{`
                @keyframes shimmer {
                    0% { background-position: 0 0, 0 10px, 10px -10px, -10px 0px; }
                    100% { background-position: 20px 20px, 20px 30px, 30px 10px, 10px 20px; }
                }
            `}</style>
        </Dialog>
    );
};

export default StoryDetailModal;