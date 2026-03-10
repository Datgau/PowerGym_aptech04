import React, { useState } from 'react';
import {
    CardActionArea,
    Typography,
    Box,
    Chip,
    Avatar,
    IconButton,
} from '@mui/material';
import {
    Person,
    Favorite,
    Comment,
    Share,
    FavoriteBorder,
} from '@mui/icons-material';
import type { StoryItem } from "../../../services/storyService.ts";
import RichTextDisplay from '../../../components/Common/RichTextDisplay';

interface StoryCardProps {
    readonly story: StoryItem;
    readonly onClick: () => void;
}

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
    const [imgError, setImgError] = useState(false);

    const formatTimeAgo = (dateString: string) => {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} days ago`;
        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
        const diffInMonths = Math.floor(diffInDays / 30);
        return `${diffInMonths} months ago`;
    };

    const handleInteractionClick = (e: React.MouseEvent, action: string) => {
        e.stopPropagation();
        console.log(`${action} clicked for story ${story.id}`);
    };

    return (
        <Box
            sx={{
                height: '100%',
                minHeight: 480,
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                // Top accent bar
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '3px',
                    background: BRAND_GRADIENT,
                    zIndex: 2,
                },
            }}
        >
            <CardActionArea
                onClick={onClick}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                }}
            >
                {/* ── Image ── */}
                <Box sx={{
                    position: 'relative',
                    height: 220,
                    overflow: 'hidden',
                    width: '100%',
                    background: BRAND_GRADIENT,
                    flexShrink: 0,
                }}>
                    <Box
                        component="img"
                        src={imgError ? 'https://placehold.co/600x400/045668/ffffff?text=Story' : story.imageUrl}
                        alt={story.title}
                        onError={() => setImgError(true)}
                        className="story-image"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            display: 'block',
                            transition: 'transform 0.55s cubic-bezier(.22,.97,.44,1)',
                            '.MuiCardActionArea-root:hover &': {
                                transform: 'scale(1.06)',
                            },
                        }}
                    />

                    {/* Gradient overlay */}
                    <Box sx={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(180deg, transparent 40%, rgba(4,86,104,0.7) 100%)',
                        pointerEvents: 'none',
                    }} />

                    {/* Tag badge */}
                    {story.tag && (
                        <Chip
                            label={`#${story.tag}`}
                            size="small"
                            sx={{
                                position: 'absolute', top: 14, right: 14,
                                background: 'rgba(255,255,255,0.92)',
                                backdropFilter: 'blur(8px)',
                                color: '#1366ba',
                                fontWeight: 700,
                                fontSize: '0.68rem',
                                letterSpacing: 1,
                                textTransform: 'uppercase',
                                border: '1px solid rgba(19,102,186,0.2)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                            }}
                        />
                    )}

                    {/* Author overlay */}
                    <Box sx={{
                        position: 'absolute', bottom: 14, left: 14, right: 14,
                        display: 'flex', alignItems: 'center', gap: 1.2,
                        background: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: '12px',
                        px: 1.5, py: 1,
                        border: '1px solid rgba(255,255,255,0.2)',
                    }}>
                        <Avatar
                            src={story.userAvatar}
                            alt={story.userName}
                            slotProps={{ img: { referrerPolicy: 'no-referrer', crossOrigin: 'anonymous' } }}
                            sx={{
                                width: 36, height: 36,
                                border: '2px solid rgba(255,255,255,0.7)',
                                background: BRAND_GRADIENT,
                                flexShrink: 0,
                            }}
                        >
                            <Person sx={{ fontSize: 18, color: '#fff' }} />
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" sx={{
                                color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                                lineHeight: 1.2, overflow: 'hidden',
                                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                textShadow: '0 1px 6px rgba(0,0,0,0.4)',
                            }}>
                                {story.userName}
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: 'rgba(255,255,255,0.85)',
                                fontSize: '0.7rem', lineHeight: 1,
                            }}>
                                {story.timeAgo || formatTimeAgo(story.createdAt)}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* ── Content ── */}
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2.5,
                    background: '#fff',
                }}>
                    {/* Title */}
                    <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                            color: '#0d1b2a',
                            fontWeight: 800,
                            fontSize: '1rem',
                            mb: 1.2,
                            lineHeight: 1.35,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {story.title}
                    </Typography>

                    {/* Body */}
                    <Box sx={{
                        color: '#666',
                        lineHeight: 1.65,
                        mb: 2,
                        flexGrow: 1,
                        fontSize: '0.85rem',
                        fontWeight: 400,
                    }}>
                        <RichTextDisplay
                            content={story.content}
                            maxLines={3}
                            variant="body2"
                        />
                    </Box>

                    {/* ── Interactions ── */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        mt: 'auto',
                        pt: 2,
                        borderTop: '1px solid rgba(19,102,186,0.1)',
                        gap: 0.5,
                    }}>
                        {/* Like */}
                        <IconButton
                            size="small"
                            onClick={(e) => handleInteractionClick(e, 'like')}
                            sx={{
                                display: 'flex', flexDirection: 'column', gap: 0.4,
                                borderRadius: '10px', px: 2, py: 0.8,
                                transition: 'all 0.25s ease',
                                background: story.isLikedByCurrentUser
                                    ? 'rgba(255,80,38,0.08)' : 'transparent',
                                '&:hover': {
                                    background: 'rgba(255,80,38,0.1)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            {story.isLikedByCurrentUser
                                ? <Favorite sx={{ fontSize: 18, color: '#ff5026' }} />
                                : <FavoriteBorder sx={{ fontSize: 18, color: '#ff5026' }} />}
                            <Typography variant="caption" sx={{
                                color: '#ff5026', fontWeight: 700, fontSize: '0.68rem',
                            }}>
                                {story.likeCount || 0}
                            </Typography>
                        </IconButton>

                        {/* Comment */}
                        <IconButton
                            size="small"
                            onClick={(e) => handleInteractionClick(e, 'comment')}
                            sx={{
                                display: 'flex', flexDirection: 'column', gap: 0.4,
                                borderRadius: '10px', px: 2, py: 0.8,
                                transition: 'all 0.25s ease',
                                '&:hover': {
                                    background: 'rgba(19,102,186,0.08)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            <Comment sx={{ fontSize: 18, color: '#1366ba' }} />
                            <Typography variant="caption" sx={{
                                color: '#1366ba', fontWeight: 700, fontSize: '0.68rem',
                            }}>
                                {story.commentCount || 0}
                            </Typography>
                        </IconButton>

                        {/* Share */}
                        <IconButton
                            size="small"
                            onClick={(e) => handleInteractionClick(e, 'share')}
                            sx={{
                                display: 'flex', flexDirection: 'column', gap: 0.4,
                                borderRadius: '10px', px: 2, py: 0.8,
                                transition: 'all 0.25s ease',
                                '&:hover': {
                                    background: 'rgba(0,180,255,0.08)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            <Share sx={{ fontSize: 18, color: '#00b4ff' }} />
                            <Typography variant="caption" sx={{
                                color: '#00b4ff', fontWeight: 700, fontSize: '0.68rem',
                            }}>
                                {story.shareCount || 0}
                            </Typography>
                        </IconButton>
                    </Box>
                </Box>
            </CardActionArea>
        </Box>
    );
};

export default StoryCard;