import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack
} from '@mui/material';
import {
  CheckCircle,
  Star,
  LocalOffer,
  Payment as PaymentIcon,
  AppRegistration as RegisterIcon
} from '@mui/icons-material';
import type { PackageOption } from '../../@type/powergym.ts';

interface PaymentPackageCardProps {
  readonly package: PackageOption;
  readonly onSelect: () => void;
  readonly onPayNow: () => void;
  readonly processing: boolean;
}

const PaymentPackageCard: React.FC<PaymentPackageCardProps> = ({ 
  package: pkg, 
  onSelect, 
  onPayNow, 
  processing 
}) => {
  const IconComponent = pkg.icon || Star;
  const cardColor = pkg.color || '#1976d2';
  return (
    <Card
      elevation={0}
      sx={{
        position: 'relative',
        height: '100%',
        minHeight: { xs: 500, sm: 520, md: 540, lg: 580 },
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
        '&:hover': {
          transform: 'translateY(-16px) scale(1.03)',
          boxShadow: `0 25px 50px -12px ${cardColor}40`,
          '&::before': {
            background: `linear-gradient(135deg, ${cardColor}, #FFD700, ${cardColor})`,
          },
          '& .package-icon': {
            transform: 'scale(1.15) rotate(10deg)',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
          },
          '& .price-wrapper': {
            transform: 'scale(1.05)'
          }
        }
      }}
    >
      {/* Popular Badge */}
      {pkg.isPopular && (
        <Chip
          label="Best Seller"
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
          label={`Sale ${pkg.discount}%`}
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
          minHeight: { xs: 140, md: 160 },
          maxHeight: { xs: 180, md: 200 },
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
        <Stack spacing={1.5} sx={{ width: '100%' }}>
          {/* Register Button */}
          <Button
            variant="outlined"
            fullWidth
            size="medium"
            onClick={onSelect}
            disabled={processing}
            startIcon={<RegisterIcon />}
            sx={{
              fontWeight: 600,
              fontSize: { xs: '0.8rem', md: '0.85rem' },
              py: { xs: 1, md: 1.2 },
              borderRadius: 2,
              textTransform: 'none',
              borderColor: pkg.color || '#1976d2',
              color: pkg.color || '#1976d2',
              '&:hover': {
                borderColor: pkg.color || '#1976d2',
                backgroundColor: `${pkg.color || '#1976d2'}08`,
                transform: 'translateY(-2px)',
              }
            }}
          >
              {processing ? 'Processing...' : 'Register Directly'}
          </Button>

          {/* Payment Button */}
          <Button
            variant="contained"
            fullWidth
            size="medium"
            onClick={onPayNow}
            disabled={processing}
            startIcon={<PaymentIcon />}
            sx={{
              position: 'relative',
              background: 'linear-gradient(135deg, #d82d8b, #a4036f)',
              color: 'white',
              fontWeight: 700,
              fontSize: { xs: '0.8rem', md: '0.85rem' },
              py: { xs: 1.2, md: 1.5 },
              borderRadius: 2,
              textTransform: 'none',
              overflow: 'hidden',
              boxShadow: '0 6px 16px rgba(216,45,139,0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #c02a7f, #8f0362)',
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 28px rgba(216,45,139,0.6)',
              },
              '&:active': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(216,45,139,0.5)'
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #ccc, #bbb)',
                color: '#666',
                boxShadow: 'none'
              }
            }}
          >
              {processing ? 'Processing...' : 'Payment Method MoMo'}
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default PaymentPackageCard;