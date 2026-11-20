import React from 'react';
import { Sparkles, ArrowRight, HelpCircle, Lightbulb } from 'lucide-react';

export function SearchSuggestions({ suggestions, onSelectQuery, onAskQuestion }) {
  if (!suggestions) return null;

  const { summary, alternatives = [], related_queries = [], follow_up_questions = [] } = suggestions;

  if (!summary && !related_queries.length && !follow_up_questions.length) return null;

  return (
    <div className="w-full bg-gradient-to-r from-purple-50 via-white to-indigo-50/40 border border-purple-200/60 rounded-[13px] p-4 mb-5 shadow-xs">
      {/* 1. AI Search Summary */}
      {summary && (
        <div className="flex items-start gap-2.5 mb-3.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#7C22F5] to-[#A855F7] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-purple-glow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#7C22F5] uppercase tracking-wider mb-0.5">
              AI Recommendation Overview
            </div>
            <p className="text-[12.5px] text-[#11152B] leading-relaxed font-medium">
              {summary}
            </p>
          </div>
        </div>
      )}

      {/* 2. Related Suggestions Chips */}
      {related_queries.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#667085] uppercase tracking-wider mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>This Might Also Interest You</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {related_queries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onSelectQuery && onSelectQuery(q)}
                className="px-3 py-1 rounded-full bg-white border border-[#DCE0EE] hover:border-[#7C22F5] hover:text-[#7C22F5] text-[12px] text-[#11152B] font-medium transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <span>{q}</span>
                <ArrowRight className="w-3 h-3 text-[#7C22F5]" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Follow-up Questions Chips */}
      {follow_up_questions.length > 0 && (
        <div className="pt-2 border-t border-purple-100/60">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#667085] uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#7C22F5]" />
            <span>Follow-up Questions for AI</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {follow_up_questions.map((fq, idx) => (
              <button
                key={idx}
                onClick={() => onAskQuestion && onAskQuestion(fq)}
                className="px-3 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-300/40 text-[12px] text-[#7C22F5] font-medium transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span>"{fq}"</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
