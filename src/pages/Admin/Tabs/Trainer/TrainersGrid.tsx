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
  Chip
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
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
  } = usePagination(10);

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
    loadTrainers(paginationState.page, paginationState.rowsPerPage);
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

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
          Trainer Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenCreate}
          sx={{
            background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          Tạo Trainer Mới
        </Button>
      </Box>
      
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: { xs: 650, md: 750 } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Trainer</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Phone</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, display: { xs: 'none', sm: 'table-cell' } }}>Specialties</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, display: { xs: 'none', md: 'table-cell' } }}>Experience</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Status</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainers.map((trainer) => (
              <TableRow key={trainer.id}>
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
                        label={spec.specialty}
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
                  {trainer.totalExperienceYears ? `${trainer.totalExperienceYears} năm` : '-'}
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
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Chỉnh sửa">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleOpenDelete(trainer)}
                      title="Xóa"
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

      {trainers.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">Chưa có trainer nào</Typography>
        </Box>
      )}

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
        title="Xóa Trainer"
        message={`Bạn có chắc chắn muốn xóa trainer "${selectedTrainer?.fullName}"?`}
      />
    </Box>
  );
};

export default TrainersGrid;
