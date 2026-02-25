import React from 'react';
import {
  Card,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Avatar
} from '@mui/material';
import { Person } from '@mui/icons-material';
import type {StoryItem} from "../../../services/storyService.ts";

interface StoryCardProps {
  readonly story: StoryItem;
  readonly onClick: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
  const truncatedDescription = story.content.length > 250
    ? `${story.content.substring(0, 250)}...`
    : story.content;

  return (
    <Card
      sx={{
        height: { xs: 380, sm: 420, md: 450 },
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
        {/* Full Card Image */}
        <Box 
          sx={{ 
            position: 'relative', 
            height: { xs: 180, sm: 200, md: 220 }, // Responsive height
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
          p: { xs: 2, sm: 2.5 },
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
        }}>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              color: '#2c3e50',
              fontWeight: 700,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              mb: 1.5,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {story.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#5a6c7d',
              lineHeight: 1.5,
              mb: 2,
              flexGrow: 1,
              fontSize: { xs: '0.8rem', sm: '0.9rem' }
            }}
          >
            {truncatedDescription}
          </Typography>

          {/* Tags */}
            {story.tag && story.tag.length > 0 && (
                <Box sx={{ mb: 2 }}>
                    <Chip
                        label={story.tag}
                        size="small"
                        sx={{
                            backgroundColor: '#00b4ff',
                            color: '#ffffff',
                            fontSize: { xs: '0.6rem', sm: '0.7rem' },
                            fontWeight: 500,
                            height: { xs: 18, sm: 20 }
                        }}
                    />
                </Box>
            )}
            {/* Meta Info */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 1.5,
              borderTop: '1px solid #e9ecef',
              mt: 'auto',
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              gap: { xs: 1, sm: 0 } // Gap on mobile
            }}
          >
              {story.userName && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                          src={story.userAvatar}
                          alt={story.userName}
                          sx={{
                              width: { xs: 20, sm: 24 },
                              height: { xs: 20, sm: 24 },
                              bgcolor: '#00b4ff',
                              fontSize: '0.75rem'
                          }}
                          imgProps={{
                              referrerPolicy: 'no-referrer',
                              crossOrigin: 'anonymous',
                          }}
                      >
                          <Person sx={{ fontSize: { xs: 12, sm: 14 } }} />
                      </Avatar>

                      <Typography
                          variant="caption"
                          sx={{
                              color: '#6c757d',
                              fontWeight: 600,
                              fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}
                      >
                          {story.userName}
                      </Typography>
                  </Box>
              )}
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default StoryCard;
