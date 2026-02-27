import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { PackageOption } from '../../../@type/powergym';

interface ConfirmationDialogProps {
  readonly open: boolean;
  readonly package: PackageOption | null;
  readonly processing: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => Promise<void>;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  package: selectedPackage,
  processing,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Confirm Package Registration
          <Button onClick={onClose} size="small">
            <Close />
          </Button>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {selectedPackage && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {selectedPackage.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {selectedPackage.description}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              {selectedPackage.price}
              {selectedPackage.originalPrice && (
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through', ml: 1 }}
                >
                  {selectedPackage.originalPrice}
                </Typography>
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Are you sure you want to register for this package?
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Confirm Registration'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;