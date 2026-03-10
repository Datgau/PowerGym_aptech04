import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
    LocationOn,
    Phone,
    Email,
    AccessTime,
} from '@mui/icons-material';

const contactItems = [
    { icon: LocationOn, text: '37 Nguyen Van Ba, Thu Duc, Ho Chi Minh City' },
    { icon: Phone,      text: '(028) 3888 9999' },
    { icon: Email,      text: 'info@powergym.vn' },
    { icon: AccessTime, text: 'Mon – Sun: 5:00 AM – 11:00 PM' },
];

const CompanyInfo: React.FC = () => {
    return (
        <Box>
            <Typography variant="overline" sx={{
                color: '#00b4ff', fontWeight: 700,
                letterSpacing: '0.12em', fontSize: '0.7rem', display: 'block', mb: 1.5,
            }}>
                About Us
            </Typography>

            <Typography variant="body2" sx={{
                mb: 3,
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.75,
                fontSize: '0.88rem',
            }}>
                Leading fitness center with modern equipment and professional coaching staff,
                dedicated to helping you achieve your best self.
            </Typography>

            <List sx={{ p: 0 }}>
                {contactItems.map(({ icon: Icon, text }) => (
                    <ListItem key={text} sx={{ px: 0, py: 0.8, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: 34, mt: 0.2 }}>
                            <Icon sx={{ color: '#1366ba', fontSize: 18 }} />
                        </ListItemIcon>
                        <ListItemText
                            primary={text}
                            sx={{
                                m: 0,
                                '& .MuiListItemText-primary': {
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '0.85rem',
                                    lineHeight: 1.55,
                                },
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default CompanyInfo;