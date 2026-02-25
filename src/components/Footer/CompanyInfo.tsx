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
                Trung tâm thể dục thể thao hàng đầu với trang thiết bị hiện đại 
                và đội ngũ huấn luyện viên chuyên nghiệp.
            </Typography>

            <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <LocationOn sx={{ color: '#00a1e4' }} />
                    </ListItemIcon>
                    <ListItemText 
                        primary="37 Nguyễn Văn Bá, Thủ Đức, Thành Phố Hồ Chí Minh"
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
                        primary="Thứ 2 - CN: 5:00 - 23:00"
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