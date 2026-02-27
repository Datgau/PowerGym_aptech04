import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import {
  CheckCircle,
  Star,
  LocalOffer
} from '@mui/icons-material';
import type { PackageOption } from '../../../@type/powergym';

interface PackageCardProps {
  readonly package: PackageOption;
  readonly onSelect: () => void;
  readonly processing: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({ package: pkg, onSelect, processing }) => {
  const IconComponent = pkg.icon || Star;

  return (
    <Card
      elevation={pkg.isPopular ? 12 : 6}
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: pkg.isPopular ? '2px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          '& .package-icon': {
            transform: 'scale(1.1) rotate(5deg)'
          }
        },
        '&::before': pkg.isPopular ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #FFD700, #FFA500)'
        } : {}
      }}
    >
      {/* Popular Badge */}
      {pkg.isPopular && (
        <Chip
          label="MOST POPULAR"
          icon={<Star />}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: '#FFD700',
            color: '#000',
            fontWeight: 700,
            fontSize: '0.75rem',
            zIndex: 2,
            '& .MuiChip-icon': {
              color: '#000'
            }
          }}
        />
      )}

      {/* Discount Badge */}
      {pkg.discount && (
        <Chip
          label={`SAVE ${pkg.discount}%`}
          icon={<LocalOffer />}
          sx={{
            position: 'absolute',
            top: pkg.isPopular ? 56 : 16,
            right: 16,
            backgroundColor: '#FF4444',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.7rem',
            zIndex: 2
          }}
        />
      )}

      <CardContent sx={{ p: { xs: 3, md: 4 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Package Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <IconComponent
            className="package-icon"
            sx={{
              fontSize: { xs: 48, md: 56 },
              color: pkg.color || '#1976d2',
              mb: 2,
              transition: 'all 0.3s ease'
            }}
          />
          
          <Typography 
            variant="h5" 
            component="h3" 
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.3rem', md: '1.5rem' },
              color: '#2c3e50',
              mb: 1,
              textTransform: 'uppercase',
              letterSpacing: '0.02em'
            }}
          >
            {pkg.name}
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{
              color: '#666',
              fontSize: { xs: '0.9rem', md: '1rem' },
              fontWeight: 500
            }}
          >
            {pkg.duration}
          </Typography>
          
          {pkg.description && (
            <Typography
              variant="body2"
              sx={{
                color: '#888',
                fontStyle: 'italic',
                mt: 1,
                fontSize: { xs: '0.8rem', md: '0.9rem' }
              }}
            >
              {pkg.description}
            </Typography>
          )}
        </Box>

        {/* Price Section */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          {pkg.originalPrice && (
            <Typography
              variant="h6"
              sx={{
                color: '#999',
                textDecoration: 'line-through',
                fontSize: { xs: '1rem', md: '1.2rem' },
                mb: 0.5
              }}
            >
              {pkg.originalPrice}
            </Typography>
          )}
          
          <Typography
            variant="h3"
            component="div"
            sx={{
              color: pkg.color || '#1976d2',
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.5rem' },
              lineHeight: 1,
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            {pkg.price}
          </Typography>
        </Box>

        {/* Features List */}
        <List sx={{ flex: 1, py: 0 }}>
          {pkg.features.map((feature, index) => (
            <ListItem 
              key={index} 
              sx={{ 
                px: 0, 
                py: 0.5,
                minHeight: 'auto'
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircle 
                  sx={{ 
                    color: pkg.color || '#1976d2', 
                    fontSize: 18 
                  }} 
                />
              </ListItemIcon>
              <ListItemText
                primary={feature}
                slotProps={{
                  primary: {
                    variant: 'body2',
                    sx: {
                      fontSize: { xs: '0.85rem', md: '0.9rem' },
                      color: '#555',
                      fontWeight: 500,
                      lineHeight: 1.4
                    }
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>

      <CardActions sx={{ p: { xs: 3, md: 4 }, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={onSelect}
          disabled={processing}
          sx={{
            backgroundColor: pkg.color || '#1976d2',
            color: 'white',
            fontWeight: 700,
            fontSize: { xs: '0.9rem', md: '1rem' },
            py: { xs: 1.5, md: 2 },
            borderRadius: 2,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: `0 4px 12px ${pkg.color}40`,
            '&:hover': {
              backgroundColor: pkg.color || '#1976d2',
              filter: 'brightness(0.9)',
              transform: 'translateY(-2px)',
              boxShadow: `0 6px 16px ${pkg.color}60`
            },
            '&:disabled': {
              backgroundColor: '#ccc',
              color: '#666'
            }
          }}
        >
          {processing ? 'PROCESSING...' : 'SELECT PACKAGE'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default PackageCard;