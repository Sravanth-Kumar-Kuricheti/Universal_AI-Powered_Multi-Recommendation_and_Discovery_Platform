import React, { useEffect, useState } from 'react';
import { SearchHero } from '../components/search/SearchHero';
import { ResultsHeader } from '../components/recommendations/ResultsHeader';
import { CategoryTabs } from '../components/recommendations/CategoryTabs';
import { FilterSidebar } from '../components/filters/FilterSidebar';
import { ResultsToolbar } from '../components/recommendations/ResultsToolbar';
import { RecommendationGrid } from '../components/recommendations/RecommendationGrid';
import { SearchSuggestions } from '../components/search/SearchSuggestions';
import { SearchLoading } from '../components/search/SearchLoading';
import { Pagination } from '../components/common/Pagination';
import { SimilarModal } from '../components/recommendations/SimilarModal';
import { useSearch } from '../context/SearchContext';
import { useApp } from '../context/AppContext';

export function Home() {
  const {
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
    isLoading,
    executeSearch,
  } = useSearch();

  const { setAiAssistantOpen } = useApp();
  const [selectedSimilarItem, setSelectedSimilarItem] = useState(null);

  // Initial automatic discovery search for smooth first load
  useEffect(() => {
    if (!query && results.length === 0) {
      const defaultQuery = 'Python AI full stack courses';
      setQuery(defaultQuery);
      executeSearch(defaultQuery, 'all');
    }
  }, []);

  const handleHeroSearch = (newQuery) => {
    setCategory('all');
    executeSearch(newQuery, 'all', filters, 1, sort);
  };

  const handleCategorySelect = (newCat) => {
    setCategory(newCat);
    executeSearch(query, newCat, filters, 1, sort);
  };

  const handleFilterChange = (newFilters) => {
    executeSearch(query, category, newFilters, 1, sort);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    executeSearch(query, category, filters, page, newSort);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    executeSearch(query, category, filters, newPage, sort);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleRelatedQuerySelect = (relatedQ) => {
    setQuery(relatedQ);
    executeSearch(relatedQ, category, filters, 1, sort);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskQuestion = (question) => {
    setAiAssistantOpen(true);
  };

  const startCount = (page - 1) * pageSize + 1;
  const endCount = Math.min(page * pageSize, totalResults);

  return (
    <div className="flex-1 flex flex-col bg-[#F7F7FC]">
      {/* 1. Hero Search Section */}
      <SearchHero onSearch={handleHeroSearch} />

      {/* 2. Main Discovery & Results Area (Background #F7F7FC) */}
      <div className="max-w-[1440px] w-full mx-auto p-4 sm:p-5 flex-1 flex flex-col">
        {/* Results Header */}
        <ResultsHeader
          query={query}
          totalResults={totalResults}
          category={category}
        />

        {/* Category Tabs with Actual Counts */}
        <CategoryTabs
          activeCategory={category}
          categoryCounts={categoryCounts}
          onSelectCategory={handleCategorySelect}
        />

        {/* Results Workspace: 2-column layout (Filter Sidebar + Main Feed) */}
        <div className="flex flex-col lg:flex-row gap-5 mt-4 flex-1">
          {/* Left Column: Filter Sidebar (202px width) */}
          <div className="hidden lg:block shrink-0">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </div>

          {/* Right Column: Recommendations Feed */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* AI Search Summary & Suggestions */}
            <SearchSuggestions
              suggestions={suggestions}
              onSelectQuery={handleRelatedQuerySelect}
              onAskQuestion={handleAskQuestion}
            />

            {/* Results Toolbar (counts, sort, view toggle) */}
            <ResultsToolbar
              totalResults={totalResults}
              startCount={startCount}
              endCount={endCount}
              sort={sort}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {/* Content: Grid or Loading State */}
            <div className="flex-1 mt-2">
              {isLoading ? (
                <SearchLoading />
              ) : (
                <RecommendationGrid
                  items={results}
                  viewMode={viewMode}
                  onOpenSimilar={(item) => setSelectedSimilarItem(item)}
                />
              )}
            </div>

            {/* Pagination */}
            {!isLoading && totalResults > 0 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalResults={totalResults}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  executeSearch(query, category, filters, 1, sort);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Similar Items Modal */}
      {selectedSimilarItem && (
        <SimilarModal
          item={selectedSimilarItem}
          onClose={() => setSelectedSimilarItem(null)}
          onSelectSimilar={(sim) => {
            setSelectedSimilarItem(null);
            setQuery(sim.title);
            executeSearch(sim.title);
          }}
        />
      )}
    </div>
  );
}
