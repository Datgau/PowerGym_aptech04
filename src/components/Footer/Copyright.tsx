import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Copyright: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box 
            sx={{ 
                borderTop: '1px solid #333',
                pt: 2,
                mt: 2,
                textAlign: 'center'
            }}
        >
            <Typography 
                variant="body2" 
                sx={{ 
                    color: '#888',
                    fontSize: '0.85rem',
                    mb: 1
                }}
            >
                © {currentYear} PowerGym. Tất cả quyền được bảo lưu.
            </Typography>

            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 3,
                    flexWrap: 'wrap'
                }}
            >
                <Link 
                    href="/privacy-policy" 
                    sx={{ 
                        color: '#ccc',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        '&:hover': {
                            color: '#00a1e4',
                            textDecoration: 'underline'
                        }
                    }}
                >
                    Chính sách bảo mật
                </Link>

                <Link 
                    href="/terms-of-service" 
                    sx={{ 
                        color: '#ccc',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        '&:hover': {
                            color: '#00a1e4',
                            textDecoration: 'underline'
                        }
                    }}
                >
                    Điều khoản dịch vụ
                </Link>

                <Link 
                    href="/contact" 
                    sx={{ 
                        color: '#ccc',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        '&:hover': {
                            color: '#00a1e4',
                            textDecoration: 'underline'
                        }
                    }}
                >
                    Liên hệ
                </Link>

                <Link 
                    href="/careers" 
                    sx={{ 
                        color: '#ccc',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        '&:hover': {
                            color: '#00a1e4',
                            textDecoration: 'underline'
                        }
                    }}
                >
                    Tuyển dụng
                </Link>
            </Box>
        </Box>
    );
};

export default Copyright;