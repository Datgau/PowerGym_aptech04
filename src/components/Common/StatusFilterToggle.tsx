import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, ButtonGroup, Button } from '@mui/material';

interface StatusFilterToggleProps {
  value: boolean | null; // null = all, true = active, false = inactive
  onChange: (value: boolean | null) => void;
  size?: 'small' | 'medium' | 'large';
}

const FilterButton = styled(Button)<{ active?: boolean }>(({ active, theme }) => ({
  minWidth: 60,
  height: 32,
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  backgroundColor: active ? '#10b981' : '#ffffff',
  color: active ? '#ffffff' : '#64748b',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    backgroundColor: active ? '#059669' : '#f8fafc',
    borderColor: active ? '#059669' : '#cbd5e1',
  },
  
  '&:not(:last-child)': {
    borderRight: 'none',
  },
  
  '&:first-of-type': {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  
  '&:last-child': {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  
  '&:not(:first-of-type):not(:last-child)': {
    borderRadius: 0,
  }
}));

const StatusFilterToggle: React.FC<StatusFilterToggleProps> = ({
  value,
  onChange,
  size = 'medium'
}) => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography variant="body2" color="text.secondary" fontWeight={500} fontSize="0.875rem">
        Status:
      </Typography>
      <ButtonGroup variant="outlined" size="small">
        <FilterButton
          active={value === null}
          onClick={() => onChange(null)}
        >
          All
        </FilterButton>
        <FilterButton
          active={value === true}
          onClick={() => onChange(true)}
        >
          Active
        </FilterButton>
        <FilterButton
          active={value === false}
          onClick={() => onChange(false)}
        >
          Inactive
        </FilterButton>
      </ButtonGroup>
    </Box>
  );
};

export default StatusFilterToggle;