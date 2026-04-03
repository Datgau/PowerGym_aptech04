import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Divider
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

const PRIMARY_COLOR = '#00b4ff';

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
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }
          }}
      >
        {/* HEADER */}
        <DialogTitle
            sx={{
              background: `linear-gradient(135deg, ${PRIMARY_COLOR}, #0090cc)`,
              color: '#fff',
              px: 3,
              py: 2
            }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={600}>
              Confirm Registration
            </Typography>
            <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  color: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)'
                  }
                }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        {/* CONTENT */}
        <DialogContent sx={{ px: 3, py: 3 }}>
          {selectedPackage && (
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {selectedPackage.name}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                  {selectedPackage.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* PRICE */}
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{ color: PRIMARY_COLOR }}
                  >
                    {selectedPackage.price}
                  </Typography>

                  {selectedPackage.originalPrice && (
                      <Typography
                          variant="body2"
                          sx={{
                            textDecoration: 'line-through',
                            color: 'gray'
                          }}
                      >
                        {selectedPackage.originalPrice}
                      </Typography>
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Are you sure you want to register for this package?
                </Typography>
              </Box>
          )}
        </DialogContent>

        {/* ACTIONS */}
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: 'none'
              }}
          >
            Cancel
          </Button>

          <Button
              onClick={onConfirm}
              disabled={processing}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${PRIMARY_COLOR}, #0090cc)`,
                color: '#fff',
                px: 3,
                '&:hover': {
                  opacity: 0.9
                },
                '&.Mui-disabled': {
                  background: '#ccc',
                  color: '#666'
                }
              }}
          >
            {processing ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default ConfirmationDialog;