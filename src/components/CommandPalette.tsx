import React, { useState, useEffect, useRef } from 'react';
import { ALL_QUOTES } from '../data/marketData';
import { TickerQuote } from '../types/market';
import { Search, X, TrendingUp, TrendingDown, CornerDownLeft } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol: (symbol: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectSymbol,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const filtered = query.trim()
    ? ALL_QUOTES.filter(
        (q) =>
          q.symbol.toLowerCase().includes(query.toLowerCase()) ||
          q.name.toLowerCase().includes(query.toLowerCase()) ||
          (q.sector && q.sector.toLowerCase().includes(query.toLowerCase()))
      )
    : ALL_QUOTES.slice(0, 8); // Suggestions

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filtered.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelectSymbol(filtered[selectedIndex].symbol);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/70 backdrop-blur-xs p-4">
      <div className="flex flex-col w-full max-w-xl rounded-xl border border-[#2a2e39] bg-[#1e222d] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-[#2a2e39] px-4 py-3 bg-[#161a25]">
          <Search className="h-4 w-4 text-[#787b86]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search markets, stocks, crypto, forex, commodities... (e.g. NVDA, SPX, BTC)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-white placeholder-[#787b86] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-[#787b86] hover:bg-[#2a2e39] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-[#2a2e39]/50 p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#787b86]">
              No matching financial symbols found for "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isPos = item.changePercent >= 0;
              return (
                <button
                  key={item.symbol}
                  onClick={() => {
                    onSelectSymbol(item.symbol);
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between p-2.5 rounded-lg text-left transition-colors ${
                    isSelected ? 'bg-[#2962ff]/15 ring-1 ring-[#2962ff]/40 text-white' : 'hover:bg-[#161a25] text-[#d1d4dc]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="rounded bg-[#2a2e39] px-1.5 py-0.5 text-[10px] font-mono text-[#787b86] uppercase">
                      {item.category}
                    </span>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-white mr-2">{item.symbol}</span>
                      <span className="text-xs text-[#787b86]">{item.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold">
                      ${item.price > 100 ? item.price.toFixed(2) : item.price.toFixed(4)}
                    </span>
                    <span
                      className={`font-mono text-xs font-bold flex items-center gap-0.5 ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </span>
                    {isSelected && <CornerDownLeft className="h-3.5 w-3.5 text-[#2962ff]" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-[#2a2e39] bg-[#161a25] px-4 py-2 text-[11px] text-[#787b86]">
          <span>Use ↑ ↓ to navigate, Enter to select</span>
          <span>ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
