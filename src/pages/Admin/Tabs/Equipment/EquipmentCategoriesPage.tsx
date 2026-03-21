import React, { useState } from 'react';
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
  Chip,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useEquipmentCategories } from '../../../../hooks/useEquipments';
import {type EquipmentCategory, equipmentService} from '../../../../services/equipmentService';
import CategoryFormModal from './CategoryFormModal';
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

const EquipmentCategoriesPage: React.FC = () => {
  const { categories, loading, error, refresh } = useEquipmentCategories(false); // Get all categories
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<EquipmentCategory | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleCreate = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (category: EquipmentCategory) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      setDeleting(id);
      await equipmentService.deleteCategory(id);
      refresh();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    } finally {
      setDeleting(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleModalSuccess = () => {
    refresh();
    handleModalClose();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={360}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={40} thickness={3} sx={{ color: '#0066ff' }} />
          <Typography color="text.secondary" fontSize={14}>Loading categories...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={600}>
          Equipment Categories
        </Typography>
        <AddButton
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Add Category
        </AddButton>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontSize: 13.5 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ 
        borderRadius: 3,
        border: '1px solid #eaeef8',
        boxShadow: 'none'
      }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8faff' }}>
              <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>Created Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} hover sx={{ '&:hover': { backgroundColor: '#f8faff' } }}>
                <TableCell>{category.id}</TableCell>
                <TableCell>
                  <Typography fontWeight={500}>{category.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {category.description || 'No description'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={category.isActive ? 'Active' : 'Inactive'}
                    color={category.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(category.createDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(category)}
                      sx={{
                        color: '#0066ff',
                        '&:hover': { backgroundColor: 'rgba(0,102,255,0.1)' }
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(category.id)}
                      disabled={deleting === category.id}
                      sx={{
                        color: '#ef4444',
                        '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' }
                      }}
                    >
                      {deleting === category.id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <Delete fontSize="small" />
                      )}
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {categories.length === 0 && !loading && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            No categories found
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Create your first equipment category to get started
          </Typography>
          <AddButton variant="contained" onClick={handleCreate}>
            Add Category
          </AddButton>
        </Box>
      )}

      <CategoryFormModal
        open={modalOpen}
        category={editingCategory}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </Box>
  );
};

export default EquipmentCategoriesPage;