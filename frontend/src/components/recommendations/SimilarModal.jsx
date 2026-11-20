import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { recommendationService } from '../../services/recommendationService';

export function SimilarModal({ item, onClose, onSelectSimilar }) {
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!item) return;
    let isMounted = true;
    setLoading(true);

    recommendationService
      .getSimilar(item.id, item.title, item.category || 'all')
      .then((data) => {
        if (isMounted) {
          setSimilarItems(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-[#DCE0EE] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#DCE0EE] flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7C22F5]" />
            <div>
              <h3 className="text-sm font-bold text-[#11152B]">
                Recommendations Similar to:
              </h3>
              <p className="text-xs text-[#7C22F5] font-semibold truncate max-w-md">
                "{item.title}"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#7C22F5]" />
              <span className="text-xs">Finding high-similarity alternatives...</span>
            </div>
          ) : similarItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No direct alternatives retrieved for this specific item right now.
            </div>
          ) : (
            similarItems.map((sim, i) => (
              <div
                key={sim.id || i}
                className="p-3 rounded-xl border border-[#DCE0EE] hover:border-[#7C22F5] bg-slate-50/50 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#7C22F5]">
                      {sim.source}
                    </span>
                    {sim.match_score && (
                      <span className="text-[10px] font-semibold text-emerald-600">
                        {sim.match_score}% Match
                      </span>
                    )}
                  </div>
                  <h4 className="text-[13px] font-semibold text-[#11152B] truncate">
                    {sim.title}
                  </h4>
                  <p className="text-[11px] text-[#667085] line-clamp-1">
                    {sim.description}
                  </p>
                </div>

                <a
                  href={sim.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#7C22F5] text-white font-medium text-xs flex items-center gap-1 hover:opacity-90 shrink-0"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
