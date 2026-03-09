import { useState, useEffect, useCallback } from 'react';
import { storyService, type StoryItem } from '../../../../../services/storyService';
import { usePagination } from '../../../../../hooks/usePagination';
import type { StoryStatus, StoryStats } from '../types';

interface AlertState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export const useStoriesManagement = () => {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StoryStatus>('ALL');
  const [alert, setAlert] = useState<AlertState>({ open: false, message: '', severity: 'info' });
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

  const fetchStats = useCallback(async () => {
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
  }, []);

  const fetchStories = useCallback(async (status: StoryStatus, page = 0, size = 12) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      
      if (status === 'ALL') {
        try {
          response = await storyService.getAllStoriesForAdmin(page, size);
        } catch (err: unknown) {
          const [pendingRes, approvedRes, rejectedRes] = await Promise.allSettled([
            storyService.getStoriesByStatusLegacy('PENDING'),
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
      } else {
        // Dùng chung 1 endpoint cho tất cả status (PENDING, APPROVED, REJECTED)
        try {
          response = await storyService.getStoriesByStatus(status, page, size);
        } catch (err: unknown) {
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
    } catch (err: unknown) {
      setStories([]);
      setPaginationData(0, 0);
      
      const error = err as { response?: { status?: number; data?: { message?: string } } };
      if (error.response?.status === 401) {
        setError('Authentication required. Please login as admin.');
      } else if (error.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch stories');
      }
    } finally {
      setLoading(false);
    }
  }, [setPaginationData]);

  const handleStatusFilterChange = useCallback((newStatus: StoryStatus) => {
    setStatusFilter(newStatus);
    handleChangePage(null, 0);
  }, [handleChangePage]);

  const handleRefresh = useCallback(() => {
    fetchStories(statusFilter, paginationState.page, paginationState.rowsPerPage);
    fetchStats();
  }, [fetchStories, fetchStats, statusFilter, paginationState.page, paginationState.rowsPerPage]);

  const showAlert = useCallback((message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setAlert({ open: true, message, severity });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, open: false }));
  }, []);

  const handleApprove = useCallback(async (storyId: string) => {
    setActionLoading(storyId);
    try {
      const response = await storyService.approveStory(storyId);
      if (response.success) {
        await fetchStories(statusFilter, paginationState.page, paginationState.rowsPerPage);
        await fetchStats();
        showAlert('Story approved successfully', 'success');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showAlert(error.response?.data?.message || 'Failed to approve story', 'error');
    } finally {
      setActionLoading(null);
    }
  }, [fetchStories, fetchStats, statusFilter, paginationState.page, paginationState.rowsPerPage, showAlert]);

  const handleReject = useCallback(async (storyId: string) => {
    if (!confirm('Are you sure you want to reject this story? This action cannot be undone.')) {
      return;
    }

    setActionLoading(storyId);
    try {
      const response = await storyService.rejectStory(storyId);
      if (response.success) {
        await fetchStories(statusFilter, paginationState.page, paginationState.rowsPerPage);
        await fetchStats();
        showAlert('Story rejected successfully', 'warning');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showAlert(error.response?.data?.message || 'Failed to reject story', 'error');
    } finally {
      setActionLoading(null);
    }
  }, [fetchStories, fetchStats, statusFilter, paginationState.page, paginationState.rowsPerPage, showAlert]);

  const handleUpdateStatus = useCallback(async (storyId: string, newStatus: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    setActionLoading(storyId);
    try {
      const response = await storyService.updateStoryStatus(storyId, newStatus);
      if (response.success) {
        await fetchStories(statusFilter, paginationState.page, paginationState.rowsPerPage);
        await fetchStats();
        const severity = newStatus === 'APPROVED' ? 'success' : newStatus === 'REJECTED' ? 'warning' : 'info';
        showAlert(`Story ${newStatus.toLowerCase()} successfully`, severity);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showAlert(error.response?.data?.message || `Failed to update story to ${newStatus.toLowerCase()}`, 'error');
    } finally {
      setActionLoading(null);
    }
  }, [fetchStories, fetchStats, statusFilter, paginationState.page, paginationState.rowsPerPage, showAlert]);

  useEffect(() => {
    fetchStories(statusFilter, paginationState.page, paginationState.rowsPerPage);
    fetchStats();
  }, [statusFilter, paginationState.page, paginationState.rowsPerPage, fetchStories, fetchStats]);

  return {
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
  };
};