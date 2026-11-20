import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, Filter, Star } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';

export function FilterSidebar({ onFilterChange }) {
  const { filters, setFilters, resetFilters, categoryCounts } = useSearch();

  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [levelOpen, setLevelOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);

  const priceOptions = [
    { label: 'Free', value: 'free' },
    { label: 'Paid', value: 'paid' },
    { label: 'Free Trial', value: 'trial' },
    { label: 'Freemium', value: 'freemium' },
  ];

  const levelOptions = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ];

  const ratingOptions = [
    { label: '4.5 & above', value: 4.5 },
    { label: '4.0 & above', value: 4.0 },
    { label: '3.5 & above', value: 3.5 },
  ];

  // Count active filters
  const activeCount = Object.values(filters).filter(Boolean).length;

  const handlePriceSelect = (val) => {
    const newVal = filters.price === val ? null : val;
    const nextFilters = { ...filters, price: newVal };
    setFilters(nextFilters);
    if (onFilterChange) onFilterChange(nextFilters);
  };

  const handleLevelSelect = (val) => {
    const newVal = filters.level === val ? null : val;
    const nextFilters = { ...filters, level: newVal };
    setFilters(nextFilters);
    if (onFilterChange) onFilterChange(nextFilters);
  };

  const handleRatingSelect = (val) => {
    const newVal = filters.min_rating === val ? null : val;
    const nextFilters = { ...filters, min_rating: newVal };
    setFilters(nextFilters);
    if (onFilterChange) onFilterChange(nextFilters);
  };

  const handleClearAll = () => {
    resetFilters();
    if (onFilterChange) {
      onFilterChange({ price: null, level: null, min_rating: null, source: null });
    }
  };

  return (
    <aside className="w-[202px] shrink-0 bg-white border border-[#DCE0EE] rounded-[11px] p-[13px] shadow-sm select-none h-fit">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DCE0EE] mb-3">
        <div className="flex items-center gap-1.5 font-bold text-[13px] text-[#11152B]">
          <Filter className="w-3.5 h-3.5 text-[#7C22F5]" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#7C22F5] text-white text-[10px] flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={handleClearAll}
            className="text-[11px] text-[#7C22F5] hover:underline flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* 1. Price Filter Section */}
      <div className="py-2.5 border-b border-slate-100">
        <button
          onClick={() => setPriceOpen(!priceOpen)}
          className="w-full flex items-center justify-between text-[12px] font-semibold text-[#11152B] mb-2"
        >
          <span>Price</span>
          {priceOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#667085]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />}
        </button>
        {priceOpen && (
          <div className="space-y-1.5 pl-1">
            {priceOptions.map((opt) => {
              const checked = filters.price === opt.value;
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 text-[12px] text-[#667085] hover:text-[#11152B] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handlePriceSelect(opt.value)}
                    className="w-3.5 h-3.5 accent-[#7C22F5] rounded border-slate-300 cursor-pointer"
                  />
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Skill Level Filter Section */}
      <div className="py-2.5 border-b border-slate-100">
        <button
          onClick={() => setLevelOpen(!levelOpen)}
          className="w-full flex items-center justify-between text-[12px] font-semibold text-[#11152B] mb-2"
        >
          <span>Level</span>
          {levelOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#667085]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />}
        </button>
        {levelOpen && (
          <div className="space-y-1.5 pl-1">
            {levelOptions.map((opt) => {
              const checked = filters.level === opt.value;
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 text-[12px] text-[#667085] hover:text-[#11152B] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleLevelSelect(opt.value)}
                    className="w-3.5 h-3.5 accent-[#7C22F5] rounded border-slate-300 cursor-pointer"
                  />
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Minimum Rating Filter Section */}
      <div className="py-2.5">
        <button
          onClick={() => setRatingOpen(!ratingOpen)}
          className="w-full flex items-center justify-between text-[12px] font-semibold text-[#11152B] mb-2"
        >
          <span>Rating</span>
          {ratingOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#667085]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />}
        </button>
        {ratingOpen && (
          <div className="space-y-1.5 pl-1">
            {ratingOptions.map((opt) => {
              const checked = filters.min_rating === opt.value;
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 text-[12px] text-[#667085] hover:text-[#11152B] cursor-pointer"
                >
                  <input
                    type="radio"
                    name="min_rating"
                    checked={checked}
                    onChange={() => handleRatingSelect(opt.value)}
                    className="w-3.5 h-3.5 accent-[#7C22F5] cursor-pointer"
                  />
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{opt.label}</span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
