import React, { useEffect, useState } from 'react';
import { TickerQuote } from '../types/market';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerMarqueeProps {
  quotes: TickerQuote[];
  onSelectSymbol: (symbol: string) => void;
}

export const TickerMarquee: React.FC<TickerMarqueeProps> = ({ quotes, onSelectSymbol }) => {
  // Live ticking simulation
  const [liveQuotes, setLiveQuotes] = useState<TickerQuote[]>(quotes);
  const [flashStates, setFlashStates] = useState<Record<string, 'up' | 'down' | null>>({});

  useEffect(() => {
    setLiveQuotes(quotes);
  }, [quotes]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random quote to simulate a real-time market tick
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const target = quotes[randomIndex];
      if (!target) return;

      const deltaPercent = (Math.random() - 0.49) * 0.08; // minor micro tick
      const priceDelta = target.price * (deltaPercent / 100);
      const isUp = priceDelta >= 0;

      setFlashStates((prev) => ({ ...prev, [target.symbol]: isUp ? 'up' : 'down' }));

      setLiveQuotes((prev) =>
        prev.map((q, idx) => {
          if (idx !== randomIndex) return q;
          const newPrice = Number((q.price + priceDelta).toFixed(q.price > 100 ? 2 : 4));
          const newChange = Number((q.change + priceDelta).toFixed(q.price > 100 ? 2 : 4));
          const newChangePercent = Number((q.changePercent + deltaPercent).toFixed(2));
          return {
            ...q,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
          };
        })
      );

      const timeout = setTimeout(() => {
        setFlashStates((prev) => ({ ...prev, [target.symbol]: null }));
      }, 900);

      return () => clearTimeout(timeout);
    }, 2400);

    return () => clearInterval(interval);
  }, [quotes]);

  return (
    <div className="w-full border-b border-[#2a2e39] bg-[#161a25] overflow-hidden text-xs select-none">
      <div className="flex items-center overflow-x-auto no-scrollbar py-1.5 px-3 divide-x divide-[#2a2e39]/60">
        {liveQuotes.map((q) => {
          const isPositive = q.changePercent >= 0;
          const flash = flashStates[q.symbol];
          const flashClass =
            flash === 'up'
              ? 'bg-[#089981]/20 ring-1 ring-[#089981]/50'
              : flash === 'down'
              ? 'bg-[#f23645]/20 ring-1 ring-[#f23645]/50'
              : '';

          return (
            <button
              key={q.symbol}
              onClick={() => onSelectSymbol(q.symbol)}
              className={`flex items-center gap-2 px-3.5 py-0.5 shrink-0 hover:bg-[#1e222d] transition-all rounded ${flashClass}`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#d1d4dc]">{q.symbol}</span>
                <span className="text-[11px] text-[#787b86] max-w-[80px] truncate hidden sm:inline">
                  {q.name}
                </span>
              </div>

              <span className="font-mono font-medium text-[#d1d4dc]">
                {q.price > 100
                  ? q.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : q.price.toFixed(4)}
              </span>

              <div
                className={`flex items-center gap-0.5 font-mono text-[11px] font-semibold ${
                  isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 shrink-0" />
                ) : (
                  <TrendingDown className="h-3 w-3 shrink-0" />
                )}
                <span>
                  {isPositive ? '+' : ''}
                  {q.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
