import React from 'react';
import { TablePagination as MuiTablePagination } from '@mui/material';

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
  labelRowsPerPage = "Số dòng mỗi trang",
  labelDisplayedRows = ({ from, to, count }) =>
    `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`
}) => {
  return (
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
  );
};

export default TablePagination;