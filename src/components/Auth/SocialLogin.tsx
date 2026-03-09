import { Box, Button, Typography } from '@mui/material';

interface SocialLoginProps {
    onGoogleLogin: () => void;
    onFacebookLogin: () => void;
}

const SocialLogin = ({ onGoogleLogin, onFacebookLogin }: SocialLoginProps) => {
    return (
        <Box>
            {/* Divider */}
            <Box
                sx={{
                    position: 'relative',
                    textAlign: 'center',
                    my: 3,
                    '&::before, &::after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        width: '45%',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #e4e7ec, transparent)',
                    },
                    '&::before': { left: 0 },
                    '&::after': { right: 0 }
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        color: '#98a2b3',
                        fontWeight: 500,
                        fontSize: '0.85rem'
                    }}
                >
                    Or continue with
                </Typography>
            </Box>

            {/* Social Buttons */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: 2
                }}
            >
                {/* Google Button */}
                <Button
                    onClick={onGoogleLogin}
                    variant="outlined"
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '16px',
                        border: '2px solid transparent',
                        background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #4285F4, #34A853, #FBBC05, #EA4335) border-box',
                        py: 1.5,
                        px: 3,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: '#1f2937',
                        boxShadow: '0 4px 12px rgba(66, 133, 244, 0.15)',
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.1), rgba(52, 168, 83, 0.1))',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                        },
                        '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 8px 24px rgba(66, 133, 244, 0.3)',
                            '&::before': {
                                opacity: 1,
                            }
                        },
                        '&:active': {
                            transform: 'translateY(-1px)',
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
                        <svg viewBox="0 0 24 24" width="22" height="22">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        <span>Google</span>
                    </Box>
                </Button>

                {/* Facebook Button */}
                <Button
                    onClick={onFacebookLogin}
                    variant="outlined"
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '16px',
                        border: '2px solid transparent',
                        background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #0866FF, #0a7cff) border-box',
                        py: 1.5,
                        px: 3,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: '#1f2937',
                        boxShadow: '0 4px 12px rgba(8, 102, 255, 0.15)',
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(135deg, rgba(8, 102, 255, 0.1), rgba(10, 124, 255, 0.1))',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                        },
                        '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 8px 24px rgba(8, 102, 255, 0.3)',
                            '&::before': {
                                opacity: 1,
                            }
                        },
                        '&:active': {
                            transform: 'translateY(-1px)',
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="#0866FF">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span>Facebook</span>
                    </Box>
                </Button>
            </Box>
        </Box>

    );
};

export default SocialLogin;