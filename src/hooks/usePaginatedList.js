import { useState, useRef, useMemo } from 'react';

export const usePaginatedList = ({
  data,
  pageSize = 10,
  filterFn = () => true,
  searchFn = () => true,
  sortFn = null,
  initialFilters = {}
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [creatingItem, setCreatingItem] = useState(false);
  const [tempItem, setTempItem] = useState(null);

  const isSearching = searchTerm.trim() !== "";
  const isFiltering = Object.keys(filters).some(k => filters[k] === false);
  const usingSearchOrFilters = isSearching || isFiltering;

  const filteredData = useMemo(() => {
    if (!data) return [];
    let result = data
      .filter((item) => filterFn(item, filters))
      .filter((item) => searchFn(item, searchTerm));
    if (sortFn) {
      result = [...result].sort(sortFn); // 👈 Ordena si hay sortFn
    }
    return result;
  }, [data, filterFn, filters, searchFn, searchTerm, sortFn]);

  return {
    paginated: filteredData.slice(0, pageSize),
    filtered: filteredData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    loaderRef: useRef(), // opcional si tu PaginatedCardGrid lo espera
    loading: false,
    hasMore: false,
    creatingItem,
    setCreatingItem,
    tempItem,
    setTempItem,
    isUsingFilters: usingSearchOrFilters,
    resetPagination: () => { } // ya no es necesario pero por compat
  };
};
