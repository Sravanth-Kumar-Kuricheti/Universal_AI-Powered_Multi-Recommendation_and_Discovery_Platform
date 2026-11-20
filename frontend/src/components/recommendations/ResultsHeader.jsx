import React, { useState } from 'react';
import { Bookmark, Share2, Download, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { searchService } from '../../services/searchService';

export function ResultsHeader({ query, totalResults, category }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSaveSearch = () => {
    setSaved(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#7C22F5', '#A855F7', '#C084FC'],
    });
    setTimeout(() => setSaved(false), 2500);
  };

  const handleExport = () => {
    if (!query) return;
    const url = searchService.getExportUrl(query, category);
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 pt-1 border-b border-[#DCE0EE]">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[#7C22F5] uppercase tracking-wider">
            Results
          </span>
          <span className="text-[11px] text-[#667085]">• Real-time Aggregation</span>
        </div>
        <h2 className="text-[18px] sm:text-[21px] font-bold text-[#11152B] tracking-tight">
          Recommendations for:{' '}
          <span className="text-[#7C22F5] font-extrabold italic">
            "{query || 'Everything'}"
          </span>
        </h2>
      </div>

      {/* Action buttons on the right */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSaveSearch}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all ${
            saved
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : 'border-[#DCE0EE] bg-white text-[#11152B] hover:bg-slate-50'
          }`}
          title="Save this search"
        >
          {saved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5 text-[#667085]" />}
          <span>{saved ? 'Saved!' : 'Save Search'}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCE0EE] bg-white text-[#11152B] hover:bg-slate-50 text-[12px] font-medium transition-all"
          title="Share recommendation results"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#667085]" />}
          <span>{copied ? 'Copied Link' : 'Share'}</span>
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white hover:opacity-95 text-[12px] font-medium shadow-sm transition-all"
          title="Export CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Results</span>
        </button>
      </div>
    </div>
  );
}
