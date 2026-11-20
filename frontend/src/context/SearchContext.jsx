import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { searchService } from '../services/searchService';
import { useApp } from './AppContext';

const SearchContext = createContext();

export const INITIAL_SUGGESTIONS = [
  'Python courses',
  'Laptops under ₹60K',
  'AI tools for developers',
  'Movies like Interstellar',
  'Jobs for freshers',
];

export function SearchProvider({ children }) {
  const { addHistoryItem } = useApp();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [filters, setFilters] = useState({
    price: null,
    level: null,
    min_rating: null,
    source: null,
  });
  const [sort, setSort] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [results, setResults] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [suggestions, setSuggestions] = useState({
    summary: '',
    alternatives: [],
    related_queries: [],
    follow_up_questions: [],
  });
  const [providerStatus, setProviderStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeSearch = useCallback(
    async (
      searchQuery = query,
      searchCategory = category,
      searchFilters = filters,
      searchPage = 1,
      searchSort = sort
    ) => {
      const q = searchQuery.trim();
      if (!q) return;

      setQuery(q);
      setCategory(searchCategory);
      setIsLoading(true);
      setError(null);
      setPage(searchPage);

      try {
        const data = await searchService.search(
          q,
          searchCategory,
          searchFilters,
          searchPage,
          pageSize,
          searchSort
        );

        setResults(data.results || []);
        setCategoryCounts(data.category_counts || {});
        setTotalResults(data.total_results || 0);
        setTotalPages(data.total_pages || 1);
        setSuggestions(data.suggestions || {});
        setProviderStatus(data.provider_status || {});

        // Add to search history
        addHistoryItem(q, searchCategory, data.total_results || 0);
      } catch (err) {
        console.error('Search failed:', err);
        setError('One of the search providers is temporarily unavailable. Showing remaining results.');
      } finally {
        setIsLoading(false);
      }
    },
    [query, category, filters, sort, pageSize, addHistoryItem]
  );

  const resetFilters = useCallback(() => {
    setFilters({
      price: null,
      level: null,
      min_rating: null,
      source: null,
    });
  }, []);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        category,
        setCategory,
        filters,
        setFilters,
        sort,
        setSort,
        viewMode,
        setViewMode,
        page,
        setPage,
        pageSize,
        setPageSize,
        results,
        categoryCounts,
        totalResults,
        totalPages,
        suggestions,
        providerStatus,
        isLoading,
        error,
        executeSearch,
        resetFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
