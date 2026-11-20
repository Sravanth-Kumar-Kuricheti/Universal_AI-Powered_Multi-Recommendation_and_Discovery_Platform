import React from 'react';
import { Sparkles, Shield, Cpu, Database, Globe, Search, Layers, ExternalLink } from 'lucide-react';

export function About() {
  const sources = [
    { name: 'GitHub REST API', cat: 'Developer Projects & Code', desc: 'Global open source repositories, stars, licenses, and maintainers.' },
    { name: 'Hugging Face', cat: 'AI Models & Datasets', desc: 'State-of-the-art open models, transformers, downloads, and spaces.' },
    { name: 'Open Library', cat: 'Books & Literature', desc: 'Over 20 million cataloged books with covers, authors, and preview access.' },
    { name: 'Google Books', cat: 'Digital Books & Previews', desc: 'Worldwide collection of academic, technical, and general literature.' },
    { name: 'arXiv.org', cat: 'Scientific Research', desc: 'Open-access archive for 2+ million peer-reviewed scientific papers.' },
    { name: 'YouTube Data API', cat: 'Video Tutorials & Demos', desc: 'Educational video tutorials, lectures, tech demos, and course playlists.' },
    { name: 'TMDB', cat: 'Cinema & Entertainment', desc: 'The Movie Database providing posters, genres, and community ratings.' },
    { name: 'OpenStreetMap', cat: 'Travel & Destinations', desc: 'Community-driven geographic discovery, tourist places, and landmarks.' },
    { name: 'Pexels & Media', cat: 'Visual Imagery', desc: 'High-definition licensed photos and visual creative assets.' },
    { name: 'Hacker News & Tech Pulse', cat: 'Articles & Industry News', desc: 'Real-time discussions, engineering blogs, and technology updates.' },
    { name: 'Coursera & edX Discovery', cat: 'Accredited Learning', desc: 'University courses, certifications, and specialized curriculums.' },
  ];

  return (
    <div className="flex-1 bg-[#F7F7FC] p-4 sm:p-8 max-w-[1200px] mx-auto w-full space-y-8">
      {/* Brand Hero Box */}
      <div className="bg-gradient-to-br from-[#17102F] via-[#10152C] to-[#211040] text-white rounded-2xl p-6 sm:p-10 border border-purple-800/40 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-[#7C22F5]/20 rounded-full blur-[90px] pointer-events-none" />

        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C22F5] to-[#A855F7] p-1 flex items-center justify-center shadow-purple-glow-sm">
            <img src="/logo.svg" alt="RecoMind AI Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-purple-300 font-bold text-xs uppercase tracking-widest">
            Universal AI Platform
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
          RecoMind AI
        </h1>
        <p className="text-base sm:text-lg text-purple-200 font-medium italic mb-4">
          "Discover Everything. Find What Fits You."
        </p>

        <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl leading-relaxed">
          RecoMind AI is a universal recommendation platform designed to eliminate the tedious process of visiting dozens of separate sites. A single natural-language query aggregates verified courses, products, movies, books, jobs, developer tools, and research from trusted internet providers — ranked intelligently by our hybrid recommendation engine.
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Zero Account Required</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Multi-Source Concurrent Retrieval</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold">
            <Cpu className="w-4 h-4 text-[#C084FC]" />
            <span>Hybrid Cosine & TF-IDF Scoring</span>
          </div>
        </div>
      </div>

      {/* Recommendation Engine Architecture */}
      <div className="bg-white border border-[#DCE0EE] rounded-2xl p-6 sm:p-8 shadow-card">
        <h2 className="text-lg font-bold text-[#11152B] mb-2 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#7C22F5]" />
          <span>The RecoMind Hybrid Recommendation Engine</span>
        </h2>
        <p className="text-xs text-[#667085] leading-relaxed mb-6">
          Recommendations are ranked using a multi-factor mathematical scoring model:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200/60">
            <div className="text-xl font-extrabold text-[#7C22F5] mb-1">40%</div>
            <div className="font-bold text-xs text-[#11152B] mb-1">Query Relevance</div>
            <div className="text-[11px] text-[#667085]">
              Exact token matching, semantic keyword alignment in titles and subject taxonomies.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/60">
            <div className="text-xl font-extrabold text-blue-600 mb-1">25%</div>
            <div className="font-bold text-xs text-[#11152B] mb-1">Content Similarity</div>
            <div className="text-[11px] text-[#667085]">
              TF-IDF bi-gram feature extraction and cosine vector similarity between query and description.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
            <div className="text-xl font-extrabold text-emerald-600 mb-1">20%</div>
            <div className="font-bold text-xs text-[#11152B] mb-1">Preference Match</div>
            <div className="text-[11px] text-[#667085]">
              Active filter matching including zero-cost preferences (Free), skill level, and format.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60">
            <div className="text-xl font-extrabold text-amber-600 mb-1">15%</div>
            <div className="font-bold text-xs text-[#11152B] mb-1">Quality Signals</div>
            <div className="text-[11px] text-[#667085]">
              Verified community ratings, provider reputation, and metadata completeness.
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Data Providers */}
      <div className="bg-white border border-[#DCE0EE] rounded-2xl p-6 sm:p-8 shadow-card">
        <h2 className="text-lg font-bold text-[#11152B] mb-2 flex items-center gap-2">
          <Database className="w-5 h-5 text-[#7C22F5]" />
          <span>Integrated Internet Sources & Public Registries</span>
        </h2>
        <p className="text-xs text-[#667085] leading-relaxed mb-6">
          RecoMind AI queries actual internet providers and respects their authentication limits, quotas, and terms:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {sources.map((s) => (
            <div key={s.name} className="p-3.5 rounded-xl border border-[#DCE0EE] bg-slate-50/50">
              <div className="font-bold text-[#11152B] mb-0.5">{s.name}</div>
              <div className="text-[10px] font-semibold text-[#7C22F5] mb-1">{s.cat}</div>
              <div className="text-[11px] text-[#667085] leading-snug">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
