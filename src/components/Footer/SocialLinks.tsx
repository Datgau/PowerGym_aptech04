import React from 'react';
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import { Facebook, Instagram, YouTube, Twitter, LinkedIn } from '@mui/icons-material';

const socialLinks = [
    { name: 'Facebook',  icon: Facebook,  url: 'https://facebook.com/powergym',            color: '#1877F2' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/powergym',           color: '#E4405F' },
    { name: 'YouTube',   icon: YouTube,   url: 'https://youtube.com/powergym',             color: '#FF0000' },
    { name: 'Twitter',   icon: Twitter,   url: 'https://twitter.com/powergym',             color: '#1DA1F2' },
    { name: 'LinkedIn',  icon: LinkedIn,  url: 'https://linkedin.com/company/powergym',    color: '#0A66C2' },
];

const SocialLinks: React.FC = () => {
    return (
        <Box sx={{
            pt: 4,
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
        }}>
            <Typography variant="body2" sx={{
                color: 'rgba(255,255,255,0.35)',
                fontSize: '0.82rem',
            }}>
                Follow us to stay updated with the latest news and offers
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
                {socialLinks.map(({ name, icon: Icon, url, color }) => (
                    <Tooltip key={name} title={name} placement="top" arrow>
                        <IconButton
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            sx={{
                                color: 'rgba(255,255,255,0.45)',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                width: 38, height: 38,
                                borderRadius: '10px',
                                transition: 'all 0.25s ease',
                                '&:hover': {
                                    color,
                                    background: `${color}18`,
                                    borderColor: `${color}60`,
                                    transform: 'translateY(-3px)',
                                    boxShadow: `0 6px 16px ${color}30`,
                                },
                            }}
                        >
                            <Icon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>
                ))}
            </Box>
        </Box>
    );
};

export default SocialLinks;