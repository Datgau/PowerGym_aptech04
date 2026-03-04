import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Paper,
  Divider,
  Menu,
  ListItemIcon,
  ListItemText, Snackbar
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Assessment as StatsIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  Schedule as PendingIcon
} from '@mui/icons-material';
import { storyService, type StoryItem } from '../../../../services/storyService.ts';
import TablePagination from '../../../../components/Common/TablePagination';
import { usePagination } from '../../../../hooks/usePagination';
import RichTextDisplay from '../../../../components/Common/RichTextDisplay';
import AdminStoryDetailModal from './AdminStoryDetailModal';
import ShareStoryModal from '../../../Home/StoriesSection/ShareStoryModal';

type StoryStatus = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

interface StoryStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

const AdminStoriesManagement: React.FC = () => {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StoryStatus>('PENDING');
  const [menuAnchor, setMenuAnchor] = useState<{ [key: string]: HTMLElement | null }>({});
  const [stats, setStats] = useState<StoryStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(12);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (_: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };


  useEffect(() => {
    fetchStories(statusFilter, paginationState.page, paginationState.rowsPerPage);
    fetchStats();
  }, [statusFilter, paginationState.page, paginationState.rowsPerPage]);

  const fetchStats = async () => {
    try {
      const results = await Promise.allSettled([
        storyService.countPendingStories(),
        storyService.countApprovedStories(),
        storyService.countRejectedStories()
      ]);

      let pending = results[0].status === 'fulfilled' && results[0].value.success ? results[0].value.data : 0;
      let approved = results[1].status === 'fulfilled' && results[1].value.success ? results[1].value.data : 0;
      let rejected = results[2].status === 'fulfilled' && results[2].value.success ? results[2].value.data : 0;

      if (pending === 0 && approved === 0 && rejected === 0) {
        try {
          const [pendingRes, approvedRes, rejectedRes] = await Promise.allSettled([
            storyService.getPendingStoriesLegacy(),
            storyService.getStoriesByStatusLegacy('APPROVED'),
            storyService.getStoriesByStatusLegacy('REJECTED')
          ]);
          
          pending = pendingRes.status === 'fulfilled' && pendingRes.value.success ? pendingRes.value.data.length : 0;
          approved = approvedRes.status === 'fulfilled' && approvedRes.value.success ? approvedRes.value.data.length : 0;
          rejected = rejectedRes.status === 'fulfilled' && rejectedRes.value.success ? rejectedRes.value.data.length : 0;
        } catch (fallbackErr) {
          console.error('Fallback stats calculation failed:', fallbackErr);
        }
      }

      setStats({
        pending,
        approved,
        rejected,
        total: pending + approved + rejected
      });
    } catch (err) {
      setStats({
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0
      });
    }
  };

  const fetchStories = async (status: StoryStatus, page: number = 0, size: number = 12) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      
      if (status === 'ALL') {
        try {
          response = await storyService.getAllStoriesForAdmin(page, size);
        } catch (err: any) {
          const [pendingRes, approvedRes, rejectedRes] = await Promise.allSettled([
            storyService.getPendingStoriesLegacy(),
            storyService.getStoriesByStatusLegacy('APPROVED'),
            storyService.getStoriesByStatusLegacy('REJECTED')
          ]);
          
          const allStories: StoryItem[] = [];
          if (pendingRes.status === 'fulfilled' && pendingRes.value.success) {
            allStories.push(...pendingRes.value.data);
          }
          if (approvedRes.status === 'fulfilled' && approvedRes.value.success) {
            allStories.push(...approvedRes.value.data);
          }
          if (rejectedRes.status === 'fulfilled' && rejectedRes.value.success) {
            allStories.push(...rejectedRes.value.data);
          }
          
          allStories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          const startIndex = page * size;
          const endIndex = startIndex + size;
          const paginatedStories = allStories.slice(startIndex, endIndex);
          
          response = {
            success: true,
            data: {
              content: paginatedStories,
              totalElements: allStories.length,
              totalPages: Math.ceil(allStories.length / size),
              number: page,
              size: size
            }
          };
        }
      } else if (status === 'PENDING') {
        response = await storyService.getPendingStories(page, size);
      } else {
        try {
          response = await storyService.getStoriesByStatus(status, page, size);
        } catch (err: any) {
          const legacyResponse = await storyService.getStoriesByStatusLegacy(status);
          if (legacyResponse.success) {
            const allStories = legacyResponse.data;
            const startIndex = page * size;
            const endIndex = startIndex + size;
            const paginatedStories = allStories.slice(startIndex, endIndex);
            
            response = {
              success: true,
              data: {
                content: paginatedStories,
                totalElements: allStories.length,
                totalPages: Math.ceil(allStories.length / size),
                number: page,
                size: size
              }
            };
          } else {
            throw new Error('Legacy method also failed');
          }
        }
      }

      if (response.success && response.data) {
        const pageData = response.data;
        setStories(pageData.content || []);
        setPaginationData(pageData.totalPages || 0, pageData.totalElements || 0);
      } else {
        setStories([]);
        setPaginationData(0, 0);
      }
    } catch (err: any) {
      setStories([]);
      setPaginationData(0, 0);
      
      if (err.response?.status === 401) {
        setError('Authentication required. Please login as admin.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch stories');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (newStatus: StoryStatus) => {
    setStatusFilter(newStatus);
    handleChangePage(null, 0);
  };

  const handleApprove = async (storyId: string) => {
    setActionLoading(storyId);
    try {
      const response = await storyService.approveStory(storyId);
      if (response.success) {
        await fetchStories(statusFilter, paginationState.page, paginationState.rowsPerPage);
        await fetchStats();
        setViewModalOpen(false);
      }
    } catch (err: any) {
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
        await fetchStories(statusFilter, paginationState.page, paginationState.rowsPerPage);
        await fetchStats();
        setViewModalOpen(false);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject story');
    } finally {
      setActionLoading(null);
    }
  };

  const handleView = (story: StoryItem) => {
    setSelectedStory(story);
    setViewModalOpen(true);
  };

  const handleRefresh = () => {
    fetchStories(statusFilter, paginationState.page, paginationState.rowsPerPage);
    fetchStats();
  };

  const handleUpdateStatus = async (
      storyId: string,
      newStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  ) => {
    setActionLoading(storyId);

    try {
      const response = await storyService.updateStoryStatus(storyId, newStatus);

      if (response.success) {
        await fetchStories(statusFilter, paginationState.page, paginationState.rowsPerPage);
        await fetchStats();

        setMenuAnchor(prev => ({ ...prev, [storyId]: null }));

        showSnackbar(
            `Story updated to ${newStatus.toLowerCase()} successfully`,
            'success'
        );
        setSelectedStory(null);
      }
    } catch (err: any) {
      showSnackbar(
          err.response?.data?.message ||
          `Failed to update story to ${newStatus.toLowerCase()}`,
          'error'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleMenuOpen = (storyId: string, event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(prev => ({ ...prev, [storyId]: event.currentTarget }));
  };

  const handleMenuClose = (storyId: string) => {
    setMenuAnchor(prev => ({ ...prev, [storyId]: null }));
  };

  const getStatusColor = (status?: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'PENDING':
      default: return 'warning';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'APPROVED': return 'Approved';
      case 'REJECTED': return 'Rejected';
      case 'PENDING':
      default: return 'Pending';
    }
  };

  if (loading && stories.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={600}>
            Stories Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setShareModalOpen(true)}
              size="small"
            >
              Add Story
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
            <Typography variant="h4" fontWeight={700} color="#f57c00">
              {stats.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e8' }}>
            <Typography variant="h4" fontWeight={700} color="#2e7d32">
              {stats.approved}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Approved
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#ffebee' }}>
            <Typography variant="h4" fontWeight={700} color="#d32f2f">
              {stats.rejected}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rejected
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
            <Typography variant="h4" fontWeight={700} color="#1976d2">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <FilterIcon color="action" />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={(e) => handleStatusFilterChange(e.target.value as StoryStatus)}
            >
              <MenuItem value="ALL">
                <Badge badgeContent={stats.total} color="primary" sx={{ mr: 1 }}>
                  <StatsIcon fontSize="small" />
                </Badge>
                All Stories
              </MenuItem>
              <MenuItem value="PENDING">
                <Badge badgeContent={stats.pending} color="warning" sx={{ mr: 1 }}>
                  <StatsIcon fontSize="small" />
                </Badge>
                Pending
              </MenuItem>
              <MenuItem value="APPROVED">
                <Badge badgeContent={stats.approved} color="success" sx={{ mr: 1 }}>
                  <StatsIcon fontSize="small" />
                </Badge>
                Approved
              </MenuItem>
              <MenuItem value="REJECTED">
                <Badge badgeContent={stats.rejected} color="error" sx={{ mr: 1 }}>
                  <StatsIcon fontSize="small" />
                </Badge>
                Rejected
              </MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="body2" color="text.secondary">
            Showing {stories.length} of {paginationState.totalElements} stories
          </Typography>
        </Box>
      </Box>

      {error && !error.includes('No ') && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {stories.length === 0 && !loading ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {statusFilter === 'ALL' 
              ? 'No Stories Found'
              : `No ${statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} Stories`
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {statusFilter === 'ALL' 
              ? 'No stories have been created yet'
              : statusFilter === 'PENDING'
              ? 'All stories have been reviewed'
              : statusFilter === 'APPROVED'
              ? 'No stories have been approved yet. Approve some pending stories to see them here.'
              : 'No stories have been rejected yet.'
            }
          </Typography>
          
          {statusFilter === 'APPROVED' && stats.pending > 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleStatusFilterChange('PENDING')}
              sx={{ mt: 2 }}
            >
              View {stats.pending} Pending Stories
            </Button>
          )}
        </Box>
      ) : (
        <>
          <Box 
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
              },
              gap: 3,
              mb: 4
            }}
          >
            {stories.map((story) => (
                <Card
                    key={story.id}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                      },
                    }}
                >
                  {/* Thumbnail */}
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="180"
                        image={story.imageUrl}
                        alt={story.title}
                        sx={{ objectFit: 'cover', display: 'block' }}
                    />
                    {/* Status badge overlay on image */}
                    <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
                      <Chip
                          label={getStatusLabel(story.status)}
                          color={getStatusColor(story.status)}
                          size="small"
                          sx={{ fontWeight: 700, fontSize: '0.7rem', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
                      />
                    </Box>
                    {/* Time top-right */}
                    <Box
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          bgcolor: 'rgba(0,0,0,0.45)',
                          color: '#fff',
                          borderRadius: 1,
                          px: 1,
                          py: 0.25,
                        }}
                    >
                      <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                        {story.timeAgo || 'Just now'}
                      </Typography>
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {/* Author row */}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar src={story.userAvatar} alt={story.userName} sx={{ width: 28, height: 28 }} />
                      <Typography variant="body2" fontWeight={600} noWrap sx={{ flex: 1 }}>
                        {story.userName}
                      </Typography>
                      {story.tag && (
                          <Chip label={story.tag} size="small" color="primary" sx={{ fontWeight: 600, fontSize: '0.68rem' }} />
                      )}
                    </Stack>

                    {/* Title */}
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        noWrap
                        sx={{ fontSize: '1rem', lineHeight: 1.4, color: 'text.primary' }}
                    >
                      {story.title}
                    </Typography>

                    {/* Content preview */}
                    {story.content && (
                        <Box
                            sx={{
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                        >
                          <RichTextDisplay content={story.content} maxLines={2} variant="body2" />
                        </Box>
                    )}

                    {/* Stats */}
                    <Stack direction="row" spacing={2} sx={{ mt: 'auto', pt: 0.5 }}>
                      {[
                        { icon: '❤️', count: story.likeCount || 0 },
                        { icon: '💬', count: story.commentCount || 0 },
                        { icon: '📤', count: story.shareCount || 0 },
                      ].map(({ icon, count }) => (
                          <Box key={icon} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>{icon}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>{count}</Typography>
                          </Box>
                      ))}
                    </Stack>

                    <Divider />

                    {/* Actions */}
                    <Stack direction="row" spacing={1}>
                      <Button
                          size="small"
                          variant="contained"
                          disableElevation
                          startIcon={<ViewIcon />}
                          onClick={() => handleView(story)}
                          fullWidth
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                      >
                        View
                      </Button>

                      {story.status !== 'REJECTED' && (
                          <Button
                              size="small"
                              variant="outlined"
                              startIcon={<MoreIcon />}
                              onClick={(e) => handleMenuOpen(story.id, e)}
                              disabled={actionLoading === story.id}
                              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, minWidth: 'auto', px: 2 }}
                          >
                            Status
                          </Button>
                      )}
                    </Stack>

                    {/* Status Update Menu — logic unchanged */}
                    <Menu
                        anchorEl={menuAnchor[story.id]}
                        open={Boolean(menuAnchor[story.id])}
                        onClose={() => handleMenuClose(story.id)}
                    >
                      {story.status !== 'PENDING' && (
                          <MenuItem onClick={() => handleUpdateStatus(story.id, 'PENDING')} disabled={actionLoading === story.id}>
                            <ListItemIcon><PendingIcon fontSize="small" /></ListItemIcon>
                            <ListItemText>Set to Pending</ListItemText>
                          </MenuItem>
                      )}
                      {story.status !== 'APPROVED' && (
                          <MenuItem onClick={() => handleUpdateStatus(story.id, 'APPROVED')} disabled={actionLoading === story.id}>
                            <ListItemIcon><ApproveIcon fontSize="small" /></ListItemIcon>
                            <ListItemText>Set to Approved</ListItemText>
                          </MenuItem>
                      )}
                      {story.status !== 'REJECTED' && (
                          <MenuItem
                              onClick={() => {
                                if (confirm('Are you sure? Rejected stories cannot be updated and will be deleted when expired.')) {
                                  handleUpdateStatus(story.id, 'REJECTED');
                                }
                              }}
                              disabled={actionLoading === story.id}
                          >
                            <ListItemIcon><RejectIcon fontSize="small" /></ListItemIcon>
                            <ListItemText>Set to Rejected</ListItemText>
                          </MenuItem>
                      )}
                    </Menu>
                  </CardContent>
                </Card>
            ))}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert
                  onClose={handleCloseSnackbar}
                  severity={snackbar.severity}
                  variant="filled"
                  sx={{ borderRadius: 2, fontWeight: 500, minWidth: 300 }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>


          <TablePagination
            count={paginationState.totalElements}
            page={paginationState.page}
            rowsPerPage={paginationState.rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[6, 12, 24, 48]}
          />
        </>
      )}

      <AdminStoryDetailModal
        open={viewModalOpen}
        story={selectedStory}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedStory(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        onUpdateStatus={handleUpdateStatus}
        actionLoading={actionLoading}
      />

      <ShareStoryModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onSuccess={() => {
          setShareModalOpen(false);
          fetchStories(statusFilter, paginationState.page, paginationState.rowsPerPage);
          fetchStats();
        }}
      />
    </Box>
  );
};

export default AdminStoriesManagement;