import React, { useState, useEffect, useCallback, useDeferredValue, useRef, memo } from 'react';
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
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  TextField,
  InputAdornment, Tooltip,
} from '@mui/material';
import { Add, Edit, Visibility, FitnessCenter, Search, Clear } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { 
  getAllTrainers,
  searchTrainers,
  type TrainerResponse 
} from '../../../../services/trainerService';
import { toggleUserStatus } from '../../../../services/adminService';
import CreateTrainerModal from './CreateTrainerModal';
import UpdateTrainerModal from './UpdateTrainerModal';
import TrainerDetailModal from './TrainerDetailModal';
import TablePagination from '../../../../components/Common/TablePagination';
import { usePagination } from '../../../../hooks/usePagination';
import StatusFilterToggle from '../../../../components/Common/StatusFilterToggle.tsx';
import LockButton from '../../../../components/Common/LockButton.tsx';

const SearchInput = memo(({ 
  searchTerm, 
  onSearchChange, 
  onClearSearch 
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <TextField
      ref={searchInputRef}
      fullWidth
      placeholder="Search by email or phone number..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#64748b' }} />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={onClearSearch}
                sx={{ color: '#64748b' }}
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          backgroundColor: '#f8fafc',
          '&:hover': {
            backgroundColor: '#f1f5f9',
          },
          '&.Mui-focused': {
            backgroundColor: '#fff',
          },
        },
      }}
    />
  );
});

SearchInput.displayName = 'SearchInput';
const PageWrapper = styled(Box)({
  minHeight: '100%',
  background: '#f8faff',
  padding: '32px',
});

const HeaderSection = styled(Box)({
  background: '#ffffff',
  borderRadius: 20,
  border: '1px solid #eaeef8',
  padding: '28px 32px',
  marginBottom: 28,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
});

const HeaderLeft = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
});

const HeaderIconBox = styled(Box)({
  width: 48,
  height: 48,
  borderRadius: 14,
  background: 'linear-gradient(135deg, #00b4ff22, #0066ff22)',
  border: '1px solid #0066ff33',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#0066ff',
});

const AddButton = styled(Button)({
  background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 14,
  padding: '10px 22px',
  color: '#fff',
  boxShadow: '0 4px 16px rgba(0,102,255,0.28)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #00c6ff, #0077ff)',
    boxShadow: '0 6px 24px rgba(0,102,255,0.38)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 8px rgba(0,102,255,0.3)',
  },
});

const ContentSection = styled(Box)({
  background: '#ffffff',
  borderRadius: 20,
  border: '1px solid #eaeef8',
  padding: '24px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
});

