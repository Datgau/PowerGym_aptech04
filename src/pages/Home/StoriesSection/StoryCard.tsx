import React from 'react';
import {
  Card,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import { 
  Person, 
  Favorite, 
  Comment, 
  Share, 
  Schedule,
  FavoriteBorder 
} from '@mui/icons-material';
import type {StoryItem} from "../../../services/storyService.ts";
import RichTextDisplay from '../../../components/Common/RichTextDisplay';

interface StoryCardProps {
  readonly story: StoryItem;
  readonly onClick: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
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
    e.stopPropagation(); // Prevent card click
    // Handle like/comment/share actions here
    console.log(`${action} clicked for story ${story.id}`);
  };

  return (
    <Card
      sx={{
        height: { xs: 420, sm: 460, md: 490 },
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          '& .story-image': {
            transform: 'scale(1.1)'
          },
          '& .story-overlay': {
            opacity: 0.8
          }
        },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Author Info Header */}
        <Box sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          pb: { xs: 1, sm: 1.5 },
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              src={story.userAvatar}
              alt={story.userName}
              sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                bgcolor: '#00b4ff',
              }}
              slotProps={{
                img: {
                  referrerPolicy: 'no-referrer',
                  crossOrigin: 'anonymous',
                }
              }}
            >
              <Person sx={{ fontSize: { xs: 16, sm: 18 } }} />
            </Avatar>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#2c3e50',
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {story.userName}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                <Schedule sx={{ fontSize: { xs: 12, sm: 14 }, color: '#6c757d' }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#6c757d',
                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                    lineHeight: 1
                  }}
                >
                  {story.timeAgo || formatTimeAgo(story.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Story Image */}
        <Box 
          sx={{ 
            position: 'relative', 
            height: { xs: 160, sm: 180, md: 200 },
            overflow: 'hidden',
            width: '100%'
          }}
        >
          <img
            src={story.imageUrl}
            alt={story.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.4s ease',
              display: 'block'
            }}
            className="story-image"
          />
          <Box
            className="story-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease'
            }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: { xs: 1.5, sm: 2 },
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
        }}>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              color: '#2c3e50',
              fontWeight: 700,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              mb: 1,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {story.title}
          </Typography>

          <Box
            sx={{
              color: '#5a6c7d',
              lineHeight: 1.4,
              mb: 1.5,
              flexGrow: 1,
              fontSize: { xs: '0.75rem', sm: '0.8rem' }
            }}
          >
            <RichTextDisplay 
              content={story.content} 
              maxLines={2}
              variant="body2"
            />
          </Box>

          {/* Tags */}
          {story.tag && story.tag.length > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <Chip
                label={story.tag}
                size="small"
                sx={{
                  backgroundColor: '#00b4ff',
                  color: '#ffffff',
                  fontSize: { xs: '0.6rem', sm: '0.65rem' },
                  fontWeight: 500,
                  height: { xs: 18, sm: 20 }
                }}
              />
            </Box>
          )}

          <Divider sx={{ mb: 1.5 }} />

          {/* Interaction Stats */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 'auto'
            }}
          >
            {/* Like Count */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 1,
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 71, 87, 0.1)'
                }
              }}
              onClick={(e) => handleInteractionClick(e, 'like')}
            >
              {story.isLikedByCurrentUser ? (
                <Favorite sx={{ 
                  fontSize: { xs: 16, sm: 18 }, 
                  color: '#ff4757' 
                }} />
              ) : (
                <FavoriteBorder sx={{ 
                  fontSize: { xs: 16, sm: 18 }, 
                  color: '#6c757d' 
                }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  color: story.isLikedByCurrentUser ? '#ff4757' : '#6c757d',
                  fontWeight: 600,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              >
                {story.likeCount || 0}
              </Typography>
            </Box>

            {/* Comment Count */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 1,
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(0, 180, 255, 0.1)'
                }
              }}
              onClick={(e) => handleInteractionClick(e, 'comment')}
            >
              <Comment sx={{ 
                fontSize: { xs: 16, sm: 18 }, 
                color: '#6c757d' 
              }} />
              <Typography
                variant="caption"
                sx={{
                  color: '#6c757d',
                  fontWeight: 600,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              >
                {story.commentCount || 0}
              </Typography>
            </Box>

            {/* Share Count */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 1,
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(76, 175, 80, 0.1)'
                }
              }}
              onClick={(e) => handleInteractionClick(e, 'share')}
            >
              <Share sx={{ 
                fontSize: { xs: 16, sm: 18 }, 
                color: '#6c757d' 
              }} />
              <Typography
                variant="caption"
                sx={{
                  color: '#6c757d',
                  fontWeight: 600,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              >
                {story.shareCount || 0}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default StoryCard;
