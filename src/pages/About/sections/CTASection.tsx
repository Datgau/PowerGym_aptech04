import React from 'react';
import { Box, Container, Button, Zoom } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { TOKEN } from '../constants';

interface CTASectionProps {
    show: boolean;
    onNavigate: (path: string) => void;
}

const CTASection: React.FC<CTASectionProps> = ({ show, onNavigate }) => {
    return (
        <Box
            sx={{
                py: { xs: 8, md: 12 },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                <Zoom in={show} timeout={600}>
                    <Box>
                        <Button
                            onClick={() => onNavigate('/pricing')}
                            endIcon={<ArrowForward />}
                            sx={{
                                px: 5,
                                py: 1.8,
                                fontSize: '1rem',
                                fontWeight: 600,
                                borderRadius: 3,
                                textTransform: 'none',
                                color: '#fff',
                                background: 'linear-gradient(135deg, #00b4ff, #0090cc)',
                                boxShadow: '0 10px 30px rgba(0,180,255,0.4)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 15px 40px rgba(0,180,255,0.6)',
                                },
                            }}
                        >
                            Get Started Now
                        </Button>
                    </Box>
                </Zoom>
            </Container>
        </Box>
    );
};

export default CTASection;