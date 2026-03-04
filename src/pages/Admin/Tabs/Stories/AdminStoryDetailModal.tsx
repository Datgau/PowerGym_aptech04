import React from 'react';
import {
  Box, Button, Stack, Chip, Menu, MenuItem,
  ListItemIcon, ListItemText, Typography, Divider
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Schedule as PendingIcon
} from '@mui/icons-material';
import StoryDetailModal from '../../../Home/StoriesSection/StoryDetailModal';
import type { StoryItem } from '../../../../services/storyService';

interface AdminStoryDetailModalProps {
  open: boolean;
  story: StoryItem | null;
  onClose: () => void;
  onApprove?: (storyId: string) => void;
  onReject?: (storyId: string) => void;
  onUpdateStatus?: (storyId: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') => void;
  actionLoading?: string | null;
}

const AdminStoryDetailModal: React.FC<AdminStoryDetailModalProps> = ({
                                                                       open, story, onClose,
                                                                      onUpdateStatus, actionLoading
                                                                     }) => {
  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);


  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleStatusUpdate = (newStatus: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    if (story) {
      if (newStatus === 'REJECTED') {
        if (confirm('Are you sure? Rejected stories cannot be updated and will be deleted when expired.')) {
          onUpdateStatus?.(story.id, newStatus);
        }
      } else {
        onUpdateStatus?.(story.id, newStatus);
      }
    }
    handleMenuClose();
  };

  const adminFooter = story ? (
      <Box
          sx={{
            width: '100%',
            px: 3,
            py: 2,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Label */}
          <Box sx={{ flexShrink: 0 }}>
            <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}
            >
              Admin
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

            {/* Actions */}
            {story.status === 'PENDING' && (
                <Stack direction="row" spacing={1.5} sx={{ flex: 1 }}>
                    <Button
                        variant="contained"
                        color="info"
                        onClick={() => onUpdateStatus?.(story.id, 'APPROVED')}
                        disabled={actionLoading === story.id}
                    >
                        {actionLoading === story.id ? 'Approving...' : 'Approve Story'}
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => onUpdateStatus?.(story.id, 'REJECTED')}
                        disabled={actionLoading === story.id}
                    >
                        {actionLoading === story.id ? 'Rejecting...' : 'Reject Story'}
                    </Button>
                </Stack>
            )}

            {story.status === 'APPROVED' && (
                <Stack direction="row" spacing={1.5} sx={{ flex: 1 }}>
                    <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => onUpdateStatus?.(story.id, 'PENDING')}
                        disabled={actionLoading === story.id}
                    >
                        Set to Pending
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => onUpdateStatus?.(story.id, 'REJECTED')}
                        disabled={actionLoading === story.id}
                    >
                        Reject Story
                    </Button>
                </Stack>
            )}

            {story.status === 'REJECTED' && (
                <Chip
                    label="Rejected — Will be deleted"
                    color="error"
                />
            )}
        </Stack>
      </Box>
  ) : undefined;

  return (
      <>
        <StoryDetailModal
            open={open}
            story={story}
            onClose={onClose}
            adminActions={adminFooter}
        />

        {/* Status Update Menu */}
        <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 200 }
            }}
        >
          {story?.status !== 'PENDING' && (
              <MenuItem onClick={() => handleStatusUpdate('PENDING')}>
                <ListItemIcon><PendingIcon fontSize="small" color="warning" /></ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Set to Pending</ListItemText>
              </MenuItem>
          )}
          {story?.status !== 'APPROVED' && (
              <MenuItem onClick={() => handleStatusUpdate('APPROVED')}>
                <ListItemIcon><ApproveIcon fontSize="small" color="success" /></ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Set to Approved</ListItemText>
              </MenuItem>
          )}
          {story?.status !== 'REJECTED' && (
              <MenuItem onClick={() => handleStatusUpdate('REJECTED')}>
                <ListItemIcon><RejectIcon fontSize="small" color="error" /></ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Set to Rejected</ListItemText>
              </MenuItem>
          )}
        </Menu>
      </>
  );
};

export default AdminStoryDetailModal;