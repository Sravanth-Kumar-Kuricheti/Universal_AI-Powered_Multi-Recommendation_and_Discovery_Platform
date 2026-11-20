import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ currentPage, totalPages, totalResults, pageSize, onPageChange, onPageSizeChange }) {
  if (totalPages <= 1 && totalResults <= 12) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalResults);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-[#DCE0EE]/60 mt-6 text-[12px] text-[#667085]">
      {/* Result count stats */}
      <div>
        Showing <span className="font-semibold text-[#11152B]">{startItem}–{endItem}</span> of{' '}
        <span className="font-semibold text-[#11152B]">{totalResults}</span> recommendations
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-[#DCE0EE] text-[#11152B] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`min-w-[32px] h-8 px-2 rounded-lg font-medium transition-all ${
              currentPage === num
                ? 'bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white shadow-sm'
                : 'border border-[#DCE0EE] text-[#11152B] hover:bg-white'
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-[#DCE0EE] text-[#11152B] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <span>Items per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="bg-white border border-[#DCE0EE] rounded-lg px-2.5 py-1 text-[12px] font-medium text-[#11152B] outline-none focus:border-[#7C22F5]"
        >
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={48}>48</option>
        </select>
      </div>
    </div>
  );
}
