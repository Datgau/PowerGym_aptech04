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
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  TextField,
  InputAdornment
} from '@mui/material';
import { Add, Edit, Delete, People, Visibility, Search, Clear } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getAllUsers, getUsersByRole, getUserCounts, searchUsers, createUser, updateUser, deleteUser, getAllRolesLegacy, type UserResponse, type Role } from '../../../../services/adminService.ts';
import UserFormModal from './UserFormModal.tsx';
import DeleteConfirmModal from '../DeleteConfirmModal.tsx';
import UserDetailModal from './UserDetailModal.tsx';
import TablePagination from '../../../../components/Common/TablePagination';
import { usePagination } from '../../../../hooks/usePagination';

/* ─── Styled Components ─────────────────────────────────── */

// Memoized Search Input Component để tránh re-render
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
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [userCounts, setUserCounts] = useState<{
    USER: number;
    STAFF: number;
    TOTAL: number;
  }>({ USER: 0, STAFF: 0, TOTAL: 0 });
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

  // Load initial data and user counts - tách biệt để tránh conflict với search
  useEffect(() => {
    if (!isSearching) {
      loadUserCounts();
      loadData(paginationState.page, paginationState.rowsPerPage);
    }
  }, [paginationState.page, paginationState.rowsPerPage, roleFilter, isSearching]);

  // Handle search with useDeferredValue - optimized to prevent focus loss
  useEffect(() => {
    if (deferredSearch.length >= 2) {
      // Chỉ set isSearching nếu chưa search
      if (!isSearching) {
        setIsSearching(true);
      }
      
      // Tạo function riêng để tránh dependencies
      const performSearch = async () => {
        try {
          const response = await searchUsers(
            deferredSearch, 
            roleFilter, 
            0, // Always start from page 0 for new search
            paginationState.rowsPerPage
          );
          if (response.success) {
            const pageData = response.data;
            setMembers(pageData.content);
            setPaginationData(pageData.totalPages, pageData.totalElements);
            // Không reset page để tránh re-render
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
            roleFilter === 'ALL' 
              ? getAllUsers(0, paginationState.rowsPerPage)
              : getUsersByRole(roleFilter, 0, paginationState.rowsPerPage),
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

  // Handle pagination changes during search - separate effect
  useEffect(() => {
    if (isSearching && deferredSearch.length >= 2 && paginationState.page > 0) {
      const performPaginatedSearch = async () => {
        try {
          const response = await searchUsers(
            deferredSearch, 
            roleFilter, 
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

  const loadUserCounts = useCallback(async () => {
    try {
      const countsRes = await getUserCounts();
      if (countsRes.success) {
        setUserCounts(countsRes.data);
      }
    } catch (err: unknown) {
      console.error('Failed to load user counts:', err);
    }
  }, []);

  const loadData = useCallback(async (page: number = 0, size: number = 10) => {
    // Chỉ load data khi không search
    if (isSearching) {
      return;
    }

    try {
      setLoading(true);

      const [usersRes, rolesRes] = await Promise.all([
        roleFilter === 'ALL' 
          ? getAllUsers(page, size)
          : getUsersByRole(roleFilter, page, size),
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
    } finally {
      setLoading(false);
    }
  }, [roleFilter, isSearching, setPaginationData]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    setIsSearching(false);
  }, []);

  // Memoize search change handler
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

  const handleOpenDelete = useCallback((user: UserResponse) => {
    setSelectedUser(user);
    setOpenDelete(true);
  }, []);

  const handleOpenDetail = useCallback((user: UserResponse) => {
    setSelectedUser(user);
    setOpenDetail(true);
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
      
      // Close modal and reload data
      setOpenForm(false);
      await loadUserCounts(); // Reload counts
      await loadData(paginationState.page, paginationState.rowsPerPage);
      
    } catch (error: any) {
      // Re-throw error so UserFormModal can handle it
      throw error;
    }
  }, [formMode, selectedUser, loadUserCounts, loadData, paginationState.page, paginationState.rowsPerPage]);

  const handleDelete = useCallback(async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id);
      await loadUserCounts(); // Reload counts
      await loadData(paginationState.page, paginationState.rowsPerPage);
    }
  }, [selectedUser, loadUserCounts, loadData, paginationState.page, paginationState.rowsPerPage]);

  const handleFilterChange = useCallback((_event: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
    if (newFilter !== null) {
      setRoleFilter(newFilter);
      handleChangePage(null, 0);
      // Reset search state khi thay đổi filter
      if (isSearching) {
        // Sẽ được handle bởi useEffect khi deferredSearch thay đổi
        setIsSearching(false);
        setTimeout(() => setIsSearching(true), 50);
      }
    }
  }, [handleChangePage, isSearching]);

  // Không cần filteredMembers nữa vì backend đã filter
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
      {/* ── Header ── */}
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
              Manage gym members and staff accounts
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
        {/* ── Search Bar ── */}
        <Box mb={3}>
          <SearchInput
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />
        </Box>

        {/* ── Filter Bar ── */}
        <Box mb={3}>
          <ToggleButtonGroup
            value={roleFilter}
            exclusive
            onChange={handleFilterChange}
            size="small"
            sx={{

              '& .MuiToggleButton-root': {
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                color: '#64748b',
                fontWeight: 500,
                fontSize: '0.875rem',
                px: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: '#f8fafc',
                },
                '&.Mui-selected': {
                  backgroundColor: '#0066ff',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#0052cc',
                  },
                },
              },
            }}
          >
            <ToggleButton sx={{mr:2}} value="ALL">All ({userCounts.TOTAL})</ToggleButton>
            <ToggleButton sx={{mr:2}} value="USER">
              User ({userCounts.USER})
            </ToggleButton>
            <ToggleButton sx={{mr:2}} value="STAFF">
              Staff ({userCounts.STAFF})
            </ToggleButton>
          </ToggleButtonGroup>
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
                <TableCell sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#0f172a' }}>Role</TableCell>
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
                      label={member.role?.name || 'USER'} 
                      color={member.role?.name === 'STAFF' ? 'secondary' : 'primary'}
                      size="small"
                      sx={{ fontSize: { xs: '0.75rem', md: '0.8125rem' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDetail(member)}
                        title="View Details"
                        sx={{
                          color: '#0066ff',
                          '&:hover': { backgroundColor: 'rgba(0,102,255,0.1)' }
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
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
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDelete(member)}
                        sx={{
                          color: '#ef4444',
                          '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' }
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
                  : roleFilter === 'ALL' 
                    ? 'No members found' 
                    : `No ${roleFilter.toLowerCase()} members found`
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
              ) : roleFilter !== 'ALL' && (
                <Button 
                  variant="outlined" 
                  onClick={() => setRoleFilter('ALL')}
                  sx={{ borderRadius: 2, mr: 2 }}
                >
                  Show All Members
                </Button>
              )}
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
        allowedRoles={['USER', 'STAFF']}
      />

      <UserDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        userId={selectedUser?.id || null}
      />

      <DeleteConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        title="Delete Member"
        message={`Are you sure you want to delete member "${selectedUser?.fullName}"?`}
      />
    </PageWrapper>
  );
};

export default MembersTable;
