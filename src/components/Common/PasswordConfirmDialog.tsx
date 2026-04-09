import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Close, Visibility, VisibilityOff, Lock } from '@mui/icons-material';

interface PasswordConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  title: string;
  message: string;
  loading?: boolean;
}

const PasswordConfirmDialog: React.FC<PasswordConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  loading = false,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleConfirm = () => {
    if (password.trim()) {
      onConfirm(password);
    }
  };

  const handleClose = () => {
    setPassword('');
    setShowPassword(false);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && password.trim()) {
      handleConfirm();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)',
          color: 'white',
          position: 'relative',
          py: 2.5,
          px: 3,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Lock sx={{ fontSize: 24 }} />
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
        </Box>

        <IconButton
          onClick={handleClose}
          disabled={loading}
          sx={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Typography variant="body2" color="text.secondary" mb={3}>
          {message}
        </Typography>

        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          autoFocus
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!password.trim() || loading}
          variant="contained"
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #045668 0%, #00b4ff 40%, #1366ba 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #034556 0%, #0099dd 40%, #0f5299 100%)',
            },
          }}
        >
          {loading ? 'Confirming...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordConfirmDialog;
