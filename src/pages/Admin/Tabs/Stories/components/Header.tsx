import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@mui/icons-material';

interface HeaderProps {
  loading: boolean;
  onAddStory: () => void;
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({
  loading,
  onAddStory,
  onRefresh
}) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h5" fontWeight={600}>
        Stories Management
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
            sx={{
              background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
            }}
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddStory}
          size="small"
        >
          Add Story
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>
    </Box>
  );
};

export default Header;