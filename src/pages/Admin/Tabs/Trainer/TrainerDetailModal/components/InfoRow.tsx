import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';

interface Props {
  icon: React.ReactNode;
  text?: string | null;
}

const InfoRow: React.FC<Props> = ({ icon, text }) => (
  <ListItem disablePadding sx={{ mb: 1 }}>
    <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>{icon}</ListItemIcon>
    <ListItemText primary={text}
      primaryTypographyProps={{ variant: 'body2', color: 'text.primary', fontWeight: 500 }} />
  </ListItem>
);

export default InfoRow;
