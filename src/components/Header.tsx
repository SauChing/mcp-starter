import React from 'react';
import { MarketCategory } from '../types/market';
import { Search, Bookmark, Sun, Moon, TrendingUp, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  currentCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
  onOpenSearch: () => void;
  onToggleWatchlist: () => void;
  watchlistCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  portfolioValue: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenSearch,
  onToggleWatchlist,
  watchlistCount,
  theme,
  onToggleTheme,
  portfolioValue,
}) => {
  const navItems: { id: MarketCategory; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'futures', label: 'Futures' },
    { id: 'bonds', label: 'Bonds' },
    { id: 'news', label: 'News' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2a2e39] bg-[#131722]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onSelectCategory('overview')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#2962ff] text-white shadow-sm transition-transform group-hover:scale-105">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-[#d1d4dc] group-hover:text-white">
                TradingView
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787b86]">
                Markets
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectCategory(item.id)}
                  className={`relative px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap rounded-md ${
                    isActive
                      ? 'text-white bg-[#1e222d]'
                      : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d]/50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#2962ff] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Zone 3: Search, Watchlist, Portfolio & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-lg border border-[#2a2e39] bg-[#1e222d] px-2.5 py-1.5 text-xs text-[#787b86] hover:border-[#434651] hover:text-[#d1d4dc] transition-colors"
            title="Search markets (⌘K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search markets...</span>
            <kbd className="hidden sm:inline-block rounded bg-[#2a2e39] px-1.5 py-0.5 text-[10px] font-mono text-[#787b86]">
              ⌘K
            </kbd>
          </button>

          {/* Paper Portfolio Indicator */}
          <div className="hidden lg:flex items-center gap-2 rounded-lg border border-[#2a2e39] bg-[#1e222d] px-2.5 py-1.5 text-xs">
            <span className="text-[#787b86]">Sim Paper:</span>
            <span className="font-mono font-medium text-emerald-400">
              ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Watchlist Drawer Toggle */}
          <button
            onClick={onToggleWatchlist}
            className="relative flex items-center gap-1.5 rounded-lg border border-[#2a2e39] bg-[#1e222d] px-2.5 py-1.5 text-xs font-medium text-[#d1d4dc] hover:border-[#434651] transition-colors"
            title="Open Watchlist"
          >
            <Bookmark className="h-3.5 w-3.5 text-[#2962ff]" />
            <span className="hidden sm:inline">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2962ff] px-1 text-[10px] font-bold text-white">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2a2e39] bg-[#1e222d] text-[#787b86] hover:text-[#d1d4dc] hover:border-[#434651] transition-colors"
            title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Subnav Strip */}
      <div className="flex md:hidden border-t border-[#2a2e39] overflow-x-auto no-scrollbar px-4 py-1.5 gap-1 bg-[#131722]">
        {navItems.map((item) => {
          const isActive = currentCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectCategory(item.id)}
              className={`px-3 py-1 text-xs font-medium whitespace-nowrap rounded ${
                isActive ? 'text-white bg-[#1e222d]' : 'text-[#787b86]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
