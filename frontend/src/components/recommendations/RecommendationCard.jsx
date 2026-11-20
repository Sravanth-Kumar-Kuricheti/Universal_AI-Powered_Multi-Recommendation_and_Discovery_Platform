import React, { useState } from 'react';
import { Heart, ExternalLink, Star, Clock, Tag, HelpCircle, Layers, Check, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function RecommendationCard({ item, rank = 1, onOpenSimilar }) {
  const { toggleFavorite, isFavorite, toggleCompare, isInCompare } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);
  const [imgError, setImgError] = useState(false);

  const favorited = isFavorite(item.id);
  const inCompare = isInCompare(item.id);

  // Dynamic primary action button label based on category
  const getPrimaryLabel = () => {
    const cat = (item.category || '').toLowerCase();
    if (cat === 'courses') return 'Open Course';
    if (cat === 'videos') return 'Open Video';
    if (cat === 'products') return 'View Product';
    if (cat === 'articles') return 'Read Article';
    if (cat === 'books') return 'View Book';
    if (cat === 'jobs') return 'Apply Now';
    if (cat === 'projects') return 'Explore Project';
    if (cat === 'travel') return 'View Destination';
    return 'Visit Website';
  };

  // Thumbnail fallback image
  const defaultThumbnail =
    item.category === 'videos'
      ? 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=80'
      : item.category === 'books'
      ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80'
      : item.category === 'projects'
      ? 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80';

  const thumbnailSrc = !imgError && item.image_url ? item.image_url : defaultThumbnail;

  return (
    <div className="bg-white border border-[#DCE0EE] rounded-[13px] p-[13px] flex flex-col justify-between card-hover-effect shadow-card relative group">
      <div>
        {/* 1. Top Section: Rank, Source, Favorite & Compare */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            {/* Rank badge */}
            <span className="w-5 h-5 rounded-full bg-slate-100 text-[#11152B] font-bold text-[11px] flex items-center justify-center shrink-0">
              #{rank}
            </span>

            {/* Source label */}
            <span className="text-[11px] font-semibold text-[#7C22F5] px-2 py-0.5 rounded-md bg-purple-50 border border-purple-100 truncate max-w-[120px]">
              {item.source}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Compare checkbox / button */}
            <button
              onClick={() => toggleCompare(item)}
              className={`p-1.5 rounded-lg border text-[11px] font-medium transition-colors flex items-center gap-1 ${
                inCompare
                  ? 'bg-purple-100 border-[#7C22F5] text-[#7C22F5]'
                  : 'border-transparent text-[#667085] hover:bg-slate-100'
              }`}
              title={inCompare ? 'Remove from comparison' : 'Add to compare'}
            >
              <Layers className="w-3.5 h-3.5" />
              {inCompare && <Check className="w-3 h-3 text-[#7C22F5]" />}
            </button>

            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(item)}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  favorited ? 'text-rose-500 fill-rose-500' : 'text-[#667085] hover:text-rose-500'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 2. Main content: Thumbnail + Title + Match Score */}
        <div className="flex gap-3 mb-2.5">
          {/* Thumbnail image */}
          <div className="w-[74px] h-[74px] shrink-0 rounded-[9px] overflow-hidden bg-slate-100 border border-slate-200/80">
            <img
              src={thumbnailSrc}
              alt={item.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>

          {/* Title and RecoMind Match badge */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1.5 mb-1">
              <h3 className="text-[14px] font-semibold text-[#11152B] leading-snug line-clamp-2 hover:text-[#7C22F5] transition-colors">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </h3>
            </div>

            {/* RecoMind Match Score Badge */}
            {item.match_score && (
              <div className="relative inline-flex items-center gap-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-purple-500/15 to-[#7C22F5]/20 text-[#7C22F5] border border-purple-300/40">
                  <Sparkles className="w-2.5 h-2.5 text-[#7C22F5]" />
                  <span>{item.match_score}% Match</span>
                </span>
                
                {/* Tooltip trigger */}
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="text-slate-400 hover:text-[#7C22F5]"
                  aria-label="Match score explanation"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>

                {/* Score explanation tooltip */}
                {showTooltip && (
                  <div className="absolute left-0 bottom-full mb-1.5 w-52 p-2 bg-[#17102F] text-white text-[11px] rounded-lg shadow-xl border border-purple-500/30 z-30 pointer-events-none leading-relaxed">
                    {item.match_reason || 'Calculated relevance based on query keywords, rating, and source quality.'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Short description */}
        <p className="text-[12px] text-[#667085] leading-relaxed line-clamp-2 mb-3">
          {item.description || 'Verified resource recommendation from ' + item.source}
        </p>

        {/* Metadata badges (Rating, Price, Level, Duration) */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px]">
          {item.rating && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold border border-amber-200/80">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{item.rating}</span>
            </span>
          )}

          {item.price && (
            <span
              className={`px-2 py-0.5 rounded-md font-semibold ${
                item.price.toLowerCase().includes('free')
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              {item.price}
            </span>
          )}

          {item.level && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[#667085] font-medium border border-slate-200">
              {item.level}
            </span>
          )}

          {item.duration && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-[#667085] border border-slate-200">
              <Clock className="w-2.5 h-2.5" />
              <span className="truncate max-w-[110px]">{item.duration}</span>
            </span>
          )}
        </div>
      </div>

      {/* 3. Footer action buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
        {/* Primary Action Button (Opens real source) */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-[34px] rounded-[9px] bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white font-medium text-[12px] flex items-center justify-center gap-1.5 shadow-sm hover:opacity-95 active:scale-[0.98] transition-all"
        >
          <span>{getPrimaryLabel()}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Secondary Action: Similar Items */}
        <button
          onClick={() => onOpenSimilar && onOpenSimilar(item)}
          className="h-[34px] px-2.5 rounded-[9px] border border-[#DCE0EE] text-[#11152B] hover:bg-slate-50 hover:border-[#7C22F5] text-[12px] font-medium transition-all"
          title="Find similar recommendations"
        >
          Similar
        </button>
      </div>
    </div>
  );
}
