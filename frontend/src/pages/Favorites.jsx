import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, ArrowLeft, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RecommendationCard } from '../components/recommendations/RecommendationCard';

export function Favorites() {
  const { favorites } = useApp();
  const [searchFilter, setSearchFilter] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const navigate = useNavigate();

  const filteredFavorites = favorites.filter((item) => {
    const matchesSearch =
      !searchFilter ||
      item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchesCat = catFilter === 'all' || item.category === catFilter;
    return matchesSearch && matchesCat;
  });

  const categories = ['all', ...new Set(favorites.map((f) => f.category).filter(Boolean))];

  return (
    <div className="flex-1 bg-[#F7F7FC] p-4 sm:p-8 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE0EE] mb-6">
        <div>
          <button
            onClick={() => navigate('/')}
            className="text-xs text-[#7C22F5] font-semibold flex items-center gap-1 mb-1 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Discover more</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#11152B] tracking-tight">
              My Favorites
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-600">
              {favorites.length}
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-0.5">
            Saved securely in your browser session without account requirements.
          </p>
        </div>

        {/* Search & filter inside favorites */}
        {favorites.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search saved items..."
                className="pl-8 pr-3 py-1.5 bg-white border border-[#DCE0EE] rounded-lg text-xs outline-none focus:border-[#7C22F5] w-48"
              />
            </div>
            {categories.length > 1 && (
              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                className="py-1.5 px-3 bg-white border border-[#DCE0EE] rounded-lg text-xs font-medium outline-none focus:border-[#7C22F5] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Categories' : c.toUpperCase()}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <div className="py-16 text-center bg-white border border-[#DCE0EE] rounded-[13px] p-6 shadow-xs max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#11152B] mb-1">No favorites saved yet</h3>
          <p className="text-xs text-[#667085] leading-relaxed mb-5">
            Click the heart icon on any recommendation card to save it here for quick access at any time.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white text-xs font-medium shadow-purple-glow-sm"
          >
            Start Exploring
          </button>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#667085]">
          No saved favorites match your search filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px]">
          {filteredFavorites.map((item, index) => (
            <RecommendationCard key={item.id} item={item} rank={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
