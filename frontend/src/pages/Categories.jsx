import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CATEGORIES_LIST } from '../components/layout/Sidebar';
import { useSearch } from '../context/SearchContext';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Categories() {
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('cat');
  const { setCategory, executeSearch } = useSearch();
  const { setActiveCategory } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (catParam) {
      setCategory(catParam);
      setActiveCategory(catParam);
      executeSearch(catParam, catParam);
      navigate('/');
    }
  }, [catParam]);

  const handleSelect = (catId, defaultQ) => {
    setCategory(catId);
    setActiveCategory(catId);
    executeSearch(defaultQ || catId, catId);
    navigate('/');
  };

  const categoryDetails = [
    { id: 'courses', label: 'Courses & Learning', query: 'Top programming and data science courses', count: '10,000+ courses', desc: 'Coursera, edX, Harvard CS50, freeCodeCamp, MIT OpenCourseWare' },
    { id: 'products', label: 'Products & Shopping', query: 'Best laptops under 60000', count: '15,000+ products', desc: 'Tech gadgets, smartphones, laptops, monitors, accessories' },
    { id: 'movies', label: 'Movies & Entertainment', query: 'Top rated sci-fi and drama movies', count: '50,000+ films', desc: 'TMDB cinema, TV series, critically acclaimed streaming titles' },
    { id: 'books', label: 'Books & Reading', query: 'Best machine learning and AI books', count: '1M+ books', desc: 'Open Library, Google Books, technical classics, global literature' },
    { id: 'jobs', label: 'Jobs & Careers', query: 'Software engineer fresher jobs', count: 'Live postings', desc: 'Tech careers, remote software jobs, entry-level developer roles' },
    { id: 'tools', label: 'AI Tools & Resources', query: 'Best AI tools for developers', count: '1,200+ tools', desc: 'Hugging Face models, LLMs, AI agents, developer productivity suites' },
    { id: 'travel', label: 'Travel & Places', query: 'Best places to visit in India', count: 'Global locations', desc: 'OpenStreetMap landmarks, historic sites, city guides, travel itineraries' },
    { id: 'food', label: 'Food & Restaurants', query: 'Top rated international cuisines', count: 'Thousands', desc: 'Culinary destinations, authentic local dishes, dining recommendations' },
    { id: 'videos', label: 'Videos & Tutorials', query: 'Comprehensive Python video tutorials', count: '100K+ tutorials', desc: 'YouTube educational lectures, walkthroughs, project builds' },
    { id: 'projects', label: 'Developer Resources', query: 'Top open source AI projects', count: 'Millions of repos', desc: 'GitHub open source repositories, starter kits, production SDKs' },
    { id: 'articles', label: 'Research & Articles', query: 'Latest AI and machine learning papers', count: '2M+ papers', desc: 'arXiv research, Hacker News engineering discussions, Wikipedia encyclopedias' },
  ];

  return (
    <div className="flex-1 bg-[#F7F7FC] p-5 sm:p-8 max-w-[1440px] mx-auto w-full">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#7C22F5] text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Universal Taxonomy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#11152B] tracking-tight">
          Explore by Category
        </h1>
        <p className="text-sm text-[#667085] mt-1 max-w-2xl">
          Discover verified recommendations gathered from specialized APIs, open data registries, and top internet sources.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryDetails.map((cat) => {
          const match = CATEGORIES_LIST.find((c) => c.id === cat.id);
          const Icon = match ? match.icon : Sparkles;

          return (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat.id, cat.query)}
              className="bg-white border border-[#DCE0EE] hover:border-[#7C22F5] rounded-[13px] p-5 shadow-card card-hover-effect cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C22F5] flex items-center justify-center group-hover:bg-[#7C22F5] group-hover:text-white transition-colors shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#667085] bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </div>

                <h3 className="text-[16px] font-bold text-[#11152B] mb-1 group-hover:text-[#7C22F5] transition-colors">
                  {cat.label}
                </h3>
                <p className="text-[12px] text-[#667085] leading-relaxed mb-4">
                  {cat.desc}
                </p>
              </div>

              <div className="flex items-center text-[12px] font-semibold text-[#7C22F5] gap-1 group-hover:translate-x-1 transition-transform">
                <span>Browse {cat.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
