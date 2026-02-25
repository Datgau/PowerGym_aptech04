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
            setMessage({ type: 'error', text: 'Vui lòng nhập số điện thoại' });
            return false;
        }
        if (!formData.email.trim()) {
            setMessage({ type: 'error', text: 'Vui lòng nhập email' });
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setMessage({ type: 'error', text: 'Email không hợp lệ' });
            return false;
        }
        if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
            setMessage({ type: 'error', text: 'Số điện thoại không hợp lệ' });
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
                text: 'Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.' 
            });
            
            // Reset form
            setFormData({ phone: '', email: '' });
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: 'Có lỗi xảy ra. Vui lòng thử lại sau.' 
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
                Đăng ký nhận thông tin
            </Typography>

            <Typography 
                variant="body2" 
                sx={{ 
                    mb: 3, 
                    color: '#ccc',
                    lineHeight: 1.5
                }}
            >
                Để lại thông tin để nhận tư vấn miễn phí và các ưu đãi đặc biệt từ PowerGym
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Số điện thoại"
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
                    {loading ? 'Đang gửi...' : 'Đăng ký ngay'}
                </Button>
            </Box>
        </Box>
    );
};

export default RegistrationForm;