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
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { getAllRoles, createRole, updateRole, deleteRole, type Role } from '../../../../services/adminService';
import TablePagination from '../../../../components/Common/TablePagination';
import { usePagination } from '../../../../hooks/usePagination';

const RolesTable: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(10);

  useEffect(() => {
    loadData(paginationState.page, paginationState.rowsPerPage);
  }, [paginationState.page, paginationState.rowsPerPage]);

  const loadData = async (page: number = 0, size: number = 10) => {
    try {
      setLoading(true);
      const response = await getAllRoles(page, size);

      if (response.success) {
        const pageData = response.data;
        setRoles(pageData.content);
        setPaginationData(pageData.totalPages, pageData.totalElements);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load roles");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    // TODO: Implement create role modal
    console.log('Create role');
  };

  const handleEdit = (role: Role) => {
    // TODO: Implement edit role modal
    console.log('Edit role:', role);
  };

  const handleDelete = (role: Role) => {
    // TODO: Implement delete confirmation
    console.log('Delete role:', role);
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
          Roles Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
          sx={{ 
            background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
          }}
        >
          Add Role
        </Button>
      </Box>
      
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.id}</TableCell>
                <TableCell>
                  <Typography fontWeight={600}>
                    {role.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {role.description || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={0.5}>
                    <IconButton size="small" onClick={() => handleEdit(role)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(role)}>
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

      {roles.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">Không có role nào</Typography>
        </Box>
      )}
    </Box>
  );
};

export default RolesTable;