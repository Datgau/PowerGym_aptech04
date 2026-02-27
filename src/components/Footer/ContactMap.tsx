import React from 'react';
import { Box, Typography } from '@mui/material';

const ContactMap: React.FC = () => {
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
                Our Location
            </Typography>

            <Box
                sx={{
                    width: '100%',
                    height: 300,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '2px solid #333',
                    '& iframe': {
                        width: '100%',
                        height: '100%',
                        border: 'none'
                    }
                }}
            >
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.537313335366!2d106.76883847476711!3d10.846676657894555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175270a6de1118f%3A0x6e6eb0095fe746cb!2zMzcgxJAuIE5ndXnhu4VuIFbEg24gQsOhLCBCw6xuaCBUaOG7jSwgVGjhu6cgxJDhu6ljLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmggNzIwMTAwLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1768747944009!5m2!1svi!2s"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="PowerGym"
                />
            </Box>

            <Typography
                variant="body2"
                sx={{
                    mt: 2,
                    color: '#ccc',
                    textAlign: 'center',
                    fontStyle: 'italic'
                }}
            >
                Easily find your way to PowerGym with our convenient location
            </Typography>
        </Box>
    );
};

export default ContactMap;