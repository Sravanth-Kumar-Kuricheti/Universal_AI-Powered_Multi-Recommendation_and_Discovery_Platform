import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, Loader2 } from 'lucide-react';
import { useSearch, INITIAL_SUGGESTIONS } from '../../context/SearchContext';

export function SearchHero({ onSearch }) {
  const { query, setQuery, isLoading } = useSearch();
  const [localInput, setLocalInput] = useState(query || '');

  useEffect(() => {
    setLocalInput(query || '');
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localInput.trim()) return;
    setQuery(localInput);
    if (onSearch) {
      onSearch(localInput);
    }
  };

  const handleChipClick = (suggestion) => {
    setLocalInput(suggestion);
    setQuery(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  const handleClear = () => {
    setLocalInput('');
    setQuery('');
  };

  return (
    <section className="relative w-full bg-[#10152C] border-b border-purple-900/30 overflow-hidden py-6 sm:py-8 px-4 sm:px-6">
      {/* Decorative ambient background wave & glowing aura */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[300px] bg-[#7C22F5]/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-[300px] h-[200px] bg-[#A855F7]/10 rounded-full blur-[70px] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left / Center: Search Titles & Search Bar */}
        <div className="flex-1 w-full text-center md:text-left flex flex-col items-center md:items-start">
          {/* Main heading */}
          <h1 className="text-2xl sm:text-[28px] md:text-[30px] font-extrabold text-white leading-tight tracking-tight mb-2">
            Find the Best{' '}
            <span className="bg-gradient-to-r from-white via-purple-200 to-[#C084FC] bg-clip-text text-transparent">
              Recommendations
            </span>{' '}
            for Anything!
          </h1>

          {/* Subtitle */}
          <p className="text-[12px] sm:text-[13px] text-purple-200/80 max-w-2xl mb-5 leading-relaxed">
            Courses, Products, Movies, Books, Jobs, Tools, Travel, Food and more — all in one place, powered by AI. ✨
          </p>

          {/* Search Form (approx 687px max-width, 46px height, 24px radius) */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[687px] flex flex-col sm:flex-row items-center gap-2.5"
          >
            <div className="relative w-full h-[46px] flex items-center bg-white/10 backdrop-blur-md border border-purple-400/30 rounded-[24px] px-3.5 focus-within:border-[#C084FC] focus-within:ring-2 focus-within:ring-[#7C22F5]/30 shadow-lg transition-all">
              <Search className="w-4 h-4 text-purple-300 shrink-0 mr-2.5" />
              <input
                type="text"
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                placeholder="Search anything you want..."
                className="w-full bg-transparent text-white placeholder-purple-200/50 text-[13px] outline-none"
              />
              {localInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 rounded-full text-purple-300 hover:text-white hover:bg-white/10 mr-1"
                  title="Clear input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Submit button (~195x46px) */}
            <button
              type="submit"
              disabled={isLoading || !localInput.trim()}
              className="w-full sm:w-[195px] h-[46px] shrink-0 rounded-[24px] bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 shadow-purple-glow hover:opacity-95 active:scale-[0.98] disabled:opacity-50 transition-all select-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Get Recommendations</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </>
              )}
            </button>
          </form>

          {/* Suggestion Chips */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 mt-4">
            <span className="text-[11px] text-purple-300/70 font-medium mr-1 hidden sm:inline">
              Try searching:
            </span>
            {INITIAL_SUGGESTIONS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 hover:bg-purple-500/20 text-purple-200 border border-purple-400/20 hover:border-purple-300/40 transition-all active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Right: AI Robot Artwork (Compact, non-overlapping) */}
        <div className="hidden md:flex items-center justify-center shrink-0 w-[170px] lg:w-[200px] h-[170px] relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#7C22F5]/20 to-[#C084FC]/20 rounded-full blur-2xl" />
          <img
            src="/robot.svg"
            alt="RecoMind AI Futuristic Robot"
            className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(124,34,245,0.4)] animate-pulse"
            style={{ animationDuration: '4s' }}
          />
        </div>
      </div>
    </section>
  );
}
