import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import type { StoryStatus, StoryStats } from '../types';

interface EmptyStateProps {
  statusFilter: StoryStatus;
  stats: StoryStats;
  onStatusFilterChange: (status: StoryStatus) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  statusFilter,
  stats,
  onStatusFilterChange
}) => {
  const getEmptyMessage = () => {
    switch (statusFilter) {
      case 'ALL':
        return {
          title: 'No Stories Found',
          description: 'No stories have been created yet'
        };
      case 'PENDING':
        return {
          title: 'No Pending Stories',
          description: 'All stories have been reviewed'
        };
      case 'APPROVED':
        return {
          title: 'No Approved Stories',
          description: 'No stories have been approved yet. Approve some pending stories to see them here.'
        };
      case 'REJECTED':
        return {
          title: 'No Rejected Stories',
          description: 'No stories have been rejected yet.'
        };
      default:
        return {
          title: 'No Stories Found',
          description: 'No stories match the current filter'
        };
    }
  };

  const { title, description } = getEmptyMessage();

  return (
    <Box textAlign="center" py={8}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>
      
      {statusFilter === 'APPROVED' && stats.pending > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => onStatusFilterChange('PENDING')}
          sx={{ mt: 2 }}
        >
          View {stats.pending} Pending Stories
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;