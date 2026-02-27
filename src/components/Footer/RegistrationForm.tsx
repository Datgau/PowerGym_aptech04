import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Alert,
    CircularProgress
} from '@mui/material';
import { Send } from '@mui/icons-material';

interface FormData {
    phone: string;
    email: string;
}

const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        phone: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleInputChange = (field: keyof FormData) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        // Clear message when user starts typing
        if (message) setMessage(null);
    };

    const validateForm = (): boolean => {
        if (!formData.phone.trim()) {
            setMessage({ type: 'error', text: 'Please enter phone number' });
            return false;
        }
        if (!formData.email.trim()) {
            setMessage({ type: 'error', text: 'Please enter email' });
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setMessage({ type: 'error', text: 'Invalid email' });
            return false;
        }
        if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
            setMessage({ type: 'error', text: 'Invalid phone number' });
            return false;
        }
        return true;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setMessage({ 
                type: 'success', 
                text: 'Registration successful! We will contact you soon.' 
            });
            
            // Reset form
            setFormData({ phone: '', email: '' });
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: 'An error occurred. Please try again later.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography 
                variant="h6" 
                sx={{ 
                    fontWeight: 'bold',
                    mb: 3,
                    color: '#00a1e4',
                    textTransform: 'uppercase'
                }}
            >
                Subscribe for Updates
            </Typography>

            <Typography 
                variant="body2" 
                sx={{ 
                    mb: 3, 
                    color: '#ccc',
                    lineHeight: 1.5
                }}
            >
                Leave your information to receive free consultation and special offers from PowerGym
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Phone Number"
                    variant="outlined"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    disabled={loading}
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#2a2a2a',
                            '& fieldset': {
                                borderColor: '#555'
                            },
                            '&:hover fieldset': {
                                borderColor: '#00a1e4'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#00a1e4'
                            }
                        },
                        '& .MuiInputLabel-root': {
                            color: '#ccc'
                        },
                        '& .MuiInputBase-input': {
                            color: '#fff'
                        }
                    }}
                />

                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    disabled={loading}
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#2a2a2a',
                            '& fieldset': {
                                borderColor: '#555'
                            },
                            '&:hover fieldset': {
                                borderColor: '#00a1e4'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#00a1e4'
                            }
                        },
                        '& .MuiInputLabel-root': {
                            color: '#ccc'
                        },
                        '& .MuiInputBase-input': {
                            color: '#fff'
                        }
                    }}
                />

                {message && (
                    <Alert 
                        severity={message.type} 
                        sx={{ mb: 2 }}
                    >
                        {message.text}
                    </Alert>
                )}

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                    sx={{
                        backgroundColor: '#00a1e4',
                        color: '#fff',
                        py: 1.5,
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        '&:hover': {
                            backgroundColor: '#0088cc'
                        },
                        '&:disabled': {
                            backgroundColor: '#555'
                        }
                    }}
                >
                    {loading ? 'Sending...' : 'Register Now'}
                </Button>
            </Box>
        </Box>
    );
};

export default RegistrationForm;