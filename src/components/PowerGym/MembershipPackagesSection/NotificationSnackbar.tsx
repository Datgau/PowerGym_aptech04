import React from 'react';
import { Snackbar, Alert, Typography } from '@mui/material';
import type { NotificationMessage } from '../../../@type/powergym';

interface NotificationSnackbarProps {
  readonly notification: NotificationMessage | null;
  readonly onClose: () => void;
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
  notification,
  onClose
}) => {
  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={notification?.autoHide ? notification.duration : null}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={notification?.type || 'info'}
        variant="filled"
        sx={{ width: '100%' }}
      >
        <Typography variant="subtitle2" component="div">
          {notification?.title}
        </Typography>
        {notification?.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;