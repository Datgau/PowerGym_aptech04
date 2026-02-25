import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import CompanyInfo from './CompanyInfo';
import ContactMap from './ContactMap';
import RegistrationForm from './RegistrationForm';
import SocialLinks from './SocialLinks';
import Copyright from './Copyright';

const Footer: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#1a1a1a',
                color: '#fff',
                pt: 6,
                pb: 2,
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    {/* Thông tin công ty */}
                    <Grid item xs={12} md={4}>
                        <CompanyInfo />
                    </Grid>
                    {/* Form đăng ký */}
                    <Grid item xs={12} md={4}>
                        <RegistrationForm />
                    </Grid>
                    {/* Bản đồ */}
                    <Grid item xs={12} md={4}>
                        <ContactMap />
                    </Grid>
                </Grid>

                {/* Social Links */}
                <Box sx={{ mt: 4, mb: 2 }}>
                    <SocialLinks />
                </Box>

                {/* Copyright */}
                <Copyright />
            </Container>
        </Box>
    );
};

export default Footer;