import React, { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const SearchContainer = styled(Box)({
  marginBottom: 24,
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    background: '#ffffff',
    borderRadius: 12,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#0066ff',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#0066ff',
    },
  },
});

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  placeholder = 'Search by member name or email...',
  debounceMs = 300,
}) => {
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange, value]);

  return (
    <SearchContainer>
      <StyledTextField
        fullWidth
        size="small"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#64748b' }} />
            </InputAdornment>
          ),
        }}
      />
    </SearchContainer>
  );
};

export default SearchBox;
