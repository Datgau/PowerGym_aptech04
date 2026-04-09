import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Stack,
  IconButton,
} from '@mui/material';
import { Add, Search, Receipt, Clear, Edit, Delete } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { getImportReceipts, deleteImportReceipt } from '../../../../services/importReceiptService';
import type { ImportReceipt } from '../../../../types/importReceipt';
import TablePagination from '../../../../components/Common/TablePagination';
import { usePagination } from '../../../../hooks/usePagination';
import ImportReceiptFormModal from './ImportReceiptFormModal';
import ImportReceiptDetailModal from './ImportReceiptDetailModal';
import PasswordConfirmDialog from '../../../../components/Common/PasswordConfirmDialog';
import { toast } from 'react-toastify';
import {
  PageWrapper,
  HeaderSection,
  HeaderLeft,
  HeaderIconBox,
  AddButton,
  ContentSection,
} from '../shared/StyledComponents';

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
      placeholder="Search by supplier..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      size="small"
      sx={{ 
        flexGrow: 1, 
        maxWidth: 300,
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
    />
  );
});

SearchInput.displayName = 'SearchInput';

const ImportReceiptList: React.FC = () => {
  const [receipts, setReceipts] = useState<ImportReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState<number | null>(null);
  const [editingReceiptId, setEditingReceiptId] = useState<number | null>(null);
  const [deletingReceiptId, setDeletingReceiptId] = useState<number | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(10);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(supplierSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [supplierSearch]);

  useEffect(() => {
    loadData();
  }, [paginationState.page, paginationState.rowsPerPage, debouncedSearch, startDate, endDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const filters: any = {
        page: paginationState.page,
        size: paginationState.rowsPerPage,
      };
      
      if (debouncedSearch) {
        filters.supplierName = debouncedSearch;
      }
      
      if (startDate) {
        filters.startDate = startDate.toISOString();
      }
      
      if (endDate) {
        filters.endDate = endDate.toISOString();
      }
      
      const response = await getImportReceipts(filters);
      
      setReceipts(response.content);
      setPaginationData(response.totalPages, response.totalElements);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load import receipts');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = useCallback((value: string) => {
    setSupplierSearch(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSupplierSearch('');
    setDebouncedSearch('');
  }, []);

  const handleCreate = useCallback(() => {
    setEditingReceiptId(null);
    setFormModalOpen(true);
  }, []);

  const handleEdit = useCallback((receiptId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingReceiptId(receiptId);
    setFormModalOpen(true);
  }, []);

  const handleDelete = useCallback((receiptId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingReceiptId(receiptId);
    setPasswordDialogOpen(true);
  }, []);

  const handleConfirmDelete = async (password: string) => {
    if (!deletingReceiptId) return;
    
    try {
      setDeleteLoading(true);
      await deleteImportReceipt(deletingReceiptId, password);
      toast.success('Import receipt deleted successfully');
      setPasswordDialogOpen(false);
      setDeletingReceiptId(null);
      loadData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Failed to delete import receipt');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRowClick = useCallback((receiptId: number) => {
    setSelectedReceiptId(receiptId);
    setDetailModalOpen(true);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setFormModalOpen(false);
    setEditingReceiptId(null);
    loadData();
  }, []);

  if (loading && receipts.length === 0) {
    return (
      <PageWrapper display="flex" justifyContent="center" alignItems="center" minHeight={360}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={40} thickness={3} sx={{ color: '#0066ff' }} />
          <Typography color="text.secondary" fontSize={14}>Loading import receipts...</Typography>
        </Stack>
      </PageWrapper>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <PageWrapper>
        <HeaderSection>
          <HeaderLeft>
            <HeaderIconBox>
              <Receipt sx={{ fontSize: 22 }} />
            </HeaderIconBox>
            <Box>
              <Typography fontWeight={700} fontSize={20} color="#0f172a" lineHeight={1.3}>
                Import Receipts Management
              </Typography>
              <Typography fontSize={13.5} color="#64748b" mt={0.3}>
                Track and manage product import receipts
              </Typography>
            </Box>
          </HeaderLeft>
          <AddButton variant="contained" startIcon={<Add sx={{ fontSize: 18 }} />} onClick={handleCreate}>
            Create Import Receipt
          </AddButton>
        </HeaderSection>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontSize: 13.5 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <ContentSection>
          <Box display="flex" gap={2} mb={3} flexWrap="wrap">
            <SearchInput
              searchTerm={supplierSearch}
              onSearchChange={handleSearchChange}
              onClearSearch={handleClearSearch}
            />
            
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ 
                textField: { 
                  size: 'small',
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8fafc',
                    },
                  },
                } 
              }}
            />
            
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ 
                textField: { 
                  size: 'small',
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8fafc',
                    },
                  },
                } 
              }}
            />
          </Box>
          
          <TableContainer component={Paper} sx={{ 
            overflowX: 'auto',
            borderRadius: 3,
            border: '1px solid #eaeef8',
            boxShadow: 'none'
          }}>
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8faff' }}>
                  <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Date</TableCell>
                  <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Supplier</TableCell>
                  <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Total Cost</TableCell>
                  <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Created By</TableCell>
                  <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Items</TableCell>
                  <TableCell sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {receipts.map((receipt) => (
                  <TableRow 
                    key={receipt.id}
                    hover
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f8faff' }
                    }}
                    onClick={() => handleRowClick(receipt.id)}
                  >
                    <TableCell>
                      <Typography>
                        {dayjs(receipt.createdAt).format('DD/MM/YYYY HH:mm')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>
                        {receipt.supplierName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600} color="primary">
                        {receipt.totalCost.toLocaleString()} VNĐ
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {receipt.createdByName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {receipt.itemCount} items
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={0.5} justifyContent="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => handleEdit(receipt.id, e)}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(0, 102, 255, 0.08)',
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => handleDelete(receipt.id, e)}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(211, 47, 47, 0.08)',
                            },
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
              labelRowsPerPage="Receipts per page:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} receipts`
              }
            />
          </Box>

          {receipts.length === 0 && !loading && (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary" mb={2}>
                No import receipts available
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Create your first import receipt to get started
              </Typography>
              <AddButton variant="contained" startIcon={<Add />} onClick={handleCreate}>
                Create Import Receipt
              </AddButton>
            </Box>
          )}
        </ContentSection>

        <ImportReceiptFormModal
          open={formModalOpen}
          onClose={() => {
            setFormModalOpen(false);
            setEditingReceiptId(null);
          }}
          onSuccess={handleFormSuccess}
          receiptId={editingReceiptId}
        />

        <ImportReceiptDetailModal
          open={detailModalOpen}
          receiptId={selectedReceiptId}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedReceiptId(null);
          }}
          onReceiptUpdated={loadData}
        />

        <PasswordConfirmDialog
          open={passwordDialogOpen}
          onClose={() => {
            setPasswordDialogOpen(false);
            setDeletingReceiptId(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Import Receipt"
          message="Please enter your password to confirm deletion. This will restore the stock quantities."
          loading={deleteLoading}
        />
      </PageWrapper>
    </LocalizationProvider>
  );
};

export default ImportReceiptList;
