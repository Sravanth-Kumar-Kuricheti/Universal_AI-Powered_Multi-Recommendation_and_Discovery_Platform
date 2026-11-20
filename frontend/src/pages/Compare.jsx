import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Trash2, ExternalLink, Check, AlertCircle, ArrowLeft, Star, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { recommendationService } from '../services/recommendationService';

export function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useApp();
  const navigate = useNavigate();

  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (compareList.length >= 2) {
      setLoading(true);
      recommendationService
        .compareItems(compareList)
        .then((data) => {
          setCompareData(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setCompareData(null);
    }
  }, [compareList]);

  if (compareList.length < 2) {
    return (
      <div className="flex-1 bg-[#F7F7FC] p-6 sm:p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-[#7C22F5] flex items-center justify-center mb-4 shadow-purple-glow-sm">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#11152B] mb-2">
          Compare Recommendations
        </h2>
        <p className="text-sm text-[#667085] max-w-md mb-6 leading-relaxed">
          Select at least 2 recommendations (up to 5) by clicking the compare icon on any recommendation card to analyze their features, ratings, prices, and trade-offs side by side.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white font-medium text-xs shadow-purple-glow-sm hover:opacity-95 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Discover Recommendations</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F7F7FC] p-4 sm:p-8 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DCE0EE] mb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-[#7C22F5] font-semibold flex items-center gap-1 mb-1 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to results</span>
          </button>
          <h1 className="text-2xl font-bold text-[#11152B] tracking-tight">
            Side-by-Side Comparison ({compareList.length} items)
          </h1>
        </div>

        <button
          onClick={clearCompare}
          className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 w-fit"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Comparison</span>
        </button>
      </div>

      {/* AI Comparative Analysis Summary */}
      {compareData?.analysis && (
        <div className="mb-6 p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-[#11152B] leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-[#7C22F5] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Comparative Assessment</span>
          </div>
          <p>{compareData.analysis.summary}</p>
        </div>
      )}

      {/* Comparison Table */}
      <div className="bg-white border border-[#DCE0EE] rounded-[13px] shadow-card overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#DCE0EE] bg-slate-50/80">
              <th className="p-4 font-bold text-[#667085] uppercase tracking-wider w-44 shrink-0">
                Attribute
              </th>
              {compareList.map((item) => (
                <th key={item.id} className="p-4 min-w-[240px] max-w-[280px]">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#7C22F5]">
                      {item.source}
                    </span>
                    <button
                      onClick={() => removeFromCompare(item.id)}
                      className="text-slate-400 hover:text-rose-500"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-sm text-[#11152B] line-clamp-2 mb-2">
                    {item.title}
                  </h3>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7C22F5] hover:underline"
                  >
                    <span>Open Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#DCE0EE]/70">
            {/* Match Score */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-[#667085]">RecoMind Match</td>
              {compareList.map((item) => (
                <td key={item.id} className="p-4">
                  <span className="inline-flex items-center gap-1 font-bold text-[#7C22F5] px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200">
                    <Sparkles className="w-3 h-3" />
                    <span>{item.match_score || 90}% Match</span>
                  </span>
                </td>
              ))}
            </tr>

            {/* Official Rating */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-[#667085]">Community Rating</td>
              {compareList.map((item) => (
                <td key={item.id} className="p-4">
                  {item.rating ? (
                    <div className="flex items-center gap-1 text-amber-700 font-bold">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{item.rating} / 5.0</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">Not Rated</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Price / Access */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-[#667085]">Price / Access</td>
              {compareList.map((item) => (
                <td key={item.id} className="p-4 font-medium text-[#11152B]">
                  {item.price || 'Free / Open'}
                </td>
              ))}
            </tr>

            {/* Level */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-[#667085]">Skill Level</td>
              {compareList.map((item) => (
                <td key={item.id} className="p-4 text-[#667085]">
                  {item.level || 'All Levels'}
                </td>
              ))}
            </tr>

            {/* Duration / Format */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-[#667085]">Duration / Format</td>
              {compareList.map((item) => (
                <td key={item.id} className="p-4 text-[#667085]">
                  {item.duration || 'Self-paced'}
                </td>
              ))}
            </tr>

            {/* Description */}
            <tr className="hover:bg-slate-50/50">
              <td className="p-4 font-semibold text-[#667085]">Summary</td>
              {compareList.map((item) => (
                <td key={item.id} className="p-4 text-[#667085] leading-relaxed">
                  {item.description}
                </td>
              ))}
            </tr>

            {/* Advantages */}
            <tr className="hover:bg-slate-50/50 bg-emerald-50/20">
              <td className="p-4 font-semibold text-emerald-800">Key Advantages</td>
              {compareList.map((item) => {
                const advs = compareData?.analysis?.advantages?.[item.id] || ['Verified source', 'High relevance'];
                return (
                  <td key={item.id} className="p-4">
                    <ul className="space-y-1">
                      {advs.map((a, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-emerald-700">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                );
              })}
            </tr>

            {/* Limitations */}
            <tr className="hover:bg-slate-50/50 bg-amber-50/20">
              <td className="p-4 font-semibold text-amber-800">Considerations</td>
              {compareList.map((item) => {
                const lims = compareData?.analysis?.limitations?.[item.id] || ['Requires self-discipline'];
                return (
                  <td key={item.id} className="p-4">
                    <ul className="space-y-1">
                      {lims.map((l, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-amber-700">
                          <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
