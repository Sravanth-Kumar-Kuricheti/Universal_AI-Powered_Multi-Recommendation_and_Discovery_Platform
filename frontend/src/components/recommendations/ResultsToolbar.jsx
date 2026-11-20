import React from 'react';
import { LayoutGrid, ListFilter, ArrowUpDown } from 'lucide-react';

export function ResultsToolbar({
  totalResults,
  startCount,
  endCount,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-2 text-[12px] text-[#667085]">
      {/* Stats counter */}
      <div>
        Showing{' '}
        <span className="font-semibold text-[#11152B]">
          {totalResults > 0 ? `${startCount}–${endCount}` : '0'}
        </span>{' '}
        of <span className="font-semibold text-[#11152B]">{totalResults}</span> results
      </div>

      {/* Sorting and view toggle */}
      <div className="flex items-center gap-3">
        {/* Sort dropdown */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#667085]" />
          <span className="hidden sm:inline">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-white border border-[#DCE0EE] rounded-lg px-2.5 py-1 text-[12px] font-medium text-[#11152B] outline-none focus:border-[#7C22F5] cursor-pointer"
          >
            <option value="relevance">Relevance</option>
            <option value="match">Highest Match</option>
            <option value="rating">Highest Rated</option>
            <option value="date">Recently Published</option>
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center border border-[#DCE0EE] rounded-lg bg-white p-0.5">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-[#7C22F5] text-white shadow-xs'
                : 'text-[#667085] hover:text-[#11152B]'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-[#7C22F5] text-white shadow-xs'
                : 'text-[#667085] hover:text-[#11152B]'
            }`}
            title="List view"
          >
            <ListFilter className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
