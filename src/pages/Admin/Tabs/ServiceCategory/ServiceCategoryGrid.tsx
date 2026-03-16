import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Stack,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ToggleOn,
  ToggleOff,
  Category
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
  getAllServiceCategoriesNoPaging,
  toggleServiceCategoryStatus,
  deleteServiceCategory,
  type ServiceCategoryResponse
} from '../../../../services/serviceCategoryService';
import CreateServiceCategoryModal from './CreateServiceCategoryModal';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  border: '1.5px solid #e8ecf4',
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#0066ff',
    boxShadow: '0 6px 24px rgba(0,102,255,0.08)',
    transform: 'translateY(-2px)',
  },
}));

const ServiceCategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllServiceCategoriesNoPaging();
      if (response.success) {
        setCategories(response.data.sort((a, b) => a.sortOrder - b.sortOrder));
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load service categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await toggleServiceCategoryStatus(id);
      if (response.success) {
        await loadCategories();
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to toggle category status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this service category?')) {
      return;
    }

    try {
      const response = await deleteServiceCategory(id);
      if (response.success) {
        await loadCategories();
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={8}>
        <CircularProgress />
        <Typography ml={2}>Loading service categories...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Service Categories
          </Typography>
          <Typography color="text.secondary">
            Manage gym service categories and specialties
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateModalOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
            borderRadius: 2.5,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
          }}
        >
          Add Category
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Categories Grid */}
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: category.color || '#0066ff',
                        fontSize: 18,
                      }}
                    >
                      {category.icon ? (
                        <span className="material-icons">{category.icon}</span>
                      ) : (
                        <Category />
                      )}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={700} fontSize={16}>
                        {category.displayName}
                      </Typography>
                      <Typography fontSize={12} color="text.secondary">
                        {category.name}
                      </Typography>
                    </Box>
                  </Stack>
                  <Chip
                    size="small"
                    label={category.isActive ? 'Active' : 'Inactive'}
                    color={category.isActive ? 'success' : 'default'}
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>

                {category.description && (
                  <Typography fontSize={14} color="text.secondary" mb={2}>
                    {category.description}
                  </Typography>
                )}

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Tooltip title={category.isActive ? 'Deactivate' : 'Activate'}>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleStatus(category.id)}
                      sx={{
                        color: category.isActive ? '#4caf50' : '#9e9e9e',
                        '&:hover': {
                          bgcolor: category.isActive ? '#e8f5e8' : '#f5f5f5',
                        },
                      }}
                    >
                      {category.isActive ? <ToggleOn /> : <ToggleOff />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      sx={{
                        color: '#0066ff',
                        '&:hover': { bgcolor: '#e3f2fd' },
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(category.id)}
                      sx={{
                        color: '#f44336',
                        '&:hover': { bgcolor: '#ffebee' },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {categories.length === 0 && !loading && (
        <Box textAlign="center" py={8}>
          <Category sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No service categories found
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Create your first service category to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateModalOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Add Category
          </Button>
        </Box>
      )}

      {/* Create Modal */}
      <CreateServiceCategoryModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          loadCategories();
        }}
      />
    </Box>
  );
};

export default ServiceCategoryGrid;