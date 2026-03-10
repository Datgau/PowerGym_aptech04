import React from 'react';
import { Box, Typography } from '@mui/material';

const ContactMap: React.FC = () => {
    return (
        <Box>
            <Typography variant="overline" sx={{
                color: '#00b4ff', fontWeight: 700,
                letterSpacing: '0.12em', fontSize: '0.7rem', display: 'block', mb: 1.5,
            }}>
                Our Location
            </Typography>

            <Typography variant="body2" sx={{
                mb: 2.5, color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.75, fontSize: '0.88rem',
            }}>
                Easily find your way to PowerGym with our convenient location.
            </Typography>

            <Box sx={{
                width: '100%',
                height: 260,
                borderRadius: '12px',
                overflow: 'hidden',
                outline: '1.5px solid rgba(19,102,186,0.35)',
                outlineOffset: '-1.5px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                transition: 'outline-color 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    outlineColor: '#00b4ff',
                    boxShadow: '0 8px 32px rgba(19,102,186,0.25)',
                },
                '& iframe': { width: '100%', height: '100%', border: 'none', display: 'block' },
            }}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.537313335366!2d106.76883847476711!3d10.846676657894555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175270a6de1118f%3A0x6e6eb0095fe746cb!2zMzcgxJAuIE5ndXnhu4VuIFbEg24gQsOhLCBCw6xuaCBUaOG7jSwgVGjhu6cgxJDhu6ljLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmggNzIwMTAwLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1768747944009!5m2!1svi!2s"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="PowerGym Location"
                />
            </Box>
        </Box>
    );
};

export default ContactMap;