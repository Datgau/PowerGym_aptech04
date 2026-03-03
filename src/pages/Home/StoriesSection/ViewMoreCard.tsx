import React from 'react';
import {
  Card,
  CardActionArea,
  Typography,
  Button
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
              height: { xs: 380, sm: 420, md: 450 },
              display: 'flex',
              flexDirection: 'column',
              background: `
                  linear-gradient(
                    135deg,
                    rgba(0, 110, 170, 0.85) 0%,
                    rgba(0, 70, 130, 0.85) 100%
                  )
                `,
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.25)',
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
              '&:hover': {
                  transform: 'translateY(-8px) scale(1.03)',
                  background: `
                    linear-gradient(
                      135deg,
                      rgba(0, 160, 255, 0.9) 0%,
                      rgba(0, 110, 200, 0.9) 100%
                    )
                  `,
                boxShadow: `
                0 0 0 2px rgba(255,255,255,0.35),
                0 25px 60px rgba(0,0,0,0.45)
              `,
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
          p: { xs: 2, sm: 3 } // Responsive padding
        }}
      >
        <VisibilityOutlined 
          sx={{ 
            fontSize: { xs: 48, sm: 64 },
            color: 'rgba(255, 255, 255, 0.8)',
            mb: 2
          }} 
        />
        
        <Typography
          variant="h5"
          component="h3"
          sx={{
            color: 'white',
            fontWeight: 700,
            textAlign: 'center',
            mb: 2,
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          View More
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            mb: 3,
            lineHeight: 1.5,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            px: 1
          }}
        >
          Discover {totalStories - 10} more stories from the PowerGym community
        </Typography>

        <Button
          variant="outlined"
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.6)',
            fontSize: { xs: '0.8rem', sm: '0.9rem' }, // Responsive button font
            px: { xs: 2, sm: 3 }, // Responsive button padding
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          View All
        </Button>
      </CardActionArea>
    </Card>
  );
};

export default ViewMoreCard;