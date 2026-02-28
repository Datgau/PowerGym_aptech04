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
import { Add, Edit, Delete, Email, Phone } from '@mui/icons-material';
import { getAllUsers, createUser, updateUser, deleteUser, getAllRoles, type UserResponse, type Role } from '../../../services/adminService';
import UserFormModal from './UserFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const TrainersGrid: React.FC = () => {
  const [trainers, setTrainers] = useState<UserResponse[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes] = await Promise.all([
        getAllUsers(),
        getAllRoles()
      ]);
      
      if (usersRes.success && rolesRes.success) {
        // Lọc chỉ lấy user có role TRAINER
        const trainerUsers = usersRes.data.filter(u => u.role?.name === 'TRAINER');
        setTrainers(trainerUsers);
        setRoles(rolesRes.data);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setFormMode('create');
    setOpenForm(true);
  };

  const handleOpenEdit = (user: UserResponse) => {
    setSelectedUser(user);
    setFormMode('edit');
    setOpenForm(true);
  };

  const handleOpenDelete = (user: UserResponse) => {
    setSelectedUser(user);
    setOpenDelete(true);
  };

  const handleSubmit = async (data: any) => {
    if (formMode === 'create') {
      await createUser(data);
    } else if (selectedUser) {
      await updateUser(selectedUser.id, data);
    }
    await loadData();
  };

  const handleDelete = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id);
      await loadData();
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
            background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          Add Trainer
        </Button>
      </Box>
      
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: { xs: 650, md: 750 } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Trainer</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Phone</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, display: { xs: 'none', sm: 'table-cell' } }}>Join Date</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Role</TableCell>
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
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                  {trainer.createDate ? new Date(trainer.createDate).toLocaleDateString('vi-VN') : '-'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={trainer.role?.name || 'TRAINER'} 
                    color="success"
                    size="small"
                    sx={{ fontSize: { xs: '0.75rem', md: '0.8125rem' } }}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={0.5}>
                    <IconButton size="small" onClick={() => handleOpenEdit(trainer)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleOpenDelete(trainer)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {trainers.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">Chưa có trainer nào</Typography>
        </Box>
      )}

      <UserFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
        roles={roles}
        mode={formMode}
        allowedRoles={['TRAINER']}
      />

      <DeleteConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        title="Xóa Trainer"
        message={`Bạn có chắc chắn muốn xóa trainer "${selectedUser?.fullName}"?`}
      />
    </Box>
  );
};

export default TrainersGrid;
