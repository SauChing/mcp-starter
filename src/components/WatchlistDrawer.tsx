import React, { useState } from 'react';
import { TickerQuote } from '../types/market';
import { ALL_QUOTES } from '../data/marketData';
import { X, Trash2, Plus, TrendingUp, TrendingDown, Bookmark } from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: string[];
  onSelectSymbol: (symbol: string) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
  onAddToWatchlist: (symbol: string) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  onSelectSymbol,
  onRemoveFromWatchlist,
  onAddToWatchlist,
}) => {
  const [quickAddSymbol, setQuickAddSymbol] = useState('');

  if (!isOpen) return null;

  // Find quotes for watchlisted symbols
  const watchlistedQuotes = watchlistSymbols
    .map((sym) => ALL_QUOTES.find((q) => q.symbol === sym))
    .filter((q): q is TickerQuote => q !== undefined);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSym = quickAddSymbol.trim().toUpperCase();
    if (!cleanSym) return;
    const exists = ALL_QUOTES.find((q) => q.symbol.toUpperCase() === cleanSym);
    if (exists) {
      onAddToWatchlist(exists.symbol);
      setQuickAddSymbol('');
    } else {
      alert(`Symbol "${cleanSym}" not recognized. Try SPX, NVDA, AAPL, BTC/USD, etc.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity">
      <div className="flex flex-col w-full max-w-sm sm:max-w-md bg-[#1e222d] border-l border-[#2a2e39] h-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2e39] px-4 py-3 bg-[#161a25]">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-[#2962ff]" />
            <h2 className="text-sm font-bold text-white">Custom Watchlist</h2>
            <span className="rounded bg-[#2a2e39] px-1.5 py-0.2 text-[10px] font-mono text-[#787b86]">
              {watchlistedQuotes.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-[#787b86] hover:bg-[#2a2e39] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleAdd} className="p-3 border-b border-[#2a2e39] bg-[#1a1e29]">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add symbol (e.g. TSLA, ETH/USD)..."
              value={quickAddSymbol}
              onChange={(e) => setQuickAddSymbol(e.target.value)}
              className="w-full rounded border border-[#2a2e39] bg-[#161a25] px-2.5 py-1.5 text-xs text-white placeholder-[#787b86] focus:border-[#2962ff] focus:outline-none uppercase font-mono"
            />
            <button
              type="submit"
              className="rounded bg-[#2962ff] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2557e0] transition-colors shrink-0 flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>

        {/* Watchlist Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/50 p-2">
          {watchlistedQuotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-[#787b86]">
              <Bookmark className="h-8 w-8 mb-2 opacity-30 text-[#787b86]" />
              <p>Your watchlist is empty.</p>
              <p className="mt-1">Add symbols using the search bar or "+ Watchlist" button on any asset.</p>
            </div>
          ) : (
            watchlistedQuotes.map((q) => {
              const isPos = q.changePercent >= 0;
              return (
                <div
                  key={q.symbol}
                  className="group flex items-center justify-between p-2.5 hover:bg-[#161a25] rounded transition-colors"
                >
                  <button
                    onClick={() => {
                      onSelectSymbol(q.symbol);
                      onClose();
                    }}
                    className="flex flex-1 items-center justify-between pr-3 text-left"
                  >
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-white group-hover:text-[#2962ff] transition-colors">
                        {q.symbol}
                      </div>
                      <div className="text-[10px] text-[#787b86] truncate max-w-[120px]">{q.name}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-white">
                        ${q.price > 100 ? q.price.toFixed(2) : q.price.toFixed(4)}
                      </div>
                      <div
                        className={`font-mono text-[11px] font-semibold flex items-center justify-end gap-0.5 ${
                          isPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>
                          {isPos ? '+' : ''}
                          {q.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onRemoveFromWatchlist(q.symbol)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#787b86] hover:text-[#f23645] transition-all"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
