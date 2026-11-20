import React from 'react';

const TAB_DEFS = [
  { id: 'all', label: 'All Results' },
  { id: 'courses', label: 'Courses' },
  { id: 'videos', label: 'Videos' },
  { id: 'articles', label: 'Articles' },
  { id: 'books', label: 'Books' },
  { id: 'tools', label: 'Tools' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'projects', label: 'Projects' },
  { id: 'communities', label: 'Communities' },
  { id: 'products', label: 'Products' },
  { id: 'other', label: 'Other' },
];

export function CategoryTabs({ activeCategory, categoryCounts = {}, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-none py-2.5 flex items-center gap-2 border-b border-[#DCE0EE]">
      {TAB_DEFS.map((tab) => {
        const isActive = activeCategory === tab.id;
        const count = categoryCounts[tab.id];

        // Only hide if tab has zero count and isn't 'all' and isn't active
        if (count === 0 && !isActive && tab.id !== 'all') {
          return null;
        }

        return (
          <button
            key={tab.id}
            onClick={() => onSelectCategory(tab.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all flex items-center gap-1.5 ${
              isActive
                ? 'bg-[#7C22F5] text-white shadow-sm shadow-[#7C22F5]/20 font-semibold'
                : 'text-[#667085] hover:text-[#11152B] hover:bg-slate-200/60 bg-white border border-[#DCE0EE]/80'
            }`}
          >
            <span>{tab.label}</span>
            {count !== undefined && count !== null && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-[#667085]'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
