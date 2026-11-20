import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { SearchProvider } from './context/SearchContext';
import { AppLayout } from './components/layout/AppLayout';
import { Home } from './pages/Home';
import { Recommendations } from './pages/Recommendations';
import { Categories } from './pages/Categories';
import { Compare } from './pages/Compare';
import { Favorites } from './pages/Favorites';
import { History } from './pages/History';
import { About } from './pages/About';

export default function App() {
  return (
    <AppProvider>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="categories" element={<Categories />} />
              <Route path="explore" element={<Categories />} />
              <Route path="compare" element={<Compare />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="history" element={<History />} />
              <Route path="about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </AppProvider>
  );
}
