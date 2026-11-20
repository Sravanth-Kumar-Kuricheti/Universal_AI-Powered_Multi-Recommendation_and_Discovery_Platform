import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, ArrowLeft, Trash2, Search, ArrowRight, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSearch } from '../context/SearchContext';

export function History() {
  const { history, removeHistoryItem, clearHistory } = useApp();
  const { setQuery, executeSearch } = useSearch();
  const navigate = useNavigate();

  const handleReopen = (queryText, category) => {
    setQuery(queryText);
    executeSearch(queryText, category || 'all');
    navigate('/');
  };

  const formatDate = (isoStr) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recent';
    }
  };

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
              Search History
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700">
              {history.length}
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-0.5">
            Your recent discovery queries saved locally in your browser.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 w-fit"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History Items */}
      {history.length === 0 ? (
        <div className="py-16 text-center bg-white border border-[#DCE0EE] rounded-[13px] p-6 shadow-xs max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3">
            <HistoryIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#11152B] mb-1">No search history</h3>
          <p className="text-xs text-[#667085] leading-relaxed mb-5">
            Queries you execute will be kept here for easy recall and instant re-searching.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white text-xs font-medium shadow-purple-glow-sm"
          >
            Start Searching
          </button>
        </div>
      ) : (
        <div className="space-y-2.5 max-w-3xl">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-white border border-[#DCE0EE] hover:border-[#7C22F5] shadow-xs flex items-center justify-between gap-4 transition-all group"
            >
              <div
                onClick={() => handleReopen(item.query, item.category)}
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#7C22F5] flex items-center justify-center shrink-0 group-hover:bg-[#7C22F5] group-hover:text-white transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-[#11152B] group-hover:text-[#7C22F5] transition-colors truncate">
                    {item.query}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#667085] mt-0.5">
                    <span className="capitalize">{item.category || 'all'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(item.timestamp)}</span>
                    </span>
                    {item.count > 0 && (
                      <>
                        <span>•</span>
                        <span>{item.count} items found</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleReopen(item.query, item.category)}
                  className="px-3 py-1.5 rounded-lg bg-purple-50 text-[#7C22F5] hover:bg-[#7C22F5] hover:text-white text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <span>Re-search</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => removeHistoryItem(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 transition-colors"
                  title="Remove query"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
