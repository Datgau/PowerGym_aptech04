import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { MonitorHeart } from '@mui/icons-material';
import BMICalculator from './BMICalculator.tsx';
import BMIChart from './BMIChart.tsx';

const BMISection: React.FC = () => {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 8, md: 12 },
                background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0, height: '100%',
                    background: `
            radial-gradient(circle at 15% 50%, rgba(0,180,255,0.06) 0%, transparent 50%),
            radial-gradient(circle at 85% 30%, rgba(19,102,186,0.05) 0%, transparent 50%)
          `,
                    pointerEvents: 'none',
                },
            }}
        >
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

                {/* ── Header ── */}
                <Box sx={{ mb: { xs: 6, md: 10 }, position: 'relative' }}>
                    {/* Decorative background text */}
                    <Typography sx={{
                        position: 'absolute',
                        top: { xs: -20, md: -40 },
                        left: -10,
                        fontSize: { xs: '5rem', md: '10rem' },
                        fontWeight: 900,
                        color: 'rgba(0,102,255,0.04)',
                        lineHeight: 1,
                        userSelect: 'none',
                        pointerEvents: 'none',
                        letterSpacing: '-4px',
                        whiteSpace: 'nowrap',
                    }}>
                        BMI
                    </Typography>

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        {/* Pill badge */}
                        <Box sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2.5,
                            px: 2.5, py: 0.8,
                            background: 'linear-gradient(135deg, rgba(0,180,255,0.1), rgba(0,102,255,0.1))',
                            borderRadius: '50px',
                            border: '1px solid rgba(0,180,255,0.2)',
                        }}>
                            <MonitorHeart sx={{ color: '#00b4ff', fontSize: 18 }} />
                            <Typography variant="overline" sx={{
                                color: '#00b4ff', fontWeight: 700,
                                letterSpacing: '0.12em', fontSize: '0.75rem',
                            }}>
                                HEALTH TOOLS
                            </Typography>
                        </Box>

                        {/* Title row */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { xs: 'flex-start', md: 'flex-end' },
                            justifyContent: 'space-between',
                            gap: 3,
                        }}>
                            <Box>
                                <Typography variant="h1" component="h2" sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                                    lineHeight: 1.1,
                                    letterSpacing: '-1px',
                                    background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}>
                                    Know Your<br />
                                    <Box component="span" sx={{
                                        background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}>BMI Index</Box>
                                </Typography>
                            </Box>

                            <Box sx={{ maxWidth: 320, mb: { md: 0.5 } }}>
                                <Box sx={{
                                    width: 48, height: 3,
                                    background: 'linear-gradient(90deg, #00b4ff, #0066ff)',
                                    borderRadius: 2, mb: 1.5,
                                }} />
                                <Typography variant="body1" sx={{
                                    color: '#666', lineHeight: 1.75,
                                    fontSize: { xs: '0.95rem', md: '1rem' }, fontWeight: 400,
                                }}>
                                    Calculate your body mass index and get personalized health advice
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* ── Two Column Layout ── */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 3, md: 4 },
                    alignItems: 'stretch',
                }}>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <BMICalculator />
                    </Box>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <BMIChart />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default BMISection;