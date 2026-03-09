import React, { useState } from 'react';
import {
  Card,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton
} from '@mui/material';
import { 
  Person, 
  Favorite, 
  Comment, 
  Share, 
  FavoriteBorder 
} from '@mui/icons-material';
import type {StoryItem} from "../../../services/storyService.ts";
import RichTextDisplay from '../../../components/Common/RichTextDisplay';

interface StoryCardProps {
  readonly story: StoryItem;
  readonly onClick: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
  const [imgError, setImgError] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours}h trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} tháng trước`;
  };

  const handleInteractionClick = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    console.log(`${action} clicked for story ${story.id}`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        minHeight: 480,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '24px',
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
          backgroundSize: '200% 100%',
          animation: 'gradient 3s ease infinite',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover': {
          transform: 'translateY(-12px)',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          '&::before': {
            opacity: 1,
          },
          '& .story-image': {
            transform: 'scale(1.08) rotate(1deg)',
          },
          '& .story-overlay': {
            opacity: 1,
          },
          '& .author-avatar': {
            transform: 'scale(1.1) rotate(5deg)',
          },
          '& .interaction-btn': {
            transform: 'scale(1.1)',
          }
        },
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      }}
    >
      <CardActionArea 
        onClick={onClick} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'stretch'
        }}
      >
        {/* Image Section with Gradient Overlay */}
        <Box 
          sx={{ 
            position: 'relative', 
            height: 240,
            overflow: 'hidden',
            width: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <img
            src={imgError ? 'https://placehold.co/600x400/667eea/ffffff?text=Story+Image' : story.imageUrl}
            alt={story.title}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              display: 'block'
            }}
            className="story-image"
          />
          
          {/* Gradient Overlay */}
          <Box
            className="story-overlay"
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.7) 100%)',
              opacity: 0,
              transition: 'opacity 0.4s ease',
              pointerEvents: 'none'
            }}
          />

          {/* Tag Badge */}
          {story.tag && (
            <Chip
              label={`#${story.tag}`}
              size="small"
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                color: '#667eea',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  background: 'rgba(255, 255, 255, 1)',
                }
              }}
            />
          )}

          {/* Author Info on Image */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '12px 16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Avatar
              src={story.userAvatar}
              alt={story.userName}
              className="author-avatar"
              sx={{
                width: 40,
                height: 40,
                border: '2px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
              slotProps={{
                img: {
                  referrerPolicy: 'no-referrer',
                  crossOrigin: 'anonymous',
                }
              }}
            >
              <Person sx={{ fontSize: 20, color: '#fff' }} />
            </Avatar>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}
              >
                {story.userName}
              </Typography>
              
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.7rem',
                  lineHeight: 1,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                {story.timeAgo || formatTimeAgo(story.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Content Section */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: 3,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              color: '#1a1a2e',
              fontWeight: 800,
              fontSize: '1.1rem',
              mb: 1.5,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {story.title}
          </Typography>

          <Box
            sx={{
              color: '#4a5568',
              lineHeight: 1.6,
              mb: 2,
              flexGrow: 1,
              fontSize: '0.85rem',
              fontWeight: 400
            }}
          >
            <RichTextDisplay 
              content={story.content} 
              maxLines={3}
              variant="body2"
            />
          </Box>

          {/* Interaction Stats */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              mt: 'auto',
              pt: 2,
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              gap: 1
            }}
          >
            {/* Like */}
            <IconButton
              size="small"
              className="interaction-btn"
              onClick={(e) => handleInteractionClick(e, 'like')}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                borderRadius: '12px',
                padding: '8px 16px',
                transition: 'all 0.3s ease',
                background: story.isLikedByCurrentUser 
                  ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)' 
                  : 'rgba(0, 0, 0, 0.03)',
                '&:hover': {
                  background: story.isLikedByCurrentUser
                    ? 'linear-gradient(135deg, #ee5a6f 0%, #ff6b6b 100%)'
                    : 'rgba(255, 107, 107, 0.1)',
                  transform: 'scale(1.05)',
                }
              }}
            >
              {story.isLikedByCurrentUser ? (
                <Favorite sx={{ fontSize: 20, color: '#fff' }} />
              ) : (
                <FavoriteBorder sx={{ fontSize: 20, color: '#ff6b6b' }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  color: story.isLikedByCurrentUser ? '#fff' : '#ff6b6b',
                  fontWeight: 700,
                  fontSize: '0.7rem'
                }}
              >
                {story.likeCount || 0}
              </Typography>
            </IconButton>

            {/* Comment */}
            <IconButton
              size="small"
              className="interaction-btn"
              onClick={(e) => handleInteractionClick(e, 'comment')}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                borderRadius: '12px',
                padding: '8px 16px',
                transition: 'all 0.3s ease',
                background: 'rgba(0, 0, 0, 0.03)',
                '&:hover': {
                  background: 'rgba(79, 172, 254, 0.1)',
                  transform: 'scale(1.05)',
                }
              }}
            >
              <Comment sx={{ fontSize: 20, color: '#4facfe' }} />
              <Typography
                variant="caption"
                sx={{
                  color: '#4facfe',
                  fontWeight: 700,
                  fontSize: '0.7rem'
                }}
              >
                {story.commentCount || 0}
              </Typography>
            </IconButton>

            {/* Share */}
            <IconButton
              size="small"
              className="interaction-btn"
              onClick={(e) => handleInteractionClick(e, 'share')}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                borderRadius: '12px',
                padding: '8px 16px',
                transition: 'all 0.3s ease',
                background: 'rgba(0, 0, 0, 0.03)',
                '&:hover': {
                  background: 'rgba(0, 242, 254, 0.1)',
                  transform: 'scale(1.05)',
                }
              }}
            >
              <Share sx={{ fontSize: 20, color: '#00f2fe' }} />
              <Typography
                variant="caption"
                sx={{
                  color: '#00f2fe',
                  fontWeight: 700,
                  fontSize: '0.7rem'
                }}
              >
                {story.shareCount || 0}
              </Typography>
            </IconButton>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default StoryCard;
