import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useApp();
  const navigate = useNavigate();

  if (!compareList || compareList.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 left-5 md:left-auto md:w-[480px] z-40 bg-[#17102F] border border-purple-500/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-white animate-slide-up">
      <div className="flex items-center gap-2.5 overflow-hidden">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C22F5] to-[#A855F7] flex items-center justify-center shrink-0 shadow-purple-glow-sm">
          <Scale className="w-4 h-4 text-white" />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-bold text-white leading-tight">
            Compare ({compareList.length}/5)
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {compareList.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-purple-200 border border-purple-400/20 truncate max-w-[100px]"
              >
                <span className="truncate">{item.title}</span>
                <button
                  onClick={() => removeFromCompare(item.id)}
                  className="hover:text-rose-400"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={clearCompare}
          className="text-[11px] text-slate-400 hover:text-white px-1.5 py-1"
        >
          Clear
        </button>

        <button
          onClick={() => navigate('/compare')}
          disabled={compareList.length < 2}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white font-semibold text-xs flex items-center gap-1.5 shadow-purple-glow-sm hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <span>Compare</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
