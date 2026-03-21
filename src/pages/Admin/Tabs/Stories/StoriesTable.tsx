import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Visibility, Check, Close, Delete } from '@mui/icons-material';
import { storyService, type StoryItem } from '../../../../services/storyService';
import TablePagination from '../../../../components/Common/TablePagination';
import { usePagination } from '../../../../hooks/usePagination';
import RichTextDisplay from '../../../../components/Common/RichTextDisplay';

const StoriesTable: React.FC = () => {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  
  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(6);

  useEffect(() => {
    loadData(paginationState.page, paginationState.rowsPerPage);
  }, [paginationState.page, paginationState.rowsPerPage, statusFilter]);

  const loadData = async (page: number = 0, size: number = 10) => {
    try {
      setLoading(true);
      let response;

      if (statusFilter === 'PENDING') {
        response = await storyService.getPendingStories(page, size);
      } else {
        // For ALL and APPROVED, we'll use the regular fetchStories
        response = await storyService.fetchStories(page, size);
      }

      if (response.success) {
        const pageData = response.data;
        setStories(pageData.content);
        setPaginationData(pageData.totalPages, pageData.totalElements);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load stories");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (storyId: string) => {
    try {
      const response = await storyService.approveStory(storyId);
      if (response.success) {
        await loadData(paginationState.page, paginationState.rowsPerPage);
      }
    } catch (err) {
      setError('Failed to approve story');
    }
  };

  const handleReject = async (storyId: string) => {
    try {
      const response = await storyService.rejectStory(storyId);
      if (response.success) {
        await loadData(paginationState.page, paginationState.rowsPerPage);
      }
    } catch (err) {
      setError('Failed to reject story');
    }
  };

  const handleDelete = async (storyId: string) => {
    try {
      const response = await storyService.deleteStory(storyId);
      if (response.success) {
        await loadData(paginationState.page, paginationState.rowsPerPage);
      }
    } catch (err) {
      setError('Failed to delete story');
    }
  };

  const handleFilterChange = (_event: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
    if (newFilter !== null) {
      setStatusFilter(newFilter as 'ALL' | 'PENDING' | 'APPROVED');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Stories Management
        </Typography>
      </Box>

      <Box mb={2}>
        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={handleFilterChange}
          size="small"
        >
          <ToggleButton value="ALL">Tất cả ({stories.length})</ToggleButton>
          <ToggleButton value="PENDING">Chờ duyệt</ToggleButton>
          <ToggleButton value="APPROVED">Đã duyệt</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow>
              <TableCell>Story</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Tag</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stories.map((story) => (
              <TableRow key={story.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar 
                      src={story.imageUrl} 
                      sx={{ width: 40, height: 40 }}
                      variant="rounded"
                    >
                      {story.title?.charAt(0) || 'S'}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>
                        {story.title || 'Untitled Story'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {story.content ? (
                          <RichTextDisplay 
                            content={story.content}
                            maxLines={1}
                            variant="body2"
                          />
                        ) : (
                          'No content'
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar 
                      src={story.userAvatar} 
                      sx={{ width: 32, height: 32 }}
                    >
                      {story.userName?.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">
                      {story.userName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {story.tag && (
                    <Chip 
                      label={story.tag} 
                      size="small"
                      variant="outlined"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {new Date(story.createdAt).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={story.status || 'APPROVED'} 
                    color={getStatusColor(story.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={0.5}>
                    <IconButton size="small">
                      <Visibility fontSize="small" />
                    </IconButton>
                    {story.status === 'PENDING' && (
                      <>
                        <IconButton 
                          size="small" 
                          color="success" 
                          onClick={() => handleApprove(story.id)}
                        >
                          <Check fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="warning" 
                          onClick={() => handleReject(story.id)}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </>
                    )}
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleDelete(story.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        count={paginationState.totalElements}
        page={paginationState.page}
        rowsPerPage={paginationState.rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {stories.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">Không có story nào</Typography>
        </Box>
      )}
    </Box>
  );
};

export default StoriesTable;