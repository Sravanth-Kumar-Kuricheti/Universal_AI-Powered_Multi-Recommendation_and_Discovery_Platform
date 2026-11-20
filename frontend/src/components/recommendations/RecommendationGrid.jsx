import React from 'react';
import { RecommendationCard } from './RecommendationCard';

export function RecommendationGrid({ items = [], viewMode = 'grid', onOpenSimilar }) {
  if (!items || items.length === 0) {
    return (
      <div className="w-full py-16 text-center bg-white border border-[#DCE0EE] rounded-[13px] p-6 shadow-xs">
        <div className="w-12 h-12 mx-auto rounded-full bg-purple-50 flex items-center justify-center text-[#7C22F5] mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-[16px] font-bold text-[#11152B] mb-1">No recommendations found</h3>
        <p className="text-[13px] text-[#667085] max-w-md mx-auto">
          We could not find items matching your active category or filters. Try clearing your filters or searching with different keywords.
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <RecommendationCard
            key={item.id || index}
            item={item}
            rank={index + 1}
            onOpenSimilar={onOpenSimilar}
          />
        ))}
      </div>
    );
  }

  // Default: 3-column desktop grid with 13-15px gap
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px]">
      {items.map((item, index) => (
        <RecommendationCard
          key={item.id || index}
          item={item}
          rank={index + 1}
          onOpenSimilar={onOpenSimilar}
        />
      ))}
    </div>
  );
}
