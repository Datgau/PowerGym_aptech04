import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import {
    Facebook,
    Instagram,
    YouTube,
    Twitter,
    LinkedIn
} from '@mui/icons-material';

const socialLinks = [
    {
        name: 'Facebook',
        icon: Facebook,
        url: 'https://facebook.com/powergym',
        color: '#1877F2'
    },
    {
        name: 'Instagram',
        icon: Instagram,
        url: 'https://instagram.com/powergym',
        color: '#E4405F'
    },
    {
        name: 'YouTube',
        icon: YouTube,
        url: 'https://youtube.com/powergym',
        color: '#FF0000'
    },
    {
        name: 'Twitter',
        icon: Twitter,
        url: 'https://twitter.com/powergym',
        color: '#1DA1F2'
    },
    {
        name: 'LinkedIn',
        icon: LinkedIn,
        url: 'https://linkedin.com/company/powergym',
        color: '#0A66C2'
    }
];

const SocialLinks: React.FC = () => {
    return (
        <Box
            sx={{
                textAlign: 'center',
                borderTop: '1px solid #333',
                pt: 3
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    mb: 2,
                    color: '#00a1e4',
                    fontWeight: 'bold'
                }}
            >
                Connect With Us
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                        <IconButton
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: '#ccc',
                                backgroundColor: '#2a2a2a',
                                border: '1px solid #444',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    color: social.color,
                                    backgroundColor: '#333',
                                    transform: 'translateY(-2px)',
                                    borderColor: social.color
                                }
                            }}
                        >
                            <IconComponent />
                        </IconButton>
                    );
                })}
            </Box>

            <Typography
                variant="body2"
                sx={{
                    mt: 2,
                    color: '#888',
                    fontSize: '0.85rem'
                }}
            >
                Follow us to stay updated with the latest news and updates
            </Typography>
        </Box>
    );
};

export default SocialLinks;