const TrainersGrid: React.FC = () => {
  const [trainers, setTrainers] = useState<TrainerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerResponse | null>(null);
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  const deferredSearch = useDeferredValue(searchTerm);

  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(5);

  useEffect(() => {
    if (!isSearching) {
      loadTrainers(paginationState.page, paginationState.rowsPerPage);
    }
  }, [paginationState.page, paginationState.rowsPerPage, statusFilter, isSearching]);

  // Handle search with useDeferredValue
  useEffect(() => {
    if (deferredSearch.length >= 2) {
      if (!isSearching) {
        setIsSearching(true);
      }
      
      const performSearch = async () => {
        try {
          const response = await searchTrainers(
            deferredSearch,
            0,
            paginationState.rowsPerPage
          );
          if (response.success) {
            const pageData = response.data;
            setTrainers(pageData.content);
            setPaginationData(pageData.totalPages, pageData.totalElements);
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Failed to search");
          }
        }
      };
      performSearch();
    } else if (deferredSearch.length === 0 && isSearching) {
      setIsSearching(false);
      const reloadData = async () => {
        try {
          const response = await getAllTrainers(0, paginationState.rowsPerPage);
          if (response.success) {
            const pageData = response.data;
            setTrainers(pageData.content);
            setPaginationData(pageData.totalPages, pageData.totalElements);
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Failed to load data");
          }
        }
      };
      reloadData();
    }
  }, [deferredSearch]);

  useEffect(() => {
    if (isSearching && deferredSearch.length >= 2 && paginationState.page > 0) {
      const performPaginatedSearch = async () => {
        try {
          const response = await searchTrainers(
            deferredSearch,
            paginationState.page,
            paginationState.rowsPerPage
          );
          if (response.success) {
            const pageData = response.data;
            setTrainers(pageData.content);
            setPaginationData(pageData.totalPages, pageData.totalElements);
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Failed to search");
          }
        }
      };
      performPaginatedSearch();
    }
  }, [paginationState.page, paginationState.rowsPerPage]);

  const loadTrainers = useCallback(async (page: number = 0, size: number = 10) => {
    if (isSearching) {
      return;
    }

    try {
      setLoading(true);
      const response = await getAllTrainers(page, size);
      
      if (response.success) {
        const pageData = response.data;
        let filteredContent = pageData.content;
        if (statusFilter !== null) {
          filteredContent = pageData.content.filter(trainer => 
            statusFilter ? trainer.isActive : !trainer.isActive
          );
        }
        setTrainers(filteredContent);
        setPaginationData(pageData.totalPages, pageData.totalElements);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu trainers');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, isSearching, setPaginationData]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    setIsSearching(false);
  }, []);
  
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleOpenCreate = () => {
    setOpenCreateModal(true);
  };

  const handleOpenEdit = (trainer: TrainerResponse) => {
    setSelectedTrainer(trainer);
    setOpenUpdateModal(true);
  };

  const handleOpenDetail = (trainer: TrainerResponse) => {
    setSelectedTrainer(trainer);
    setOpenDetailModal(true);
  };

  const handleCreateSuccess = () => {
    setOpenCreateModal(false);
    loadTrainers(paginationState.page, paginationState.rowsPerPage);
  };

  const handleUpdateSuccess = () => {
    setOpenUpdateModal(false);
    loadTrainers(paginationState.page, paginationState.rowsPerPage);
  };

  const handleToggleStatus = async (trainerId: number) => {
    try {
      const response = await toggleUserStatus(trainerId);
      if (response.success) {
        setTrainers(prev =>
          prev.map(trainer =>
            trainer.id === trainerId
              ? { ...trainer, isActive: !trainer.isActive }
              : trainer
          )
        );
      } else {
        setError(response.message || 'Failed to toggle trainer status');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to toggle trainer status');
    }
  };

  if (loading) {
    return (
      <PageWrapper display="flex" justifyContent="center" alignItems="center" minHeight={360}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={40} thickness={3} sx={{ color: '#0066ff' }} />
          <Typography color="text.secondary" fontSize={14}>Loading trainers...</Typography>
        </Stack>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <HeaderSection>
        <HeaderLeft>
          <HeaderIconBox>
            <FitnessCenter sx={{ fontSize: 22 }} />
          </HeaderIconBox>
          <Box>
            <Typography fontWeight={700} fontSize={20} color="#0f172a" lineHeight={1.3}>
              Trainer Management
            </Typography>
            <Typography fontSize={13.5} color="#64748b" mt={0.3}>
              Manage gym trainers and their specialties
            </Typography>
          </Box>
        </HeaderLeft>
        <AddButton variant="contained" startIcon={<Add sx={{ fontSize: 18 }} />} onClick={handleOpenCreate}>
          Add Trainer
        </AddButton>
      </HeaderSection>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontSize: 13.5 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <ContentSection>
        <Box mb={3}>
          <SearchInput
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />
        </Box>
        <Box mb={3} display="flex" justifyContent="flex-end" alignItems="center">
          <StatusFilterToggle
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </Box>

        <TableContainer component={Paper} sx={{ 
          overflowX: 'auto',
          borderRadius: 3,
          border: '1px solid #eaeef8',
          boxShadow: 'none'
        }}>
          <Table sx={{ minWidth: { xs: 650, md: 750 } }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8faff' }}>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Trainer</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Phone</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, display: { xs: 'none', sm: 'table-cell' }, fontWeight: 600, color: '#0f172a' }}>Specialties</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, display: { xs: 'none', md: 'table-cell' }, fontWeight: 600, color: '#0f172a' }}>Experience</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Status</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trainers.map((trainer) => (
                <TableRow key={trainer.id} hover sx={{ '&:hover': { backgroundColor: '#f8faff' } }}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={trainer.avatar} sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }}>
                        {trainer.fullName?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                          {trainer.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                          {trainer.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    {trainer.phoneNumber || '-'}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {trainer.specialties?.slice(0, 2).map((spec: any, index: number) => (
                        <Chip
                          key={index}
                          label={spec.specialty?.displayName || 'Unknown'}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                      {trainer.specialties?.length > 2 && (
                        <Chip
                          label={`+${trainer.specialties.length - 2}`}
                          size="small"
                          color="default"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    {(() => {
                      if (trainer.totalExperienceYears) {
                        return `${trainer.totalExperienceYears} years`;
                      }
                      const maxSpecialtyExp = trainer.specialties?.reduce((max, spec) => {
                        return Math.max(max, spec.experienceYears || 0);
                      }, 0);
                      
                      return maxSpecialtyExp > 0 ? `${maxSpecialtyExp} năm` : '-';
                    })()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={trainer.isActive ? 'Active' : 'Inactive'} 
                      color={trainer.isActive ? 'success' : 'error'}
                      size="small"
                      sx={{ fontSize: { xs: '0.75rem', md: '0.8125rem' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5}>
                      <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        title="Xem chi tiết"
                        onClick={() => handleOpenDetail(trainer)}
                        sx={{
                          color: '#0066ff',
                          '&:hover': { backgroundColor: 'rgba(0,102,255,0.1)' }
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                        </Tooltip>
                      <Tooltip title="Edit Trainer">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenEdit(trainer)}
                        sx={{
                          color: '#0066ff',
                          '&:hover': { backgroundColor: 'rgba(0,102,255,0.1)' }
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      </Tooltip>
                      <LockButton
                        isLocked={!trainer.isActive}
                        onToggle={() => handleToggleStatus(trainer.id)}
                        size="small"
                        lockedTooltip="Activate trainer"
                        unlockedTooltip="Deactivate trainer"
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={3}>
          <TablePagination
            count={paginationState.totalElements}
            page={paginationState.page}
            rowsPerPage={paginationState.rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Trainers per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} trainers`
            }
          />
        </Box>

        {trainers.length === 0 && !loading && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              {isSearching 
                ? `No results found for "${searchTerm}"` 
                : 'No trainers found'
              }
            </Typography>
            {isSearching ? (
              <Button 
                variant="outlined" 
                onClick={handleClearSearch}
                sx={{ borderRadius: 2, mr: 2 }}
              >
                Clear Search
              </Button>
            ) : (
              <Typography variant="body2" color="text.secondary" mb={3}>
                Create your first trainer to get started
              </Typography>
            )}
            <AddButton variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
              Add Trainer
            </AddButton>
          </Box>
        )}
      </ContentSection>

      <CreateTrainerModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
      <UpdateTrainerModal
          open={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          onSuccess={handleUpdateSuccess}
          trainerId={selectedTrainer?.id || null}
      />
      <TrainerDetailModal
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        trainerId={selectedTrainer?.id || null}
      />
    </PageWrapper>
  );
};

export default TrainersGrid;


