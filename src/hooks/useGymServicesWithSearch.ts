import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  gymServiceApi,
  type GymServiceDto
} from '../services/gymService';
import type { PageResponse } from '../@type/apiResponse';

interface UseGymServicesWithSearchReturn {
  services: GymServiceDto[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
  rowsPerPage: number;
  searchTerm: string;
  selectedCategory: string;
  categories: Array<{ id: number; name: string; displayName: string }>;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchChange: (term: string) => void;
  handleCategoryChange: (categoryId: string) => void;
  clearFilters: () => void;
}

export const useGymServicesWithSearch = (initialPageSize: number = 6): UseGymServicesWithSearchReturn => {
  const [allServices, setAllServices] = useState<GymServiceDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Extract unique categories from services
  const categories = useMemo(() => {
    const uniqueCategories = allServices.reduce((acc, service) => {
      const category = service.category;
      if (category && !acc.find(c => c.id === category.id)) {
        acc.push({
          id: category.id,
          name: category.name,
          displayName: category.displayName
        });
      }
      return acc;
    }, [] as Array<{ id: number; name: string; displayName: string }>);
    
    return uniqueCategories.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [allServices]);

  // Filter services based on search term and category
  const filteredServices = useMemo(() => {
    let filtered = allServices;

    // Filter by search term (name or description)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(term) ||
        service.description.toLowerCase().includes(term) ||
        (service.category?.displayName?.toLowerCase().includes(term)) ||
        (service.category?.name?.toLowerCase().includes(term))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(service => 
        service.category?.id.toString() === selectedCategory
      );
    }

    return filtered;
  }, [allServices, searchTerm, selectedCategory]);

  // Paginate filtered services
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedServices = filteredServices.slice(startIndex, endIndex);
    
    return {
      content: paginatedServices,
      totalElements: filteredServices.length,
      totalPages: Math.ceil(filteredServices.length / pageSize),
      first: currentPage === 0,
      last: currentPage >= Math.ceil(filteredServices.length / pageSize) - 1,
      numberOfElements: paginatedServices.length
    };
  }, [filteredServices, currentPage, pageSize]);

  // Fetch all services initially
  const fetchAllServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all services by getting multiple pages
      let allFetchedServices: GymServiceDto[] = [];
      let page = 0;
      let hasMore = true;
      
      while (hasMore) {
        const response = await gymServiceApi.getServicesActivePaginated(page, 50); // Large page size
        
        if (response.success && response.data) {
          allFetchedServices = [...allFetchedServices, ...response.data.content];
          hasMore = !response.data.last;
          page++;
        } else {
          hasMore = false;
          if (page === 0) {
            setError(response.message || 'Failed to fetch services');
          }
        }
      }
      
      setAllServices(allFetchedServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllServices();
  }, [fetchAllServices]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, selectedCategory]);

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < paginatedData.totalPages) {
      setCurrentPage(page);
    }
  }, [paginatedData.totalPages]);

  const nextPage = useCallback(() => {
    if (!paginatedData.last) {
      setCurrentPage(prev => prev + 1);
    }
  }, [paginatedData.last]);

  const previousPage = useCallback(() => {
    if (!paginatedData.first) {
      setCurrentPage(prev => prev - 1);
    }
  }, [paginatedData.first]);

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
  }, []);

  return {
    services: paginatedData.content,
    loading,
    error,
    currentPage,
    totalPages: paginatedData.totalPages,
    totalElements: paginatedData.totalElements,
    hasNext: !paginatedData.last,
    hasPrevious: !paginatedData.first,
    rowsPerPage: pageSize,
    searchTerm,
    selectedCategory,
    categories,
    goToPage,
    nextPage,
    previousPage,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
    handleCategoryChange,
    clearFilters
  };
};