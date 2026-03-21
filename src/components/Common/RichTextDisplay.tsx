import React from 'react';
import { Box, Typography } from '@mui/material';
import DOMPurify from 'dompurify';

interface RichTextDisplayProps {
  content: string;
  maxLines?: number;
  variant?: 'body1' | 'body2' | 'caption';
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({
  content,
  maxLines,
  variant = 'body2'
}) => {
  // Sanitize HTML to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a', 'ul', 'ol', 'li', 
      'blockquote', 'code', 'h1', 'h2', 'h3'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });

  return (
    <Box
      sx={{
        '& p': {
          margin: '0 0 8px 0',
          '&:last-child': {
            marginBottom: 0
          }
        },
        '& ul, & ol': {
          paddingLeft: 2,
          margin: '8px 0'
        },
        '& li': {
          marginBottom: '4px'
        },
        '& blockquote': {
          borderLeft: '3px solid #ddd',
          paddingLeft: 2,
          margin: '8px 0',
          fontStyle: 'italic',
          color: 'text.secondary'
        },
        '& code': {
          backgroundColor: 'grey.100',
          padding: '2px 4px',
          borderRadius: 1,
          fontSize: '0.875em',
          fontFamily: 'monospace'
        },
        '& a': {
          color: 'primary.main',
          textDecoration: 'underline',
          '&:hover': {
            color: 'primary.dark'
          }
        },
        '& strong, & b': {
          fontWeight: 600
        },
        '& em, & i': {
          fontStyle: 'italic'
        },
        '& u': {
          textDecoration: 'underline'
        },
        '& h1, & h2, & h3': {
          fontWeight: 600,
          margin: '16px 0 8px 0',
          '&:first-of-type': {
            marginTop: 0
          }
        },
        '& h1': {
          fontSize: '1.5rem'
        },
        '& h2': {
          fontSize: '1.25rem'
        },
        '& h3': {
          fontSize: '1.125rem'
        },
        ...(maxLines && {
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        })
      }}
    >
      <Typography
        variant={variant}
        component="div"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </Box>
  );
};

export default RichTextDisplay;