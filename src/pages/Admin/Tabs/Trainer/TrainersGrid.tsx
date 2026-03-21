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
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Stack
} from '@mui/material';
import { Add, Edit, Delete, Visibility, FitnessCenter } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { 
  getAllTrainers, 
  deactivateTrainer,
  type TrainerResponse 
} from '../../../../services/trainerService';
import CreateTrainerModal from './CreateTrainerModal';
import TrainerDetailModal from './TrainerDetailModal';
import DeleteConfirmModal from '../DeleteConfirmModal';
import TablePagination from '../../../../components/Common/TablePagination';
import { usePagination } from '../../../../hooks/usePagination';
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
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerResponse | null>(null);

  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(5);

  useEffect(() => {
    loadTrainers(paginationState.page, paginationState.rowsPerPage);
  }, [paginationState.page, paginationState.rowsPerPage]);

  const loadTrainers = async (page: number = 0, size: number = 10) => {
    try {
      setLoading(true);
      const response = await getAllTrainers(page, size);
      
      if (response.success) {
        const pageData = response.data;
        setTrainers(pageData.content);
        setPaginationData(pageData.totalPages, pageData.totalElements);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu trainers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setOpenCreateModal(true);
  };

  const handleOpenDetail = (trainer: TrainerResponse) => {
    setSelectedTrainer(trainer);
    setOpenDetailModal(true);
  };

  const handleOpenDelete = (trainer: TrainerResponse) => {
    setSelectedTrainer(trainer);
    setOpenDelete(true);
  };

  const handleCreateSuccess = () => {
    setOpenCreateModal(false); // Close modal first
    loadTrainers(paginationState.page, paginationState.rowsPerPage); // Then reload data
  };

  const handleDelete = async () => {
    if (selectedTrainer) {
      try {
        await deactivateTrainer(selectedTrainer.id);
        await loadTrainers(paginationState.page, paginationState.rowsPerPage);
      } catch (err: any) {
        setError(err.message || 'Không thể xóa trainer');
      }
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
      {/* ── Header ── */}
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
          Tạo Trainer Mới
        </AddButton>
      </HeaderSection>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontSize: 13.5 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <ContentSection>
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
                      // Show totalExperienceYears if available
                      if (trainer.totalExperienceYears) {
                        return `${trainer.totalExperienceYears} years`;
                      }
                      
                      // Otherwise, show max experience from specialties
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
                      <IconButton 
                        size="small" 
                        title="Chỉnh sửa"
                        sx={{
                          color: '#0066ff',
                          '&:hover': { backgroundColor: 'rgba(0,102,255,0.1)' }
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDelete(trainer)}
                        title="Xóa"
                        sx={{
                          color: '#ef4444',
                          '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' }
                        }}
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
              No trainers found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Create your first trainer to get started
            </Typography>
            <AddButton variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
              Tạo Trainer Mới
            </AddButton>
          </Box>
        )}
      </ContentSection>

      <CreateTrainerModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      <TrainerDetailModal
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        trainerId={selectedTrainer?.id || null}
      />

      <DeleteConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        title="Delete Trainer"
        message={`Are you sure you want to delete trainer "${selectedTrainer?.fullName}"?`}
      />
    </PageWrapper>
  );
};

export default TrainersGrid;
