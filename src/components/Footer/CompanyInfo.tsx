import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { 
    LocationOn, 
    Phone, 
    Email, 
    AccessTime,
    FitnessCenter 
} from '@mui/icons-material';

const CompanyInfo: React.FC = () => {
    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FitnessCenter sx={{ fontSize: 32, color: '#00a1e4', mr: 1 }} />
                <Typography 
                    variant="h5" 
                    sx={{ 
                        fontWeight: 'bold',
                        color: '#00a1e4',
                        textTransform: 'uppercase'
                    }}
                >
                    PowerGym
                </Typography>
            </Box>

            <Typography 
                variant="body1" 
                sx={{ 
                    mb: 3, 
                    lineHeight: 1.6,
                    color: '#ccc'
                }}
            >
                Leading fitness center with modern equipment 
                and professional coaching staff.
            </Typography>

            <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <LocationOn sx={{ color: '#00a1e4' }} />
                    </ListItemIcon>
                    <ListItemText 
                        primary="37 Nguyen Van Ba, Thu Duc, Ho Chi Minh City"
                        sx={{ 
                            '& .MuiListItemText-primary': { 
                                color: '#ccc',
                                fontSize: '0.9rem'
                            }
                        }}
                    />
                </ListItem>

                <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <Phone sx={{ color: '#00a1e4' }} />
                    </ListItemIcon>
                    <ListItemText 
                        primary="(028) 3888 9999"
                        sx={{ 
                            '& .MuiListItemText-primary': { 
                                color: '#ccc',
                                fontSize: '0.9rem'
                            }
                        }}
                    />
                </ListItem>

                <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <Email sx={{ color: '#00a1e4' }} />
                    </ListItemIcon>
                    <ListItemText 
                        primary="info@powergym.vn"
                        sx={{ 
                            '& .MuiListItemText-primary': { 
                                color: '#ccc',
                                fontSize: '0.9rem'
                            }
                        }}
                    />
                </ListItem>

                <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <AccessTime sx={{ color: '#00a1e4' }} />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Mon - Sun: 5:00 AM - 11:00 PM"
                        sx={{ 
                            '& .MuiListItemText-primary': { 
                                color: '#ccc',
                                fontSize: '0.9rem'
                            }
                        }}
                    />
                </ListItem>
            </List>
        </Box>
    );
};

export default CompanyInfo;