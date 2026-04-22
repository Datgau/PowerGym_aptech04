import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Snackbar
} from '@mui/material';
import { Close, Person, Print } from '@mui/icons-material';
import membershipPackageService from '../../../../services/membershipPackageService';
import { downloadInvoice } from '../../../../services/api';

interface PackageMembersModalProps {
  open: boolean;
  onClose: () => void;
  packageId: number;
  packageName: string;
}

const PackageMembersModal: React.FC<PackageMembersModalProps> = ({
  open,
  onClose,
  packageId,
  packageName
}) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [printingInvoice, setPrintingInvoice] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open && packageId) {
      loadMembers();
    }
  }, [open, packageId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await membershipPackageService.getPackageMembers(packageId);
      setMembers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'EXPIRED':
        return 'error';
      case 'SUSPENDED':
        return 'warning';
      case 'CANCELLED':
        return 'default';
      default:
        return 'default';
    }
  };

  const handlePrintInvoice = async (member: any) => {
    if (!member.orderId) {
      setError('No payment order found for this membership');
      return;
    }

    try {
      setPrintingInvoice(member.id);
      const blob = await downloadInvoice(member.orderId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `membership-invoice-${member.orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success message
      setSuccessMessage(`Invoice downloaded successfully for ${member.user?.fullName}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download invoice');
    } finally {
      setPrintingInvoice(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '80vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2.5,
          px: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Person />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Package Members
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.3 }}>
              {packageName}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={6}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : members.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 6,
              color: 'text.secondary'
            }}
          >
            <Person sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No members yet
            </Typography>
            <Typography variant="body2">
              No users have registered for this package
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>User</strong></TableCell>
                  <TableCell><strong>Start Date</strong></TableCell>
                  <TableCell><strong>End Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="right"><strong>Amount</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {member.user?.fullName || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {member.user?.email || ''}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(member.startDate)}</TableCell>
                    <TableCell>{formatDate(member.endDate)}</TableCell>
                    <TableCell>
                      <Chip
                        label={member.status}
                        size="small"
                        color={getStatusColor(member.status)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {member.paidAmount?.toLocaleString('vi-VN')}đ
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip
                        title={
                          !member.orderId
                            ? 'No payment order available'
                            : 'Download membership invoice'
                        }
                      >
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handlePrintInvoice(member)}
                            disabled={!member.orderId || printingInvoice === member.id}
                            sx={{
                              color: member.orderId ? '#1976d2' : '#ccc',
                              backgroundColor: member.orderId ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                              borderRadius: '8px',
                              width: 32,
                              height: 32,
                              '&:hover': {
                                backgroundColor: member.orderId ? 'rgba(25, 118, 210, 0.12)' : 'transparent',
                                transform: member.orderId ? 'scale(1.05)' : 'none',
                              },
                              '&:disabled': {
                                backgroundColor: 'transparent',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {printingInvoice === member.id ? (
                              <CircularProgress size={16} />
                            ) : (
                              <Print fontSize="small" />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default PackageMembersModal;
