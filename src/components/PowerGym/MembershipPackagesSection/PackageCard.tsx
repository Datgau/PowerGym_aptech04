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
  const cardColor = pkg.color || '#1976d2';

  return (
    <Card
      elevation={0}
      sx={{
        position: 'relative',
        height: '100%',
        minHeight: { xs: 500, sm: 520, md: 540, lg: 560 },
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 4,
        overflow: 'visible',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 4,
          padding: '2px',
          background: pkg.isPopular 
            ? `linear-gradient(135deg, ${cardColor}, #FFD700, ${cardColor})`
            : `linear-gradient(135deg, rgba(255,255,255,0.5), rgba(200,200,200,0.3))`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          zIndex: -1,
          transition: 'all 0.5s ease'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: '-2px',
          borderRadius: 4,
          background: pkg.isPopular 
            ? `linear-gradient(135deg, ${cardColor}20, #FFD70020)`
            : 'transparent',
          filter: 'blur(20px)',
          opacity: 0,
          transition: 'opacity 0.5s ease',
          zIndex: -2
        },
        '&:hover': {
          transform: 'translateY(-16px) scale(1.03)',
          boxShadow: `0 25px 50px -12px ${cardColor}40`,
          '&::before': {
            background: `linear-gradient(135deg, ${cardColor}, #FFD700, ${cardColor})`,
            animation: 'gradient-rotate 3s linear infinite'
          },
          '&::after': {
            opacity: 1
          },
          '& .package-icon': {
            transform: 'scale(1.15) rotate(10deg)',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
          },
          '& .price-wrapper': {
            transform: 'scale(1.05)'
          }
        },
        '@keyframes gradient-rotate': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      }}
    >
      {/* Popular Badge */}
      {pkg.isPopular && (
        <Chip
          label="MOST POPULAR"
          icon={<Star />}
          sx={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            background: `linear-gradient(135deg, ${pkg.color || '#1976d2'}, #FFD700)`,
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.65rem',
            height: 24,
            zIndex: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            '& .MuiChip-icon': {
              color: '#fff',
              fontSize: 16
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
            top: 12,
            right: 12,
            background: 'linear-gradient(135deg, #FF4444, #FF6B6B)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.65rem',
            height: 24,
            zIndex: 2,
            boxShadow: '0 4px 8px rgba(255,68,68,0.3)',
            '& .MuiChip-icon': {
              fontSize: 14
            }
          }}
        />
      )}

      <CardContent sx={{ p: { xs: 2, md: 2.5 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Package Header */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 60, md: 70 },
              height: { xs: 60, md: 70 },
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${pkg.color || '#1976d2'}15, ${pkg.color || '#1976d2'}30)`,
              border: `2px solid ${pkg.color || '#1976d2'}40`,
              mb: 1.5,
              transition: 'all 0.4s ease'
            }}
          >
            <IconComponent
              className="package-icon"
              sx={{
                fontSize: { xs: 32, md: 36 },
                color: pkg.color || '#1976d2',
                transition: 'all 0.4s ease'
              }}
            />
          </Box>
          
          <Typography 
            variant="h5" 
            component="h3" 
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              color: '#2c3e50',
              mb: 0.5,
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
              fontSize: { xs: '0.8rem', md: '0.9rem' },
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
                mt: 0.5,
                fontSize: { xs: '0.75rem', md: '0.8rem' }
              }}
            >
              {pkg.description}
            </Typography>
          )}
        </Box>

        {/* Price Section */}
        <Box 
          className="price-wrapper"
          sx={{ 
            textAlign: 'center', 
            mb: 2,
            p: 1.5,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${pkg.color || '#1976d2'}08, ${pkg.color || '#1976d2'}15)`,
            border: `1px solid ${pkg.color || '#1976d2'}20`,
            transition: 'transform 0.3s ease'
          }}
        >
          {pkg.originalPrice && (
            <Typography
              variant="h6"
              sx={{
                color: '#999',
                textDecoration: 'line-through',
                fontSize: { xs: '0.85rem', md: '1rem' },
                mb: 0.25
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
              fontSize: { xs: '1.75rem', md: '2rem' },
              lineHeight: 1,
              textShadow: `2px 2px 4px ${pkg.color || '#1976d2'}20`
            }}
          >
            {pkg.price}
          </Typography>
        </Box>

        {/* Features List */}
        <List sx={{ 
          flex: 1, 
          py: 0,
          minHeight: { xs: 180, md: 200 },
          maxHeight: { xs: 220, md: 240 },
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px'
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            background: `${pkg.color || '#1976d2'}40`,
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: `${pkg.color || '#1976d2'}60`
          }
        }}>
          {pkg.features.map((feature, index) => (
            <ListItem 
              key={index} 
              sx={{ 
                px: 0, 
                py: 0.5,
                minHeight: 'auto',
                borderRadius: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: `${pkg.color || '#1976d2'}08`,
                  transform: 'translateX(4px)'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${pkg.color || '#1976d2'}20, ${pkg.color || '#1976d2'}40)`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <CheckCircle 
                    sx={{ 
                      color: pkg.color || '#1976d2', 
                      fontSize: 14 
                    }} 
                  />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={feature}
                slotProps={{
                  primary: {
                    variant: 'body2',
                    sx: {
                      fontSize: { xs: '0.8rem', md: '0.85rem' },
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

      <CardActions sx={{ p: { xs: 2, md: 2.5 }, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          size="medium"
          onClick={onSelect}
          disabled={processing}
          sx={{
            position: 'relative',
            background: `linear-gradient(135deg, ${pkg.color || '#1976d2'}, ${pkg.color || '#1976d2'}dd)`,
            color: 'white',
            fontWeight: 700,
            fontSize: { xs: '0.8rem', md: '0.9rem' },
            py: { xs: 1.2, md: 1.5 },
            borderRadius: 2,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            overflow: 'hidden',
            boxShadow: `0 6px 16px ${pkg.color || '#1976d2'}40`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              transition: 'left 0.5s ease'
            },
            '&:hover': {
              background: `linear-gradient(135deg, ${pkg.color || '#1976d2'}ee, ${pkg.color || '#1976d2'})`,
              transform: 'translateY(-4px)',
              boxShadow: `0 12px 28px ${pkg.color || '#1976d2'}60`,
              '&::before': {
                left: '100%'
              }
            },
            '&:active': {
              transform: 'translateY(-2px)',
              boxShadow: `0 6px 16px ${pkg.color || '#1976d2'}50`
            },
            '&:disabled': {
              background: 'linear-gradient(135deg, #ccc, #bbb)',
              color: '#666',
              boxShadow: 'none'
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