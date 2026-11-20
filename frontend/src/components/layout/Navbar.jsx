import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, Sparkles, Menu, Moon, Sun, Scale } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Navbar() {
  const { setMobileDrawerOpen, setAiAssistantOpen, compareList } = useApp();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    { label: 'Explore', path: '/explore' },
    { label: 'Compare', path: '/compare', badge: compareList.length > 0 ? compareList.length : null },
    { label: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-30 h-[53px] bg-[#111329] border-b border-purple-900/30 px-4 sm:px-6 flex items-center justify-between text-white select-none">
      {/* Mobile hamburger menu toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile branding preview */}
        <div className="lg:hidden flex items-center gap-2">
          <img src="/logo.svg" alt="RecoMind AI Logo" className="w-7 h-7" />
          <span className="font-bold text-sm tracking-tight text-white">RecoMind AI</span>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden lg:flex items-center gap-7 h-full">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `relative flex items-center gap-1.5 h-full text-[13px] font-medium transition-colors ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#7C22F5] text-white">
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#7C22F5] rounded-t-full shadow-purple-glow-sm" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Ask AI Pill Button */}
        <button
          onClick={() => setAiAssistantOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#7C22F5]/40 to-[#A855F7]/30 border border-[#7C22F5]/50 text-purple-200 hover:text-white hover:border-[#A855F7] transition-all text-xs font-medium"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
          <span>Ask AI</span>
        </button>

        {/* Notifications Icon with subtle status dot */}
        <div className="relative">
          <button
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="System Updates"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
        </div>

        {/* Theme indicator pill (Dark theme optimized) */}
        <div
          className="flex items-center p-1 rounded-lg bg-white/5 text-purple-300 text-xs"
          title="Dark Theme"
        >
          <Moon className="w-3.5 h-3.5 text-purple-400" />
        </div>
      </div>
    </header>
  );
}
