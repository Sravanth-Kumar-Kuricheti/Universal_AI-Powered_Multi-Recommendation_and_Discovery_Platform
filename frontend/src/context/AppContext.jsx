import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. Favorites in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('recomind_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 2. Search History in localStorage
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('recomind_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 3. Compare Items in localStorage (max 5)
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('recomind_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('recomind_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('recomind_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('recomind_compare', JSON.stringify(compareList));
  }, [compareList]);

  // Favorite actions
  const toggleFavorite = (item) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id);
      if (exists) {
        return prev.filter((f) => f.id !== item.id);
      } else {
        return [item, ...prev];
      }
    });
  };

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  // History actions
  const addHistoryItem = (query, category = 'all', count = 0) => {
    if (!query || !query.trim()) return;
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.query.toLowerCase() !== query.toLowerCase());
      const newItem = {
        id: Date.now().toString(),
        query: query.trim(),
        category,
        count,
        timestamp: new Date().toISOString(),
      };
      return [newItem, ...filtered].slice(0, 50);
    });
  };

  const removeHistoryItem = (id) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const clearHistory = () => setHistory([]);

  // Compare actions (up to 5 items)
  const toggleCompare = (item) => {
    setCompareList((prev) => {
      const exists = prev.some((c) => c.id === item.id);
      if (exists) {
        return prev.filter((c) => c.id !== item.id);
      }
      if (prev.length >= 5) {
        alert('You can compare a maximum of 5 recommendations at a time.');
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFromCompare = (id) => {
    setCompareList((prev) => prev.filter((c) => c.id !== id));
  };

  const clearCompare = () => setCompareList([]);
  const isInCompare = (id) => compareList.some((c) => c.id === id);

  return (
    <AppContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        history,
        addHistoryItem,
        removeHistoryItem,
        clearHistory,
        compareList,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileDrawerOpen,
        setMobileDrawerOpen,
        aiAssistantOpen,
        setAiAssistantOpen,
        activeCategory,
        setActiveCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
