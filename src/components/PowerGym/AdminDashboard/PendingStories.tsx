import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Stack
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { storyService, type StoryItem } from '../../../services/storyService';

const PendingStories: React.FC = () => {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPendingStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await storyService.getPendingStories();
      if (response.success && response.data) {
        setStories(response.data);
      } else {
        setError('Failed to fetch pending stories');
      }
    } catch (err: any) {
      console.error('Failed to fetch pending stories:', err);
      setError(err.response?.data?.message || 'Failed to fetch pending stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingStories();
  }, []);

  const handleApprove = async (storyId: string) => {
    setActionLoading(storyId);
    try {
      const response = await storyService.approveStory(storyId);
      if (response.success) {
        // Remove from pending list
        setStories(stories.filter(s => s.id !== storyId));
        setViewDialogOpen(false);
      }
    } catch (err: any) {
      console.error('Failed to approve story:', err);
      alert(err.response?.data?.message || 'Failed to approve story');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (storyId: string) => {
    if (!confirm('Are you sure you want to reject this story? This action cannot be undone.')) {
      return;
    }

    setActionLoading(storyId);
    try {
      const response = await storyService.rejectStory(storyId);
      if (response.success) {
        // Remove from pending list
        setStories(stories.filter(s => s.id !== storyId));
        setViewDialogOpen(false);
      }
    } catch (err: any) {
      console.error('Failed to reject story:', err);
      alert(err.response?.data?.message || 'Failed to reject story');
    } finally {
      setActionLoading(null);
    }
  };

  const handleView = (story: StoryItem) => {
    setSelectedStory(story);
    setViewDialogOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (stories.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Pending Stories
        </Typography>
        <Typography variant="body2" color="text.secondary">
          All stories have been reviewed
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Pending Stories ({stories.length})
        </Typography>
        <Button
          variant="outlined"
          onClick={fetchPendingStories}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        {stories.map((story) => (
          <Grid item xs={12} sm={6} md={4} key={story.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={story.imageUrl}
                alt={story.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <Avatar
                    src={story.userAvatar}
                    alt={story.userName}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {story.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {story.timeAgo || 'Just now'}
                    </Typography>
                  </Box>
                </Stack>

                <Typography variant="h6" gutterBottom noWrap>
                  {story.title}
                </Typography>

                {story.tag && (
                  <Chip
                    label={story.tag}
                    size="small"
                    color="primary"
                    sx={{ mb: 1 }}
                  />
                )}

                {story.content && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {story.content}
                  </Typography>
                )}

                <Stack direction="row" spacing={1} mt={2}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    onClick={() => handleView(story)}
                    fullWidth
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<ApproveIcon />}
                    onClick={() => handleApprove(story.id)}
                    disabled={actionLoading === story.id}
                    fullWidth
                  >
                    {actionLoading === story.id ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    startIcon={<RejectIcon />}
                    onClick={() => handleReject(story.id)}
                    disabled={actionLoading === story.id}
                    fullWidth
                  >
                    Reject
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* View Story Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedStory && (
          <>
            <DialogTitle>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={selectedStory.userAvatar}
                  alt={selectedStory.userName}
                />
                <Box>
                  <Typography variant="h6">{selectedStory.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    by {selectedStory.userName} • {selectedStory.timeAgo || 'Just now'}
                  </Typography>
                </Box>
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              <Box
                component="img"
                src={selectedStory.imageUrl}
                alt={selectedStory.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 500,
                  objectFit: 'contain',
                  mb: 2,
                  borderRadius: 1
                }}
              />

              {selectedStory.tag && (
                <Chip
                  label={selectedStory.tag}
                  color="primary"
                  sx={{ mb: 2 }}
                />
              )}

              {selectedStory.content && (
                <Typography variant="body1" paragraph>
                  {selectedStory.content}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<RejectIcon />}
                onClick={() => handleReject(selectedStory.id)}
                disabled={actionLoading === selectedStory.id}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<ApproveIcon />}
                onClick={() => handleApprove(selectedStory.id)}
                disabled={actionLoading === selectedStory.id}
              >
                Approve
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default PendingStories;
