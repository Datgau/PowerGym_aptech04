import React, { useState } from 'react';
import {
  Box,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import TablePagination from '../../../../components/Common/TablePagination';
import AdminStoryDetailModal from './AdminStoryDetailModal';
import ShareStoryModal from '../../../Home/StoriesSection/ShareStoryModal';
import { Header, StatsCards, StoryCard, EmptyState } from './components';
import type { StoryItem } from '../../../../services/storyService';
import { loadAuthSession } from '../../../../services/authStorage';
import {useStoriesManagement} from "../../../../hooks/useStoriesManagement.ts";
import type {StoryStatus} from "./types.ts";

const AdminStoriesManagement: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  const session = loadAuthSession();
  const currentUserId = session?.user?.id;

  const {
    stories,
    loading,
    error,
    actionLoading,
    statusFilter,
    stats,
    alert,
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    handleStatusFilterChange,
    handleRefresh,
    handleApprove,
    handleReject,
    handleUpdateStatus,
    fetchStories,
    fetchStats,
    showAlert,
    hideAlert
  } = useStoriesManagement();

  const handleView = (story: StoryItem) => {
    setSelectedStory(story);
    setViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setViewModalOpen(false);
    setSelectedStory(null);
  };

  const handleShareSuccess = () => {
    setShareModalOpen(false);
    fetchStories(statusFilter, paginationState.page, paginationState.rowsPerPage);
    fetchStats();
  };

  const handleEdit = (story: StoryItem) => {
    setSelectedStory(story);
    setShareModalOpen(true);
  };

  const handleStatCardClick = (filter: StoryStatus) => {
    handleStatusFilterChange(filter);
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
        <Header
          loading={loading}
          onAddStory={() => setShareModalOpen(true)}
          onRefresh={handleRefresh}
        />

        <StatsCards 
          stats={stats} 
          activeFilter={statusFilter}
          onFilterClick={handleStatCardClick}
        />
      </Box>

      {error && !error.includes('No ') && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {stories.length === 0 && !loading ? (
        <EmptyState
          statusFilter={statusFilter}
          stats={stats}
          onStatusFilterChange={handleStatusFilterChange}
        />
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
              <StoryCard
                key={story.id}
                story={story}
                actionLoading={actionLoading}
                currentUserId={currentUserId}
                onView={handleView}
                onApprove={handleApprove}
                onReject={handleReject}
                onUpdateStatus={handleUpdateStatus}
                onEdit={handleEdit}
                showAlert={showAlert}
              />
            ))}
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
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onReject={handleReject}
        onUpdateStatus={handleUpdateStatus}
        actionLoading={actionLoading}
      />

      <ShareStoryModal
        open={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
          setSelectedStory(null);
        }}
        onSuccess={handleShareSuccess}
        story={selectedStory}
      />

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={hideAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={hideAlert}
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminStoriesManagement;