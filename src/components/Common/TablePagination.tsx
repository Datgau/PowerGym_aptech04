import React from 'react';
import { TablePagination as MuiTablePagination, Box } from '@mui/material';

interface TablePaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowsPerPageOptions?: number[];
  labelRowsPerPage?: string;
  labelDisplayedRows?: (paginationInfo: { from: number; to: number; count: number }) => string;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 20, 50],
  labelRowsPerPage = "Rows per page",
  labelDisplayedRows = ({ from, to, count }) =>
  `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
}) => {
  return (
    <Box
      sx={{
        mt: 3,
        '& .MuiTablePagination-root': {
          border: 'none',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          '& .MuiTablePagination-toolbar': {
            px: 3,
            py: 1.5,
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontWeight: 600,
            color: '#1366ba',
          },
          '& .MuiTablePagination-select': {
            fontWeight: 600,
            color: '#045668',
          },
          '& .MuiIconButton-root': {
            color: '#1366ba',
            '&:hover': {
              background: 'rgba(19,102,186,0.1)',
            },
            '&.Mui-disabled': {
              color: 'rgba(0,0,0,0.26)',
            },
          },
        },
      }}
    >
      <MuiTablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={rowsPerPageOptions}
        labelRowsPerPage={labelRowsPerPage}
        labelDisplayedRows={labelDisplayedRows}
      />
    </Box>
  );
};

export default TablePagination;