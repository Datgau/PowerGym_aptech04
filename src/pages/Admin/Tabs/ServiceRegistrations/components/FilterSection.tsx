import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
  RegistrationStatus,
  PaymentStatus,
  RegistrationType,
  type FilterState
} from '../../../../../types/serviceRegistration';

const FilterContainer = styled(Box)({
  background: '#f8faff',
  borderRadius: 12,
  padding: '20px 24px',
  border: '1px solid #eaeef8',
  marginBottom: 24,
});

const StyledFormControl = styled(FormControl)({
  minWidth: 180,
  '& .MuiOutlinedInput-root': {
    background: '#ffffff',
    borderRadius: 10,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#0066ff',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#0066ff',
    },
  },
});

const ClearButton = styled(Button)({
  borderRadius: 10,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 14,
  padding: '8px 20px',
  color: '#64748b',
  borderColor: '#cbd5e1',
  '&:hover': {
    borderColor: '#94a3b8',
    background: '#f8faff',
  },
});

interface FilterSectionProps {
  filters: FilterState;
  onFilterChange: (filterType: keyof FilterState, value: any) => void;
  onClearFilters: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const hasActiveFilters = 
    filters.status !== null || 
    filters.paymentStatus !== null || 
    filters.registrationType !== null;

  return (
    <FilterContainer>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
        <Box display="flex" alignItems="center" gap={1} color="#64748b">
          <FilterList fontSize="small" />
          <Box fontWeight={600} fontSize={14}>Filters:</Box>
        </Box>

        <StyledFormControl size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status || ''}
            label="Status"
            onChange={(e) => onFilterChange('status', e.target.value || null)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={RegistrationStatus.ACTIVE}>Active</MenuItem>
            <MenuItem value={RegistrationStatus.EXPIRED}>Expired</MenuItem>
            <MenuItem value={RegistrationStatus.CANCELLED}>Cancelled</MenuItem>
            <MenuItem value={RegistrationStatus.COMPLETED}>Completed</MenuItem>
          </Select>
        </StyledFormControl>

        <StyledFormControl size="small">
          <InputLabel>Payment Status</InputLabel>
          <Select
            value={filters.paymentStatus || ''}
            label="Payment Status"
            onChange={(e) => onFilterChange('paymentStatus', e.target.value || null)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={PaymentStatus.PENDING}>Pending</MenuItem>
            <MenuItem value={PaymentStatus.SUCCESS}>Success</MenuItem>
            <MenuItem value={PaymentStatus.FAILED}>Failed</MenuItem>
            <MenuItem value={PaymentStatus.EXPIRED}>Expired</MenuItem>
          </Select>
        </StyledFormControl>

        <StyledFormControl size="small">
          <InputLabel>Registration Type</InputLabel>
          <Select
            value={filters.registrationType || ''}
            label="Registration Type"
            onChange={(e) => onFilterChange('registrationType', e.target.value || null)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={RegistrationType.ONLINE}>Online</MenuItem>
            <MenuItem value={RegistrationType.COUNTER}>Counter</MenuItem>
          </Select>
        </StyledFormControl>

        {hasActiveFilters && (
          <ClearButton
            variant="outlined"
            size="small"
            startIcon={<Clear fontSize="small" />}
            onClick={onClearFilters}
          >
            Clear Filters
          </ClearButton>
        )}
      </Stack>
    </FilterContainer>
  );
};

export default FilterSection;
