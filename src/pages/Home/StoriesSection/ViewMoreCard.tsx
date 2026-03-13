import React from 'react';
import {
    Card,
    CardActionArea,
    Typography,
    Button, Box
} from '@mui/material';
import { VisibilityOutlined } from '@mui/icons-material';

interface ViewMoreCardProps {
  readonly onClick: () => void;
  readonly totalStories: number;
}

const ViewMoreCard: React.FC<ViewMoreCardProps> = ({ onClick, totalStories }) => {
  return (
      <Card
          sx={{
              height: '100%',
              minHeight: 480,
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px dashed rgba(255,255,255,0.4)',
              borderRadius: '24px',
              overflow: 'hidden',
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:hover': {
                  transform: 'translateY(-12px) scale(1.02)',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '2px dashed rgba(255,255,255,0.6)',
                  boxShadow: '0 24px 48px rgba(0, 0, 0, 0.25)',
                  '&::before': {
                    opacity: 1,
                  }
              }
          }}
      >

      <CardActionArea 
        onClick={onClick} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
            '.MuiCard-root:hover &': {
              transform: 'scale(1.1) rotate(10deg)',
              background: 'rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          <VisibilityOutlined 
            sx={{ 
              fontSize: 40,
              color: 'white',
            }} 
          />
        </Box>
        
        <Typography
          variant="h5"
          component="h3"
          sx={{
            color: 'white',
            fontWeight: 800,
            textAlign: 'center',
            mb: 2,
            fontSize: '1.8rem',
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            letterSpacing: '0.02em'
          }}
        >
          View More
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.95)',
            textAlign: 'center',
            mb: 4,
            lineHeight: 1.6,
            fontSize: '1rem',
            fontWeight: 500,
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
            maxWidth: '280px'
          }}
        >
          Discover {totalStories - 5} more inspiring stories from our community
        </Typography>

        <Button
          variant="contained"
          sx={{
            color: '#667eea',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            fontSize: '0.95rem',
            fontWeight: 700,
            px: 4,
            py: 1.5,
            borderRadius: '16px',
            textTransform: 'none',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'white',
              transform: 'scale(1.05)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            }
          }}
        >
          View All Stories
        </Button>
      </CardActionArea>
    </Card>
  );
};

export default ViewMoreCard;