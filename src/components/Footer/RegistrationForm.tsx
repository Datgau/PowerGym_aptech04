import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Send } from '@mui/icons-material';

interface FormData {
    phone: string;
    email: string;
}

const BRAND_GRADIENT = 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)';

const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.05)',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
        '&:hover fieldset': { borderColor: '#00b4ff' },
        '&.Mui-focused fieldset': { borderColor: '#1366ba', borderWidth: 2 },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#00b4ff' },
    '& .MuiInputBase-input': { color: '#fff', fontSize: '0.9rem' },
};

const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ phone: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (message) setMessage(null);
    };

    const validateForm = (): boolean => {
        if (!formData.phone.trim()) { setMessage({ type: 'error', text: 'Please enter phone number' }); return false; }
        if (!formData.email.trim()) { setMessage({ type: 'error', text: 'Please enter email' }); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setMessage({ type: 'error', text: 'Invalid email' }); return false; }
        if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) { setMessage({ type: 'error', text: 'Invalid phone number' }); return false; }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setMessage({ type: 'success', text: 'Registration successful! We will contact you soon.' });
            setFormData({ phone: '', email: '' });
        } catch {
            setMessage({ type: 'error', text: 'An error occurred. Please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="overline" sx={{
                color: '#00b4ff', fontWeight: 700,
                letterSpacing: '0.12em', fontSize: '0.7rem', display: 'block', mb: 1.5,
            }}>
                Stay Updated
            </Typography>

            <Typography variant="body2" sx={{
                mb: 3, color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.75, fontSize: '0.88rem',
            }}>
                Leave your information to receive free consultation and special offers from PowerGym.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth label="Phone Number" variant="outlined"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    disabled={loading}
                    sx={{ ...inputSx, mb: 2 }}
                />

                <TextField
                    fullWidth label="Email" type="email" variant="outlined"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    disabled={loading}
                    sx={{ ...inputSx, mb: message ? 2 : 3 }}
                />

                {message && (
                    <Alert
                        severity={message.type}
                        sx={{
                            mb: 2, borderRadius: '10px',
                            background: message.type === 'success' ? 'rgba(76,175,80,0.12)' : 'rgba(244,67,54,0.12)',
                            border: `1px solid ${message.type === 'success' ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)'}`,
                            color: '#fff',
                            '& .MuiAlert-icon': { color: message.type === 'success' ? '#4CAF50' : '#F44336' },
                        }}
                    >
                        {message.text}
                    </Alert>
                )}

                <Button
                    type="submit" fullWidth variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <Send sx={{ fontSize: 18 }} />}
                    sx={{
                        background: BRAND_GRADIENT,
                        color: '#fff',
                        py: 1.4,
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        boxShadow: '0 4px 16px rgba(4,86,104,0.3)',
                        '&:hover': { boxShadow: '0 8px 24px rgba(4,86,104,0.45)', background: BRAND_GRADIENT },
                        '&.Mui-disabled': { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' },
                    }}
                >
                    {loading ? 'Sending...' : 'Register Now'}
                </Button>
            </Box>
        </Box>
    );
};

export default RegistrationForm;