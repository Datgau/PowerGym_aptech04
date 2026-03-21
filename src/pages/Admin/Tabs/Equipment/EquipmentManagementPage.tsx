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
import { Add, Edit, Delete, Category, Build } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useEquipments } from '../../../../hooks/useEquipments';
import {type Equipment, equipmentService} from '../../../../services/equipmentService';
import EquipmentFormModal from './EquipmentFormModal';
import EquipmentCategoriesPage from './EquipmentCategoriesPage';
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

const TabsSection = styled(Box)({
  background: '#ffffff',
  borderRadius: 20,
  border: '1px solid #eaeef8',
  marginBottom: 28,
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
});

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
  const { equipments: allEquipments, loading, error, refresh } = useEquipments(false); // Get all equipments
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(5);

  // Client-side pagination
  const equipments = React.useMemo(() => {
    const startIndex = paginationState.page * paginationState.rowsPerPage;
    const endIndex = startIndex + paginationState.rowsPerPage;
    return allEquipments.slice(startIndex, endIndex);
  }, [allEquipments, paginationState.page, paginationState.rowsPerPage]);

  React.useEffect(() => {
    const totalPages = Math.ceil(allEquipments.length / paginationState.rowsPerPage);
    setPaginationData(totalPages, allEquipments.length);
  }, [allEquipments.length, paginationState.rowsPerPage, setPaginationData]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
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
        <PageWrapper display="flex" justifyContent="center" alignItems="center" minHeight={360}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={40} thickness={3} sx={{ color: '#0066ff' }} />
            <Typography color="text.secondary" fontSize={14}>Loading equipment...</Typography>
          </Stack>
        </PageWrapper>
      );
    }

    return (
      <ContentSection>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={600}>
            Equipment List
          </Typography>
          <AddButton
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
          >
            Add Equipment
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
                <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>Created Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipments.map((equipment) => (
                <TableRow key={equipment.id} hover sx={{ '&:hover': { backgroundColor: '#f8faff' } }}>
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
                        sx={{
                          color: '#0066ff',
                          '&:hover': { backgroundColor: 'rgba(0,102,255,0.1)' }
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(equipment.id)}
                        disabled={deleting === equipment.id}
                        sx={{
                          color: '#ef4444',
                          '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' }
                        }}
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

        <Box mt={3}>
          <TablePagination
            count={paginationState.totalElements}
            page={paginationState.page}
            rowsPerPage={paginationState.rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Equipment per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} equipment`
            }
          />
        </Box>

        {equipments.length === 0 && !loading && allEquipments.length > 0 && (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">No equipment on this page</Typography>
          </Box>
        )}

        {allEquipments.length === 0 && !loading && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              No equipment found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Create your first equipment to get started
            </Typography>
            <AddButton variant="contained" onClick={handleCreate}>
              Add Equipment
            </AddButton>
          </Box>
        )}

        <EquipmentFormModal
          open={modalOpen}
          equipment={editingEquipment}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      </ContentSection>
    );
  };

  return (
    <PageWrapper>
      {/* ── Header ── */}
      <HeaderSection>
        <HeaderLeft>
          <HeaderIconBox>
            <Build sx={{ fontSize: 22 }} />
          </HeaderIconBox>
          <Box>
            <Typography fontWeight={700} fontSize={20} color="#0f172a" lineHeight={1.3}>
              Equipment Management
            </Typography>
            <Typography fontSize={13.5} color="#64748b" mt={0.3}>
              Manage gym equipment and categories
            </Typography>
          </Box>
        </HeaderLeft>
      </HeaderSection>

      <TabsSection sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 3 }}>
          <Tab label="Equipment" />
          <Tab label="Categories" icon={<Category />} iconPosition="start" />
        </Tabs>
      </TabsSection>

      <TabPanel value={tabValue} index={0}>
        <EquipmentTable />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ContentSection>
          <EquipmentCategoriesPage />
        </ContentSection>
      </TabPanel>
    </PageWrapper>
  );
};

export default EquipmentManagementPage;