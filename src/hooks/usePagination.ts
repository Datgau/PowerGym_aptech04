import { useState, useCallback } from 'react';

export interface PaginationState {
  page: number;
  rowsPerPage: number;
  totalPages: number;
  totalElements: number;
}

export interface UsePaginationReturn {
  paginationState: PaginationState;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setPaginationData: (totalPages: number, totalElements: number) => void;
  resetPagination: () => void;
}

export const usePagination = (
  initialRowsPerPage: number = 10
): UsePaginationReturn => {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    page: 0,
    rowsPerPage: initialRowsPerPage,
    totalPages: 0,
    totalElements: 0,
  });

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPaginationState(prev => ({
      ...prev,
      page: newPage,
    }));
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPaginationState(prev => ({
      ...prev,
      rowsPerPage: newRowsPerPage,
      page: 0, // Reset to first page when changing rows per page
    }));
  }, []);

  const setPaginationData = useCallback((totalPages: number, totalElements: number) => {
    setPaginationState(prev => ({
      ...prev,
      totalPages,
      totalElements,
    }));
  }, []);

  const resetPagination = useCallback(() => {
    setPaginationState(prev => ({
      ...prev,
      page: 0,
      totalPages: 0,
      totalElements: 0,
    }));
  }, []);

  return {
    paginationState,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationData,
    resetPagination,
  };
};