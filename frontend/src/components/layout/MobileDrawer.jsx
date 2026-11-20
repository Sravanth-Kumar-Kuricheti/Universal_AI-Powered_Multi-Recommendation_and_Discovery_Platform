import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Sparkles, Heart, History, Scale, Info, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_LIST } from './Sidebar';

export function MobileDrawer() {
  const { mobileDrawerOpen, setMobileDrawerOpen, favorites, compareList, setActiveCategory } = useApp();
  const navigate = useNavigate();

  if (!mobileDrawerOpen) return null;

  const handleNavClick = () => {
    setMobileDrawerOpen(false);
  };

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setMobileDrawerOpen(false);
    navigate(`/categories?cat=${catId}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 lg:hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Drawer content */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 left-0 w-[280px] bg-gradient-to-b from-[#17102F] to-[#211040] text-white flex flex-col shadow-2xl border-r border-purple-900/40"
        >
          {/* Header */}
          <div className="h-[56px] px-4 flex items-center justify-between border-b border-purple-900/30">
            <div className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="RecoMind AI" className="w-8 h-8" />
              <div>
                <div className="font-bold text-sm">RecoMind AI</div>
                <div className="text-[10px] text-purple-300/70">Universal Discovery</div>
              </div>
            </div>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 text-sm">
            <NavLink
              to="/"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg ${
                  isActive ? 'bg-[#7C22F5] text-white' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/recommendations"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg ${
                  isActive ? 'bg-[#7C22F5] text-white' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              <Sparkles className="w-4 h-4 text-[#C084FC]" />
              <span>Recommendations</span>
            </NavLink>

            <div className="pt-2 text-[11px] font-semibold text-purple-400 uppercase tracking-wider px-3">
              Categories
            </div>

            <div className="grid grid-cols-1 gap-0.5">
              {CATEGORIES_LIST.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                  >
                    <Icon className="w-3.5 h-3.5 text-purple-400" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-purple-900/30 my-2" />

            <NavLink
              to="/favorites"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg ${
                  isActive ? 'bg-[#7C22F5] text-white' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Favorites</span>
              </div>
              {favorites.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500/20 text-rose-300">
                  {favorites.length}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/history"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg ${
                  isActive ? 'bg-[#7C22F5] text-white' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              <History className="w-4 h-4 text-sky-400" />
              <span>History</span>
            </NavLink>

            <NavLink
              to="/compare"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg ${
                  isActive ? 'bg-[#7C22F5] text-white' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Compare</span>
              </div>
              {compareList.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-[#7C22F5] text-white font-bold">
                  {compareList.length}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/about"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg ${
                  isActive ? 'bg-[#7C22F5] text-white' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              <Info className="w-4 h-4 text-indigo-400" />
              <span>About</span>
            </NavLink>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
