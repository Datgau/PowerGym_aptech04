import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const footerLinks = [
    { label: 'Privacy Policy',   href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Contact',          href: '/contact' },
    { label: 'Careers',          href: '/careers' },
];

const Copyright: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box sx={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            pt: 3, mt: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
        }}>
            <Typography variant="body2" sx={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: '0.8rem',
            }}>
                © {currentYear} PowerGym. All rights reserved.
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                {footerLinks.map(({ label, href }) => (
                    <Link
                        key={label}
                        href={href}
                        sx={{
                            color: 'rgba(255,255,255,0.35)',
                            textDecoration: 'none',
                            fontSize: '0.78rem',
                            fontWeight: 500,
                            transition: 'color 0.2s ease',
                            '&:hover': { color: '#00b4ff' },
                        }}
                    >
                        {label}
                    </Link>
                ))}
            </Box>
        </Box>
    );
};

export default Copyright;