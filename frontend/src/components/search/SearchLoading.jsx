import React from 'react';

export function SearchLoading() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {/* Overview skeleton */}
      <div className="h-20 bg-slate-200/70 rounded-[13px] w-full mb-6" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px]">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-[#DCE0EE] rounded-[13px] p-[13px] space-y-3 shadow-card"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-16 bg-slate-200 rounded-md" />
              <div className="h-5 w-6 bg-slate-200 rounded-full" />
            </div>
            <div className="flex gap-3">
              <div className="w-[74px] h-[74px] bg-slate-200 rounded-[9px] shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-purple-100 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-3 bg-slate-200 rounded w-full" />
              <div className="h-3 bg-slate-200 rounded w-4/5" />
            </div>
            <div className="h-8 bg-gradient-to-r from-purple-200 to-indigo-100 rounded-[9px] w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
