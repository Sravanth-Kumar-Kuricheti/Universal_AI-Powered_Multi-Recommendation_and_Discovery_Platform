import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  ShoppingBag,
  Film,
  BookOpen,
  Briefcase,
  Compass,
  Utensils,
  Video,
  Code,
  FileText,
  Heart,
  History,
  Scale,
  Settings,
  Info,
  ChevronLeft,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CATEGORIES_LIST = [
  { id: 'courses', label: 'Courses & Learning', icon: GraduationCap },
  { id: 'products', label: 'Products & Shopping', icon: ShoppingBag },
  { id: 'movies', label: 'Movies & Entertainment', icon: Film },
  { id: 'books', label: 'Books & Reading', icon: BookOpen },
  { id: 'jobs', label: 'Jobs & Careers', icon: Briefcase },
  { id: 'tools', label: 'AI Tools & Resources', icon: Sparkles },
  { id: 'travel', label: 'Travel & Places', icon: Compass },
  { id: 'food', label: 'Food & Restaurants', icon: Utensils },
  { id: 'videos', label: 'Videos & Tutorials', icon: Video },
  { id: 'projects', label: 'Developer Resources', icon: Code },
  { id: 'articles', label: 'Research & Articles', icon: FileText },
];

export function Sidebar() {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    favorites,
    compareList,
    setAiAssistantOpen,
    setActiveCategory,
  } = useApp();

  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const navigate = useNavigate();

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    navigate(`/categories?cat=${catId}`);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-gradient-to-b from-[#17102F] to-[#211040] text-slate-300 border-r border-purple-950/60 transition-all duration-300 flex flex-col select-none overflow-hidden ${
        sidebarCollapsed ? 'w-[68px]' : 'w-[253px]'
      }`}
    >
      {/* 1. Sidebar Branding Header */}
      <div className="h-[65px] px-3.5 flex items-center justify-between border-b border-purple-900/30 shrink-0">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-[38px] h-[38px] shrink-0 rounded-xl bg-gradient-to-tr from-[#7C22F5] to-[#A855F7] p-1 flex items-center justify-center shadow-purple-glow-sm">
            <img src="/logo.svg" alt="RecoMind AI Logo" className="w-full h-full object-contain" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-white font-bold text-[15px] tracking-tight truncate leading-tight">
                RecoMind AI
              </span>
              <span className="text-purple-300/70 text-[10px] font-medium tracking-wide truncate">
                Multi-Recommendation System
              </span>
            </div>
          )}
        </NavLink>

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="text-purple-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors shrink-0"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Scrollable Navigation Section */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 text-[13px]">
        {/* Main Nav Items */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 h-[38px] px-3.5 rounded-[8px] font-medium transition-all ${
              isActive
                ? 'bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white shadow-purple-glow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`
          }
          title="Home"
        >
          <Home className="w-[17px] h-[17px] shrink-0" />
          {!sidebarCollapsed && <span>Home</span>}
        </NavLink>

        <NavLink
          to="/recommendations"
          className={({ isActive }) =>
            `flex items-center gap-3 h-[38px] px-3.5 rounded-[8px] font-medium transition-all ${
              isActive
                ? 'bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white shadow-purple-glow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`
          }
          title="Recommendations"
        >
          <Sparkles className="w-[17px] h-[17px] shrink-0 text-[#C084FC]" />
          {!sidebarCollapsed && <span>Recommendations</span>}
        </NavLink>

        {/* Expandable Category Menu */}
        <div>
          <button
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            className={`w-full flex items-center justify-between h-[38px] px-3.5 rounded-[8px] font-medium transition-all text-slate-300 hover:text-white hover:bg-white/5`}
            title="Explore by Category"
          >
            <div className="flex items-center gap-3">
              <Layers className="w-[17px] h-[17px] shrink-0 text-purple-400" />
              {!sidebarCollapsed && <span>Explore by Category</span>}
            </div>
            {!sidebarCollapsed && (
              categoriesOpen ? <ChevronDown className="w-3.5 h-3.5 text-purple-400" /> : <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
            )}
          </button>

          {/* Subcategories */}
          {!sidebarCollapsed && categoriesOpen && (
            <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-purple-900/30 ml-4 my-1">
              {CATEGORIES_LIST.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="w-full flex items-center gap-2.5 h-[32px] px-2 rounded-md text-[12px] text-slate-400 hover:text-white hover:bg-white/5 transition-all truncate text-left"
                  >
                    <IconComponent className="w-3.5 h-3.5 shrink-0 text-purple-400/80" />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-2 pb-1 border-t border-purple-900/30 my-2" />

        {/* Secondary Navigation */}
        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `flex items-center justify-between h-[38px] px-3.5 rounded-[8px] font-medium transition-all ${
              isActive
                ? 'bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`
          }
          title="My Favorites"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-[17px] h-[17px] shrink-0 text-rose-400" />
            {!sidebarCollapsed && <span>My Favorites</span>}
          </div>
          {!sidebarCollapsed && favorites.length > 0 && (
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-rose-500/20 text-rose-300 font-semibold">
              {favorites.length}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex items-center gap-3 h-[38px] px-3.5 rounded-[8px] font-medium transition-all ${
              isActive
                ? 'bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`
          }
          title="History"
        >
          <History className="w-[17px] h-[17px] shrink-0 text-sky-400" />
          {!sidebarCollapsed && <span>History</span>}
        </NavLink>

        <NavLink
          to="/compare"
          className={({ isActive }) =>
            `flex items-center justify-between h-[38px] px-3.5 rounded-[8px] font-medium transition-all ${
              isActive
                ? 'bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`
          }
          title="Compare"
        >
          <div className="flex items-center gap-3">
            <Scale className="w-[17px] h-[17px] shrink-0 text-amber-400" />
            {!sidebarCollapsed && <span>Compare</span>}
          </div>
          {!sidebarCollapsed && compareList.length > 0 && (
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#7C22F5] text-white font-bold">
              {compareList.length}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `flex items-center gap-3 h-[38px] px-3.5 rounded-[8px] font-medium transition-all ${
              isActive
                ? 'bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`
          }
          title="About"
        >
          <Info className="w-[17px] h-[17px] shrink-0 text-indigo-400" />
          {!sidebarCollapsed && <span>About</span>}
        </NavLink>
      </div>

      {/* 3. AI Assistant Bottom Card */}
      {!sidebarCollapsed ? (
        <div className="p-3 shrink-0">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-950/60 via-[#1C1236] to-purple-900/30 border border-purple-500/25 relative overflow-hidden shadow-lg">
            {/* Soft decorative background glow */}
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#7C22F5]/25 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#7C22F5]/30 border border-[#A855F7]/40 flex items-center justify-center shrink-0">
                <img src="/robot.svg" alt="Robot AI" className="w-5 h-5 object-contain" />
              </div>
              <span className="text-white font-semibold text-[13px] tracking-tight">AI Assistant</span>
            </div>

            <p className="text-purple-200/70 text-[11px] leading-tight mb-2.5">
              Ask anything and get personalized recommendations!
            </p>

            <button
              onClick={() => setAiAssistantOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white font-medium text-[12px] shadow-purple-glow-sm hover:opacity-95 transition-opacity"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat Now</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2 shrink-0 flex justify-center">
          <button
            onClick={() => setAiAssistantOpen(true)}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C22F5] to-[#A855F7] text-white flex items-center justify-center shadow-purple-glow-sm hover:opacity-95"
            title="Open AI Assistant"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
