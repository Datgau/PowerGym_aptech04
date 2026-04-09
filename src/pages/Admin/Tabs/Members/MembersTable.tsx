import React, { useState, useEffect, useCallback, useDeferredValue, useRef, memo } from 'react';
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
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  TextField,
  InputAdornment, Tooltip
} from '@mui/material';
import { Add, Edit, Visibility, Search, Clear, People } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getUsersByRole, searchUsers, createUser, updateUser, getAllRolesLegacy, toggleUserStatus, type UserResponse, type Role } from '../../../../services/adminService.ts';
import UserFormModal from './UserFormModal.tsx';
import UserDetailModal from './UserDetailModal.tsx';
import TablePagination from '../../../../components/Common/TablePagination';
import { usePagination } from '../../../../hooks/usePagination';
import StatusFilterToggle from '../../../../components/Common/StatusFilterToggle.tsx';
import LockButton from '../../../../components/Common/LockButton.tsx';

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
      fullWidth
      placeholder="Search by email or phone number..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
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
      sx={{
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
    />
  );
});

SearchInput.displayName = 'SearchInput';

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

const MembersTable: React.FC = () => {
  const [members, setMembers] = useState<UserResponse[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null); // null = all, true = active, false = inactive
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  // Use useDeferredValue for better performance and focus retention
  const deferredSearch = useDeferredValue(searchTerm);

  const {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
  } = usePagination(5);
  useEffect(() => {
    if (!isSearching) {
      loadData(paginationState.page, paginationState.rowsPerPage);
    }
  }, [paginationState.page, paginationState.rowsPerPage, statusFilter, isSearching]);
  useEffect(() => {
    if (deferredSearch.length >= 2) {
      if (!isSearching) {
        setIsSearching(true);
      }
      const performSearch = async () => {
        try {
          const response = await searchUsers(
            deferredSearch, 
            'USER', 
            0,
            paginationState.rowsPerPage
          );
          if (response.success) {
            const pageData = response.data;
            setMembers(pageData.content);
            setPaginationData(pageData.totalPages, pageData.totalElements);
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Failed to search");
          }
        }
      };
      performSearch();
    } else if (deferredSearch.length === 0 && isSearching) {
      setIsSearching(false);
      // Reload normal data
      const reloadData = async () => {
        try {
          const [usersRes, rolesRes] = await Promise.all([
            getUsersByRole('USER', 0, paginationState.rowsPerPage),
            getAllRolesLegacy()
          ]);
          if (usersRes.success && rolesRes.success) {
            const pageData = usersRes.data;
            setMembers(pageData.content);
            setRoles(rolesRes.data);
            setPaginationData(pageData.totalPages, pageData.totalElements);
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Failed to load data");
          }
        }
      };
      reloadData();
    }
  }, [deferredSearch]);

  useEffect(() => {
    if (isSearching && deferredSearch.length >= 2 && paginationState.page > 0) {
      const performPaginatedSearch = async () => {
        try {
          const response = await searchUsers(
            deferredSearch, 
            'USER', 
            paginationState.page,
            paginationState.rowsPerPage
          );
          if (response.success) {
            const pageData = response.data;
            setMembers(pageData.content);
            setPaginationData(pageData.totalPages, pageData.totalElements);
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Failed to search");
          }
        }
      };
      performPaginatedSearch();
    }
  }, [paginationState.page, paginationState.rowsPerPage]);

  const loadData = useCallback(async (page: number = 0, size: number = 10) => {
    if (isSearching) {
      return;
    }

    try {
      setLoading(true);

      const [usersRes, rolesRes] = await Promise.all([
        getUsersByRole('USER', page, size),
        getAllRolesLegacy()
      ]);

      if (usersRes.success && rolesRes.success) {
        const pageData = usersRes.data;
        let filteredContent = pageData.content;
        
        // Apply status filter on frontend
        if (statusFilter !== null) {
          filteredContent = pageData.content.filter(user => 
            statusFilter ? (user.isActive !== false) : (user.isActive === false)
          );
        }
        
        setMembers(filteredContent);
        setRoles(rolesRes.data);
        setPaginationData(pageData.totalPages, pageData.totalElements);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load data");
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, isSearching, setPaginationData]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    setIsSearching(false);
  }, []);
  
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setSelectedUser(null);
    setFormMode('create');
    setOpenForm(true);
  }, []);

  const handleOpenEdit = useCallback((user: UserResponse) => {
    setSelectedUser(user);
    setFormMode('edit');
    setOpenForm(true);
  }, []);

  const handleOpenDetail = useCallback((user: UserResponse) => {
    setSelectedUser(user);
    setOpenDetail(true);
  }, []);

  const handleToggleStatus = useCallback(async (userId: number) => {
    try {
      const response = await toggleUserStatus(userId);
      if (response.success) {
        setMembers(prev =>
            prev.map(user =>
                user.id === userId
                    ? { ...user, isActive: !user.isActive }
                    : user
            )
        );

      } else {
        setError(response.message || 'Failed to toggle user status');
      }
    } catch (err: unknown) {
      setError('Failed to toggle user status');
    }
  }, []);

  const handleSubmit = useCallback(async (data: any) => {
    try {
      if (formMode === 'create') {
        const response = await createUser(data);
        if (!response.success) {
          throw new Error(response.message);
        }
      } else if (selectedUser) {
        const response = await updateUser(selectedUser.id, data);
        if (!response.success) {
          throw new Error(response.message);
        }
      }
      setOpenForm(false);
      await loadData(paginationState.page, paginationState.rowsPerPage);
      
    } catch (error: any) {
      throw error;
    }
  }, [formMode, selectedUser, loadData, paginationState.page, paginationState.rowsPerPage]);
  
  const filteredMembers = members;

  if (loading) {
    return (
      <PageWrapper display="flex" justifyContent="center" alignItems="center" minHeight={360}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={40} thickness={3} sx={{ color: '#0066ff' }} />
          <Typography color="text.secondary" fontSize={14}>Loading members...</Typography>
        </Stack>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <HeaderSection>
        <HeaderLeft>
          <HeaderIconBox>
            <People sx={{ fontSize: 22 }} />
          </HeaderIconBox>
          <Box>
            <Typography fontWeight={700} fontSize={20} color="#0f172a" lineHeight={1.3}>
              Member Management
            </Typography>
            <Typography fontSize={13.5} color="#64748b" mt={0.3}>
              Manage gym member accounts
            </Typography>
          </Box>
        </HeaderLeft>
        <AddButton variant="contained" startIcon={<Add sx={{ fontSize: 18 }} />} onClick={handleOpenCreate}>
          Add Member
        </AddButton>
      </HeaderSection>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontSize: 13.5 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <ContentSection>
        <Box mb={3}>
          <SearchInput
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />
        </Box>
        <Box mb={3} display="flex" justifyContent="flex-end" alignItems="center" flexWrap="wrap" gap={2}>
          <StatusFilterToggle
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </Box>
        
        <TableContainer component={Paper} sx={{ 
          overflowX: 'auto',
          borderRadius: 3,
          border: '1px solid #eaeef8',
          boxShadow: 'none'
        }}>
          <Table sx={{ minWidth: { xs: 650, md: 750 } }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8faff' }}>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Member</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Phone</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, display: { xs: 'none', md: 'table-cell' }, fontWeight: 600, color: '#0f172a' }}>Date of Birth</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, display: { xs: 'none', sm: 'table-cell' }, fontWeight: 600, color: '#0f172a' }}>Join Date</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Status</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} hover sx={{ '&:hover': { backgroundColor: '#f8faff' } }}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={member.avatar} sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }}>
                        {member.fullName?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                          {member.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                          {member.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    {member.phoneNumber || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    {member.dateOfBirth || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    {member.createDate ? new Date(member.createDate).toLocaleDateString('vi-VN') : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                        label={member.isActive ? 'ACTIVE' : 'INACTIVE'}
                        color={member.isActive ? 'success' : 'error'}
                        size="small"
                        sx={{ fontSize: { xs: '0.75rem', md: '0.8125rem' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5}>

                      {/* View */}
                      <Tooltip title="View Details">
                        <IconButton
                            size="small"
                            onClick={() => handleOpenDetail(member)}
                            sx={{
                              color: '#0066ff',
                              '&:hover': { backgroundColor: 'rgba(0,102,255,0.1)' }
                            }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Edit */}
                      <Tooltip title="Edit Member">
                        <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(member)}
                            sx={{
                              color: '#0066ff',
                              '&:hover': { backgroundColor: 'rgba(0,102,255,0.1)' }
                            }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Lock */}
                      <LockButton
                          isLocked={member.isActive === false}
                          onToggle={() => handleToggleStatus(member.id)}
                          size="small"
                          lockedTooltip="Activate member"
                          unlockedTooltip="Deactivate member"
                      />

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
            labelRowsPerPage="Members per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} members`
            }
          />
        </Box>

        {filteredMembers.length === 0 && (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary" mb={2}>
                {isSearching 
                  ? `No results found for "${searchTerm}"` 
                  : 'No members found'
                }
              </Typography>
              {isSearching ? (
                <Button 
                  variant="outlined" 
                  onClick={handleClearSearch}
                  sx={{ borderRadius: 2, mr: 2 }}
                >
                  Clear Search
                </Button>
              ) : null}
              <AddButton variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
                Add Member
              </AddButton>
            </Box>
        )}
      </ContentSection>

      <UserFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
        roles={roles}
        mode={formMode}
        allowedRoles={['USER']}
      />

      <UserDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        userId={selectedUser?.id || null}
      />

    </PageWrapper>
  );
};

export default MembersTable;