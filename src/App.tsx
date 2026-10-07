/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MarketCategory, TickerQuote, SimulatedPosition } from './types/market';
import { ALL_QUOTES } from './data/marketData';
import { Header } from './components/Header';
import { TickerMarquee } from './components/TickerMarquee';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { StocksScreen } from './components/screens/StocksScreen';
import { CryptoScreen } from './components/screens/CryptoScreen';
import { ForexScreen } from './components/screens/ForexScreen';
import { FuturesScreen } from './components/screens/FuturesScreen';
import { BondsScreen } from './components/screens/BondsScreen';
import { NewsScreen } from './components/screens/NewsScreen';
import { SymbolDetailModal } from './components/SymbolDetailModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { CommandPalette } from './components/CommandPalette';

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<MarketCategory>('overview');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Watchlist state
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>([
    'SPX',
    'NVDA',
    'AAPL',
    'BTC/USD',
    'XAU/USD',
  ]);

  // Simulated paper portfolio
  const [portfolioCash, setPortfolioCash] = useState<number>(100000);
  const [positions, setPositions] = useState<Record<string, SimulatedPosition>>({});

  // Keyboard shortcut for Command Palette (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme application
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#131722';
      document.body.style.color = '#d1d4dc';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8f9fd';
      document.body.style.color = '#131722';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleWatchlist = (symbol: string) => {
    setWatchlistSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const handleExecuteTrade = (symbol: string, side: 'BUY' | 'SELL', quantity: number, price: number) => {
    const totalCost = quantity * price;
    if (side === 'BUY') {
      setPortfolioCash((prev) => prev - totalCost);
      setPositions((prev) => {
        const existing = prev[symbol];
        const newQty = (existing?.quantity || 0) + quantity;
        const avgPrice = existing
          ? (existing.entryPrice * existing.quantity + totalCost) / newQty
          : price;
        return {
          ...prev,
          [symbol]: {
            symbol,
            side: 'BUY',
            quantity: newQty,
            entryPrice: avgPrice,
            currentPrice: price,
            pnl: 0,
            pnlPercent: 0,
            timestamp: Date.now(),
          },
        };
      });
    } else {
      // SELL
      const existing = positions[symbol];
      if (!existing || existing.quantity < quantity) {
        alert('Insufficient shares in simulated position to sell.');
        return;
      }
      setPortfolioCash((prev) => prev + totalCost);
      const remaining = existing.quantity - quantity;
      setPositions((prev) => {
        if (remaining <= 0) {
          const next = { ...prev };
          delete next[symbol];
          return next;
        }
        return {
          ...prev,
          [symbol]: {
            ...existing,
            quantity: remaining,
          },
        };
      });
    }
  };

  // Find active selected quote
  const activeQuote = selectedSymbol ? ALL_QUOTES.find((q) => q.symbol === selectedSymbol) : null;

  // Calculate total portfolio value (cash + positions value)
  const totalPortfolioValue =
    portfolioCash +
    Object.values(positions).reduce((acc, pos) => {
      const q = ALL_QUOTES.find((quote) => quote.symbol === pos.symbol);
      const curPrice = q ? q.price : pos.entryPrice;
      return acc + pos.quantity * curPrice;
    }, 0);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-[#f8f9fd] text-[#131722]'}`}>
      {/* Primary Header */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={setCurrentCategory}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleWatchlist={() => setIsWatchlistOpen((prev) => !prev)}
        watchlistCount={watchlistSymbols.length}
        theme={theme}
        onToggleTheme={toggleTheme}
        portfolioValue={totalPortfolioValue}
      />

      {/* Real-time Ticker Marquee Bar */}
      <TickerMarquee quotes={ALL_QUOTES.slice(0, 10)} onSelectSymbol={setSelectedSymbol} />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentCategory === 'overview' && (
          <OverviewScreen onSelectSymbol={setSelectedSymbol} />
        )}
        {currentCategory === 'stocks' && (
          <StocksScreen onSelectSymbol={setSelectedSymbol} />
        )}
        {currentCategory === 'crypto' && (
          <CryptoScreen onSelectSymbol={setSelectedSymbol} />
        )}
        {currentCategory === 'forex' && (
          <ForexScreen onSelectSymbol={setSelectedSymbol} />
        )}
        {currentCategory === 'futures' && (
          <FuturesScreen onSelectSymbol={setSelectedSymbol} />
        )}
        {currentCategory === 'bonds' && (
          <BondsScreen onSelectSymbol={setSelectedSymbol} />
        )}
        {currentCategory === 'news' && (
          <NewsScreen onSelectSymbol={setSelectedSymbol} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a2e39] bg-[#161a25] py-6 text-xs text-[#787b86]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#d1d4dc]">TradingView Markets</span>
            <span>· Global Markets Intelligence</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Market Data: Live Simulated</span>
            <span>·</span>
            <span>NYSE · NASDAQ · CME · ICE · CBOE</span>
          </div>

          <div className="text-[11px] text-center sm:text-right">
            <span>© 2026 TradingView Markets. Built for traders and analysts.</span>
          </div>
        </div>
      </footer>

      {/* Interactive Symbol Inspector Modal */}
      {activeQuote && (
        <SymbolDetailModal
          quote={activeQuote}
          onClose={() => setSelectedSymbol(null)}
          isWatchlisted={watchlistSymbols.includes(activeQuote.symbol)}
          onToggleWatchlist={handleToggleWatchlist}
          onExecuteTrade={handleExecuteTrade}
          currentPosition={positions[activeQuote.symbol]}
          portfolioCash={portfolioCash}
        />
      )}

      {/* Custom Watchlist Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistSymbols={watchlistSymbols}
        onSelectSymbol={setSelectedSymbol}
        onRemoveFromWatchlist={(sym) => setWatchlistSymbols((prev) => prev.filter((s) => s !== sym))}
        onAddToWatchlist={(sym) => {
          if (!watchlistSymbols.includes(sym)) {
            setWatchlistSymbols((prev) => [...prev, sym]);
          }
        }}
      />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSymbol={setSelectedSymbol}
      />
    </div>
  );
}
