import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileDrawer } from './MobileDrawer';
import { CompareBar } from '../compare/CompareBar';
import { AIChatPanel } from '../assistant/AIChatPanel';
import { useApp } from '../../context/AppContext';

export function AppLayout() {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#11152B] flex flex-col antialiased">
      {/* 1. Desktop Fixed Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* 2. Mobile Drawer */}
      <MobileDrawer />

      {/* 3. Main Workspace Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[253px]'
        }`}
      >
        {/* Sticky Top Navbar */}
        <Navbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>

      {/* 4. Global Floating Overlays: Compare Bar & AI Assistant Drawer */}
      <CompareBar />
      <AIChatPanel />
    </div>
  );
}
