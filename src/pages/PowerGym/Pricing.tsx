import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Zoom,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle,
  Payment,
  Security,
  Groups,
  School,
  CardGiftcard,
  FitnessCenter
} from '@mui/icons-material';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout';
import PackageCard from '../../components/PowerGym/MembershipPackagesSection/PackageCard';
import { useMembership } from '../../hooks/useMembership';

const Pricing: React.FC = () => {
  const { packages, loading, error, registerPackage } = useMembership();
  const [processing, setProcessing] = React.useState(false);

  const handlePackageSelect = async (packageId: string) => {
    try {
      setProcessing(true);
      const success = await registerPackage(packageId, 'CARD');
      if (success) {
        alert('Package registration successful!');
      } else {
        alert('Package registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Package registration error:', error);
      alert('An error occurred while registering the package.');
    } finally {
      setProcessing(false);
    }
  };

  // Transform backend data to match component props
  const transformedPackages = packages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    duration: `${pkg.duration} days`,
    price: `${pkg.price.toLocaleString('vi-VN')}đ`,
    originalPrice: pkg.originalPrice ? `${pkg.originalPrice.toLocaleString('vi-VN')}đ` : undefined,
    features: pkg.features,
    isPopular: pkg.isPopular,
    color: pkg.isPopular ? '#FF4444' : '#2196F3',
    description: pkg.description,
    discount: pkg.originalPrice ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100) : undefined
  }));

  const specialOffers = [
    { icon: School, title: 'Student Discount', description: '20% off with valid student ID', color: '#FF6B6B' },
    { icon: Groups, title: 'Group Registration', description: '15% off for 3+ people', color: '#4ECDC4' },
    { icon: CardGiftcard, title: 'Renewal Bonus', description: 'Get 1 free month on 1-year renewal', color: '#FFD93D' },
    { icon: FitnessCenter, title: 'Free PT Session', description: 'Complimentary consultation for new members', color: '#6BCF7F' }
  ];

  const paymentMethods = [
    'Cash payment at counter',
    'Bank transfer',
    'Credit/Debit card',
    'E-wallets: MoMo, ZaloPay, VNPay'
  ];

  const terms = [
    'Membership valid from registration date',
    'No refund after activation',
    'Pause package up to 30 days (50,000 VND fee)',
    'Transfer to others (100,000 VND fee)'
  ];

  if (loading) {
    return (
      <PowerGymLayout>
        <Box
          sx={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading membership packages...
          </Typography>
        </Box>
      </PowerGymLayout>
    );
  }

  if (error) {
    return (
      <PowerGymLayout>
        <Box
          sx={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h6" color="error">
            An error occurred: {error}
          </Typography>
        </Box>
      </PowerGymLayout>
    );
  }

  return (
    <PowerGymLayout>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh',
          py: { xs: 4, md: 6 }
        }}
      >
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Zoom in timeout={500}>
            <Box
              sx={{
                textAlign: 'center',
                mb: 6,
                p: { xs: 3, md: 5 },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 4,
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  opacity: 0.1
                }
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '3rem' },
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                  position: 'relative'
                }}
              >
                Membership Pricing
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  opacity: 0.95,
                  maxWidth: 600,
                  mx: 'auto',
                  position: 'relative'
                }}
              >
                Choose the perfect package to achieve your fitness goals
              </Typography>
            </Box>
          </Zoom>

          {/* Packages Grid */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {transformedPackages.map((pkg, index) => (
              <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                <Zoom in timeout={500 + index * 100}>
                  <Box sx={{ height: '100%' }}>
                    <PackageCard
                      package={pkg}
                      onSelect={() => handlePackageSelect(pkg.id)}
                      processing={processing}
                    />
                  </Box>
                </Zoom>
              </Grid>
            ))}
          </Grid>

          {/* Special Offers */}
          <Zoom in timeout={800}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  textAlign: 'center',
                  fontWeight: 700,
                  mb: 4,
                  color: '#2c3e50'
                }}
              >
                Special Offers
              </Typography>
              <Grid container spacing={3}>
                {specialOffers.map((offer, index) => {
                  const IconComponent = offer.icon;
                  return (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card
                        elevation={0}
                        sx={{
                          height: '100%',
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: 3,
                          border: '1px solid rgba(255,255,255,0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: `0 12px 24px ${offer.color}30`
                          }
                        }}
                      >
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 64,
                              height: 64,
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${offer.color}20, ${offer.color}40)`,
                              mb: 2
                            }}
                          >
                            <IconComponent sx={{ fontSize: 32, color: offer.color }} />
                          </Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              mb: 1,
                              fontSize: '1rem',
                              color: '#2c3e50'
                            }}
                          >
                            {offer.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#666',
                              fontSize: '0.85rem'
                            }}
                          >
                            {offer.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Zoom>

          {/* Payment & Terms */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Zoom in timeout={1000}>
                <Card
                  elevation={0}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.3)',
                    height: '100%'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Payment sx={{ fontSize: 32, color: '#4ECDC4', mr: 2 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                        Payment Methods
                      </Typography>
                    </Box>
                    <List>
                      {paymentMethods.map((method, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircle sx={{ color: '#4ECDC4', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={method}
                            slotProps={{
                              primary: {
                                sx: { fontSize: '0.95rem', color: '#555' }
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>

            <Grid item xs={12} md={6}>
              <Zoom in timeout={1100}>
                <Card
                  elevation={0}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.3)',
                    height: '100%'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Security sx={{ fontSize: 32, color: '#FF6B6B', mr: 2 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                        Terms & Conditions
                      </Typography>
                    </Box>
                    <List>
                      {terms.map((term, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircle sx={{ color: '#FF6B6B', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={term}
                            slotProps={{
                              primary: {
                                sx: { fontSize: '0.95rem', color: '#555' }
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </PowerGymLayout>
  );
};

export default Pricing;