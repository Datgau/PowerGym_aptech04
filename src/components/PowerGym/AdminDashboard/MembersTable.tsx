import React from 'react';
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
  Avatar,
  Chip,
  IconButton
} from '@mui/material';
import { Add, Visibility, Edit, Delete } from '@mui/icons-material';
import type { Member } from '../../../data/adminMockData';

interface MembersTableProps {
  members: Member[];
  onOpenDialog: (type: 'add' | 'edit' | 'view', item?: any) => void;
}

const MembersTable: React.FC<MembersTableProps> = ({ members, onOpenDialog }) => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
          Member Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => onOpenDialog('add')}
          sx={{ 
            background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          Add Member
        </Button>
      </Box>
      
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: { xs: 650, md: 750 } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Member</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Package</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, display: { xs: 'none', sm: 'table-cell' } }}>Join Date</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Status</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, display: { xs: 'none', md: 'table-cell' } }}>Last Visit</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={member.avatar} sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }} />
                    <Box>
                      <Typography fontWeight={600} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, display: { xs: 'none', sm: 'block' } }}>
                        {member.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={member.membershipType} 
                    color={member.membershipType === 'VIP' ? 'secondary' : 'primary'}
                    size="small"
                    sx={{ fontSize: { xs: '0.75rem', md: '0.8125rem' } }}
                  />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                  {new Date(member.joinDate).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={member.status === 'active' ? 'Active' : 'Expired'} 
                    color={member.status === 'active' ? 'success' : 'error'}
                    size="small"
                    sx={{ fontSize: { xs: '0.75rem', md: '0.8125rem' } }}
                  />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                  {new Date(member.lastVisit).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={0.5}>
                    <IconButton size="small" onClick={() => onOpenDialog('view', member)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => onOpenDialog('edit', member)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MembersTable;
