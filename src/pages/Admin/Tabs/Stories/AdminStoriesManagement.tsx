import React, { useState } from 'react';
import {
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Stack, Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TablePagination from '../../../../components/Common/TablePagination';
import AdminStoryDetailModal from './AdminStoryDetailModal';
import ShareStoryModal from '../../../Home/StoriesSection/ShareStoryModal';
import { Header, StatsCards, StoryCard, EmptyState } from './components';
import type { StoryItem } from '../../../../services/storyService';
import { loadAuthSession } from '../../../../services/authStorage';
import {useStoriesManagement} from "../../../../hooks/useStoriesManagement.ts";
import type {StoryStatus} from "./types.ts";

/* ─── Styled Components ─────────────────────────────────── */

const PageWrapper = styled(Box)({
  minHeight: '100%',
  background: '#f8faff',
  padding: '32px',
});

const ContentSection = styled(Box)({
  background: '#ffffff',
  borderRadius: 20,
  border: '1px solid #eaeef8',
  padding: '24px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
});

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
      <PageWrapper display="flex" justifyContent="center" alignItems="center" minHeight={360}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={40} thickness={3} sx={{ color: '#0066ff' }} />
          <Typography color="text.secondary" fontSize={14}>Loading stories...</Typography>
        </Stack>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
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
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontSize: 13.5 }}>
          {error}
        </Alert>
      )}

      <ContentSection>
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
              labelRowsPerPage="Stories per page:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} stories`
              }
            />
          </>
        )}
      </ContentSection>

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
    </PageWrapper>
  );
};

export default AdminStoriesManagement;