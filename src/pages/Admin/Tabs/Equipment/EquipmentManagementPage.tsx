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
  Stack,
  Avatar,
  Tabs,
  Tab
} from '@mui/material';
import { Add, Edit, Delete, Category } from '@mui/icons-material';
import { useEquipments } from '../../../../hooks/useEquipments';
import {type Equipment, equipmentService} from '../../../../services/equipmentService';
import EquipmentFormModal from './EquipmentFormModal';
import EquipmentCategoriesPage from './EquipmentCategoriesPage';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const EquipmentManagementPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const { equipments, loading, error, refresh } = useEquipments(false); // Get all equipments
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreate = () => {
    setEditingEquipment(null);
    setModalOpen(true);
  };

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return;
    
    try {
      setDeleting(id);
      await equipmentService.deleteEquipment(id);
      refresh();
    } catch (error) {
      console.error('Error deleting equipment:', error);
      alert('Failed to delete equipment');
    } finally {
      setDeleting(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingEquipment(null);
  };

  const handleModalSuccess = () => {
    refresh();
    handleModalClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const EquipmentTable = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={600}>
            Equipment List
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{ borderRadius: 2 }}
          >
            Add Equipment
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipments.map((equipment) => (
                <TableRow key={equipment.id} hover>
                  <TableCell>
                    <Avatar
                      src={equipment.image}
                      alt={equipment.name}
                      sx={{ width: 50, height: 50 }}
                      variant="rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>{equipment.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {equipment.description && equipment.description.length > 50
                        ? equipment.description.slice(0, 50) + '...'
                        : equipment.description || 'No description'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={equipment.category.name}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>
                      {formatPrice(equipment.price)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>
                      {equipment.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={equipment.isActive ? 'Active' : 'Inactive'}
                      color={equipment.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(equipment.createDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(equipment)}
                        color="primary"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(equipment.id)}
                        color="error"
                        disabled={deleting === equipment.id}
                      >
                        {deleting === equipment.id ? (
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

        {equipments.length === 0 && !loading && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              No equipment found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Create your first equipment to get started
            </Typography>
            <Button variant="contained" onClick={handleCreate}>
              Add Equipment
            </Button>
          </Box>
        )}

        <EquipmentFormModal
          open={modalOpen}
          equipment={editingEquipment}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Equipment Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Equipment" />
          <Tab label="Categories" icon={<Category />} iconPosition="start" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <EquipmentTable />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <EquipmentCategoriesPage />
      </TabPanel>
    </Box>
  );
};

export default EquipmentManagementPage;