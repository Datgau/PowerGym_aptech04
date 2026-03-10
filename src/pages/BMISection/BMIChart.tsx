import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Divider,
} from '@mui/material';
import { Assessment } from '@mui/icons-material';

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const BMIChart: React.FC = () => {
    const bmiCategories = [
        {
            range: 'Below 18.5',
            category: 'Underweight',
            color: '#2196F3',
            description: 'Need to gain weight to reach ideal level',
            barWidth: 22,
        },
        {
            range: '18.5 – 24.9',
            category: 'Normal',
            color: '#4CAF50',
            description: 'Ideal weight, maintain current status',
            barWidth: 50,
        },
        {
            range: '25.0 – 29.9',
            category: 'Overweight',
            color: '#FF9800',
            description: 'Should lose weight to avoid health risks',
            barWidth: 72,
        },
        {
            range: '30.0 and above',
            category: 'Obese',
            color: '#F44336',
            description: 'Need serious weight loss, consult a doctor',
            barWidth: 100,
        },
    ];

    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                background: '#fff',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(19,102,186,0.12)',
                boxShadow: '0 4px 24px rgba(19,102,186,0.08)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '3px',
                    background: BRAND_GRADIENT,
                    zIndex: 2,
                },
            }}
        >
            <CardContent sx={{ p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{
                        width: 48, height: 48, borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(0,180,255,0.12), rgba(19,102,186,0.12))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(0,180,255,0.2)',
                        flexShrink: 0,
                    }}>
                        <Assessment sx={{ fontSize: 26, color: '#1366ba' }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{
                            fontWeight: 800, color: '#0d1b2a',
                            fontSize: { xs: '1.2rem', md: '1.4rem' },
                            lineHeight: 1.2, letterSpacing: '-0.3px',
                        }}>
                            BMI Index Table
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888', fontSize: '0.82rem', mt: 0.3 }}>
                            Classification according to WHO standards
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 3, borderColor: 'rgba(19,102,186,0.08)' }} />

                {/* Categories */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {bmiCategories.map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                p: 2,
                                borderRadius: '12px',
                                border: `1px solid ${item.color}22`,
                                background: `${item.color}06`,
                                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 6px 20px ${item.color}22`,
                                    background: `${item.color}0e`,
                                },
                            }}
                        >
                            {/* Top row */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography sx={{
                                    fontWeight: 700, fontSize: { xs: '0.95rem', md: '1rem' },
                                    color: '#0d1b2a', letterSpacing: '-0.2px',
                                }}>
                                    {item.range}
                                </Typography>
                                <Chip
                                    label={item.category}
                                    size="small"
                                    sx={{
                                        background: item.color,
                                        color: '#fff',
                                        fontWeight: 700, fontSize: '0.7rem',
                                        borderRadius: '8px', px: 0.5,
                                    }}
                                />
                            </Box>

                            {/* Progress bar */}
                            <Box sx={{
                                height: 5, borderRadius: 3,
                                background: `${item.color}20`,
                                overflow: 'hidden', mb: 1,
                            }}>
                                <Box sx={{
                                    height: '100%',
                                    width: `${item.barWidth}%`,
                                    background: item.color,
                                    borderRadius: 3,
                                }} />
                            </Box>

                            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.82rem', lineHeight: 1.55 }}>
                                {item.description}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* BMI image */}
                <Box
                    sx={{
                        mt: 3,
                        height: { xs: 110, md: 140 },
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid rgba(19,102,186,0.12)',
                        backgroundImage: 'url(/images/bmi.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        background: 'linear-gradient(135deg, rgba(0,180,255,0.08), rgba(19,102,186,0.08))',
                    }}
                />
            </CardContent>
        </Card>
    );
};

export default BMIChart;