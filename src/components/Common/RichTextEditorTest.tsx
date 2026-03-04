import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import RichTextEditor from './RichTextEditor';
import RichTextDisplay from './RichTextDisplay';

const RichTextEditorTest: React.FC = () => {
  const [content, setContent] = useState('<p>Type something here to test character counting...</p>');

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Rich Text Editor Test
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Editor (Max 500 characters)
        </Typography>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Start typing to test character counting..."
          maxLength={500}
          minHeight={200}
          helperText="Test the character counter functionality"
        />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Preview
        </Typography>
        <RichTextDisplay content={content} />
        
        <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption">
            Raw HTML: {content}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default RichTextEditorTest;