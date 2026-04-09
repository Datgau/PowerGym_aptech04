import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import { Close, Edit, Delete } from '@mui/icons-material';
import dayjs from 'dayjs';
import { getImportReceiptById, deleteImportReceipt } from '../../../../services/importReceiptService';
import type { ImportReceiptDetail } from '../../../../types/importReceipt';
import ImportReceiptFormModal from './ImportReceiptFormModal';
import PasswordConfirmDialog from '../../../../components/Common/PasswordConfirmDialog';
import { toast } from 'react-toastify';

interface ImportReceiptDetailModalProps {
  open: boolean;
  receiptId: number | null;
  onClose: () => void;
  onReceiptUpdated?: () => void;
}

const ImportReceiptDetailModal: React.FC<ImportReceiptDetailModalProps> = ({
  open,
  receiptId,
  onClose,
  onReceiptUpdated,
}) => {
  const [receipt, setReceipt] = useState<ImportReceiptDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (open && receiptId) {
      loadReceipt();
    }
  }, [open, receiptId]);

  const loadReceipt = async () => {
    if (!receiptId) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await getImportReceiptById(receiptId);
      setReceipt(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load import receipt details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    setPasswordDialogOpen(true);
  };

  const handleConfirmDelete = async (password: string) => {
    if (!receiptId) return;
    
    try {
      setDeleteLoading(true);
      await deleteImportReceipt(receiptId, password);
      toast.success('Import receipt deleted successfully');
      setPasswordDialogOpen(false);
      onClose();
      if (onReceiptUpdated) {
        onReceiptUpdated();
      }
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

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    loadReceipt();
    if (onReceiptUpdated) {
      onReceiptUpdated();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Import Receipt Details
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {receipt && !loading && (
          <Box>
            {/* Receipt Header */}
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Receipt ID
                  </Typography>
                  <Typography variant="h6">
                    #{receipt.id}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="caption" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="h6">
                    {dayjs(receipt.createdAt).format('DD/MM/YYYY HH:mm')}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" gap={4} mb={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Supplier
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {receipt.supplierName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created By
                  </Typography>
                  <Typography variant="body1">
                    {receipt.createdByName}
                  </Typography>
                </Box>
              </Box>

              {receipt.notes && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography variant="body2">
                    {receipt.notes}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Items Table */}
            <Box>
              <Typography variant="h6" mb={2}>
                Items
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {receipt.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Typography fontWeight={600}>
                            {item.productName}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {item.quantity}
                        </TableCell>
                        <TableCell align="right">
                          {item.unitPrice.toLocaleString()} VNĐ
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={600}>
                            {item.subtotal.toLocaleString()} VNĐ
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Box textAlign="right">
                  <Typography variant="caption" color="text.secondary">
                    Total Cost
                  </Typography>
                  <Typography variant="h5" color="primary" fontWeight={700}>
                    {receipt.totalCost.toLocaleString()} VNĐ
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      {receipt && !loading && (
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleEdit}
            sx={{ borderRadius: 2 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      )}

      {/* Edit Modal */}
      {receipt && (
        <ImportReceiptFormModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSuccess={handleEditSuccess}
          receiptId={receiptId}
          initialData={receipt}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <PasswordConfirmDialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Import Receipt"
        message="Please enter your password to confirm deletion. This will restore the stock quantities."
        loading={deleteLoading}
      />
    </Dialog>
  );
};

export default ImportReceiptDetailModal;
