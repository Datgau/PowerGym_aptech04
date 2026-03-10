import React from 'react';
import { Box, Container, Grid, Typography, Divider } from '@mui/material';
import { FitnessCenter } from '@mui/icons-material';
import CompanyInfo from './CompanyInfo';
import ContactMap from './ContactMap';
import RegistrationForm from './RegistrationForm';
import SocialLinks from './SocialLinks';
import Copyright from './Copyright';

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const Footer: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                background: '#0d1b2a',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                // Top accent bar
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '3px',
                    background: BRAND_GRADIENT,
                    zIndex: 2,
                },
                // Subtle radial glows
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: `
                        radial-gradient(circle at 10% 80%, rgba(0,180,255,0.06) 0%, transparent 45%),
                        radial-gradient(circle at 90% 20%, rgba(19,102,186,0.05) 0%, transparent 45%)
                    `,
                    pointerEvents: 'none',
                    zIndex: 0,
                },
            }}
        >
            {/* Grid texture */}
            <Box sx={{
                position: 'absolute', inset: 0,
                backgroundSize: '48px 48px',
                pointerEvents: 'none', zIndex: 0,
            }} />

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, pt: 8, pb: 2 }}>

                {/* ── Brand bar ── */}
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5, mb: 6,
                    pb: 4, borderBottom: '1px solid rgba(255,255,255,0.07)',
                }}>
                    <Box sx={{
                        width: 42, height: 42, borderRadius: '10px',
                        background: BRAND_GRADIENT,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(4,86,104,0.4)',
                    }}>
                        <FitnessCenter sx={{ color: '#fff', fontSize: 22 }} />
                    </Box>
                    <Box>
                        <Typography sx={{
                            fontWeight: 900, fontSize: '1.4rem',
                            letterSpacing: '-0.3px', lineHeight: 1,
                            background: BRAND_GRADIENT,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            POWERGYM
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', letterSpacing: 2, textTransform: 'uppercase', mt: 0.2 }}>
                            Premium Fitness Center
                        </Typography>
                    </Box>
                </Box>

                {/* ── 3 columns ── */}
                <Grid container spacing={5}>
                    <Grid item xs={12} md={4}>
                        <CompanyInfo />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RegistrationForm />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <ContactMap />
                    </Grid>
                </Grid>

                {/* ── Social ── */}
                <Box sx={{ mt: 6 }}>
                    <SocialLinks />
                </Box>

                {/* ── Copyright ── */}
                <Copyright />
            </Container>
        </Box>
    );
};

export default Footer;